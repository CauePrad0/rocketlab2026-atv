from __future__ import annotations

import asyncio
import os

from app.agents import ToolTraceEntry, build_database_manager, run_analyst_query


def print_trace(entry: ToolTraceEntry) -> None:
    # Mostra no terminal quais tools o agente usou durante a execucao.
    print(f'[{entry.step_type}] {entry.tool_name}')
    if entry.arguments:
        print(f'  argumentos: {entry.arguments}')
    if entry.result_preview:
        print(f'  retorno: {entry.result_preview}')


async def main() -> None:
    if not os.getenv('GOOGLE_API_KEY'):
        print('Aviso: GOOGLE_API_KEY nao foi definida. O agente pode falhar ao chamar o Gemini.')

    database_manager = build_database_manager()

    print('Agente Text-to-SQL pronto.')
    print("Digite uma pergunta de negocio ou 'sair' para encerrar.\n")

    while True:
        try:
            question = await asyncio.to_thread(input, 'Pergunta > ')
        except (EOFError, KeyboardInterrupt):
            print('\nEncerrando.')
            break

        if question.strip().lower() in {'sair', 'exit', 'quit'}:
            print('Sessao encerrada.')
            break

        if not question.strip():
            continue

        try:
            response = await run_analyst_query(question, database_manager, on_trace=print_trace)
        except Exception as exc:
            print(f'Erro: {exc}\n')
            continue

        print('\nSQL final:')
        print(response.result.sql_used)
        print('\nResposta:')
        print(response.result.conclusion)
        print()


if __name__ == '__main__':
    asyncio.run(main())
