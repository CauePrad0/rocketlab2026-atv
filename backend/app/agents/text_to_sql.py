from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any, Callable

from pydantic import BaseModel, Field
from pydantic_ai import Agent, AgentRunResultEvent, FunctionToolCallEvent, FunctionToolResultEvent, RunContext
from pydantic_ai.exceptions import ModelRetry

from app.agents.database_manager import DatabaseManager
from app.config import settings

# Callback opcional usado pela CLI para imprimir o uso das tools em tempo real.
TraceCallback = Callable[['ToolTraceEntry'], None]

BASE_SYSTEM_PROMPT = """
Voce e um Analista de Dados especialista em E-commerce.
Sua funcao e somente transformar perguntas de negocio em SQL, executar a consulta e responder em linguagem humana.

Regras:
1. Use apenas consultas de leitura iniciadas com SELECT.
2. Nunca invente resultados. Sempre use a ferramenta run_query.
3. Se existir duvida sobre como um valor textual esta salvo no banco, use get_distinct_values.
4. Se o SQL falhar, corrija e tente novamente.
5. A resposta final deve ter apenas os campos sql_used e conclusion.
6. Em conclusion, explique o resultado em portugues do Brasil, de forma clara e objetiva.
""".strip()


@dataclass
class AgentDependencies:
    # O agente carrega o acesso ao banco nesta classe.
    database: DatabaseManager
    schema: str | None = None
    last_sql: str | None = None


class AnalystResult(BaseModel):
    """Resposta final do agente."""

    sql_used: str = Field(description='Query SQL final que funcionou.')
    conclusion: str = Field(description='Explicacao em linguagem humana para o usuario final.')


class ToolTraceEntry(BaseModel):
    step_type: str
    tool_name: str
    message: str
    arguments: dict[str, Any] | None = None
    result_preview: str | None = None


class AnalystQueryRequest(BaseModel):
    question: str = Field(min_length=3)


class AnalystQueryResponse(BaseModel):
    question: str
    result: AnalystResult
    tool_trace: list[ToolTraceEntry]


analyst_agent = Agent(
    settings.ANALYST_MODEL,
    deps_type=AgentDependencies,
    output_type=AnalystResult,
    system_prompt=BASE_SYSTEM_PROMPT,
)


@analyst_agent.system_prompt(dynamic=True)
async def add_schema_to_prompt(ctx: RunContext[AgentDependencies]) -> str:
    # O schema e carregado uma vez por execucao e enviado ao modelo.
    if ctx.deps.schema is None:
        ctx.deps.schema = await ctx.deps.database.get_schema()

    return f'Schema do banco de dados:\n\n{ctx.deps.schema}'


@analyst_agent.tool(retries=2)
async def get_distinct_values(
    ctx: RunContext[AgentDependencies],
    table_name: str,
    column_name: str,
) -> dict[str, Any]:
    """Retorna valores distintos de uma coluna para ajudar o modelo a montar filtros corretos."""

    try:
        return await ctx.deps.database.get_distinct_values(table_name, column_name)
    except Exception as exc:
        raise ModelRetry(f'Erro ao buscar valores distintos: {exc}') from exc


@analyst_agent.tool(retries=3)
async def run_query(ctx: RunContext[AgentDependencies], sql_query: str) -> dict[str, Any]:
    """Executa uma consulta SELECT no SQLite."""

    try:
        result = await ctx.deps.database.run_query(sql_query)
        ctx.deps.last_sql = result['executed_sql']
        return result
    except Exception as exc:
        raise ModelRetry(f'Erro ao executar SQL: {exc}') from exc


@analyst_agent.output_validator
def validate_result(ctx: RunContext[AgentDependencies], output: AnalystResult) -> AnalystResult:
    # Garante que o agente so finalize depois de executar uma query real.
    if ctx.partial_output:
        return output

    if ctx.deps.last_sql is None:
        raise ModelRetry('Voce precisa executar a ferramenta run_query antes de finalizar.')

    output.sql_used = ctx.deps.last_sql
    return output


def build_database_manager() -> DatabaseManager:
    return DatabaseManager(
        settings.DATABASE_FILE,
        distinct_limit=settings.ANALYST_DISTINCT_LIMIT,
        query_row_limit=settings.ANALYST_QUERY_LIMIT,
    )


async def run_analyst_query(
    question: str,
    database: DatabaseManager,
    on_trace: TraceCallback | None = None,
) -> AnalystQueryResponse:
    cleaned_question = question.strip()
    if not cleaned_question:
        raise ValueError('A pergunta nao pode estar vazia.')

    deps = AgentDependencies(database=database)
    tool_trace: list[ToolTraceEntry] = []
    final_result: AnalystResult | None = None

    async for event in analyst_agent.run_stream_events(cleaned_question, deps=deps):
        if isinstance(event, FunctionToolCallEvent):
            trace = ToolTraceEntry(
                step_type='tool_call',
                tool_name=event.part.tool_name,
                message='Ferramenta acionada pelo agente.',
                arguments=_read_args(event.part.args),
            )
            tool_trace.append(trace)
            if on_trace:
                on_trace(trace)
            continue

        if isinstance(event, FunctionToolResultEvent):
            trace = ToolTraceEntry(
                step_type='tool_result',
                tool_name=event.result.tool_name,
                message='Resultado devolvido para o modelo.',
                result_preview=_short_text(event.result.content),
            )
            tool_trace.append(trace)
            if on_trace:
                on_trace(trace)
            continue

        if isinstance(event, AgentRunResultEvent):
            final_result = event.result.output

    if final_result is None:
        raise RuntimeError('O agente nao retornou resultado final.')

    return AnalystQueryResponse(
        question=cleaned_question,
        result=final_result,
        tool_trace=tool_trace,
    )


def _read_args(raw_args: Any) -> dict[str, Any] | None:
    if isinstance(raw_args, dict):
        return raw_args

    if isinstance(raw_args, str):
        try:
            parsed = json.loads(raw_args)
        except json.JSONDecodeError:
            return {'raw': raw_args}
        return parsed if isinstance(parsed, dict) else {'raw': parsed}

    args_json = getattr(raw_args, 'args_json', None)
    if isinstance(args_json, str):
        try:
            parsed = json.loads(args_json)
        except json.JSONDecodeError:
            return {'raw': args_json}
        return parsed if isinstance(parsed, dict) else {'raw': parsed}

    return None


def _short_text(content: Any) -> str:
    text = str(content)
    return text if len(text) <= 500 else f'{text[:500]}...'
