import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Bot,
  BrainCircuit,
  Database,
  LoaderCircle,
  SendHorizontal,
  Sparkles,
  TerminalSquare,
} from 'lucide-react';

import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { analystService } from '@/services/analyst/analyst.service';
import { getApiErrorMessage } from '@/services/api/error';
import type { AnalystQueryResponse, ToolTraceEntry } from '@/types';

const quickPrompts = [
  'Quais sao os top 10 produtos mais vendidos?',
  'Quais categorias geram mais receita total?',
  'Qual o percentual de pedidos entregues fora do prazo?',
  'Qual estado concentra mais consumidores ativos?',
];

interface AnalystTurn {
  id: string;
  question: string;
  status: 'loading' | 'done' | 'error';
  response?: AnalystQueryResponse;
  error?: string;
}

export function AnalistaPage() {
  const [question, setQuestion] = useState('');
  const [turns, setTurns] = useState<AnalystTurn[]>([]);
  const [loading, setLoading] = useState(false);

  const latestResponse = useMemo(
    () => [...turns].reverse().find((turn) => turn.response)?.response ?? null,
    [turns],
  );

  const handleSubmit = async (forcedQuestion?: string) => {
    const nextQuestion = (forcedQuestion ?? question).trim();
    if (!nextQuestion || loading) {
      return;
    }

    const turnId = crypto.randomUUID();
    const pendingTurn: AnalystTurn = {
      id: turnId,
      question: nextQuestion,
      status: 'loading',
    };

    setTurns((current) => [...current, pendingTurn]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await analystService.perguntar(nextQuestion);
      setTurns((current) =>
        current.map((turn) =>
          turn.id === turnId
            ? {
                ...turn,
                status: 'done',
                response,
              }
            : turn,
        ),
      );
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'Nao foi possivel obter uma analise agora. Verifique a API do backend e a configuracao do Gemini.',
      );

      setTurns((current) =>
        current.map((turn) =>
          turn.id === turnId
            ? {
                ...turn,
                status: 'error',
                error: message,
              }
            : turn,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-8">
      <header className="overflow-hidden rounded-[30px] border border-[#c7d2fe] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_45%,#e0f2fe_100%)] p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-100">
              Analista AI
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
              Pergunte em linguagem natural e receba SQL executado com explicacao de negocio.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50 md:text-base">
              O agente usa React com Pydantic AI, consulta o schema do SQLite local, executa apenas SELECT e mostra o SQL final que sustentou a resposta.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <HighlightCard icon={<BrainCircuit size={18} />} label="Modelo" value="gemini-2.5-flash-lite" />
            <HighlightCard icon={<Database size={18} />} label="Fonte" value="SQLite local" />
          </div>
        </div>
      </header>

      <div className="grid gap-8 xl:grid-cols-[1.45fr_0.95fr]">
        <Card className="overflow-hidden">
          <div className="border-b border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-6 py-6 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                  Conversa com o agente
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--color-ink)]">
                  Analise autonoma orientada por banco
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                <Sparkles size={14} />
                Leitura segura
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void handleSubmit(prompt)}
                  className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm text-[var(--color-ink-soft)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[720px] space-y-6 overflow-y-auto bg-[linear-gradient(180deg,#f8fafc_0%,#f4f8ff_100%)] px-6 py-6 md:px-8">
            {turns.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-[var(--color-border)] bg-white/80 p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <Bot size={26} />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-[var(--color-ink)]">
                  Comece com uma pergunta de negocio
                </h3>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
                  Exemplos: ranking de produtos, receita por categoria, atrasos logisticos, avaliacao media por grupo de clientes ou distribuicao geografica de consumidores.
                </p>
              </div>
            ) : null}

            {turns.map((turn, index) => (
              <div key={turn.id} className="space-y-3">
                <div className="ml-auto max-w-3xl rounded-[28px] bg-[var(--color-ink)] px-5 py-4 text-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                    Pergunta {index + 1}
                  </div>
                  <p className="mt-2 text-sm leading-7 md:text-base">{turn.question}</p>
                </div>

                {turn.status === 'loading' ? (
                  <div className="max-w-4xl rounded-[28px] border border-[var(--color-border)] bg-white px-5 py-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center gap-3 text-[var(--color-primary)]">
                      <LoaderCircle size={18} className="animate-spin" />
                      <span className="text-sm font-semibold">O agente esta analisando schema, montando SQL e validando o resultado.</span>
                    </div>
                  </div>
                ) : null}

                {turn.status === 'error' ? (
                  <div className="max-w-4xl rounded-[28px] border border-[#fecaca] bg-[#fff5f5] px-5 py-5 text-sm leading-7 text-[#991b1b]">
                    {turn.error}
                  </div>
                ) : null}

                {turn.response ? (
                  <div className="max-w-4xl rounded-[28px] border border-[var(--color-border)] bg-white px-5 py-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                        Conclusao
                      </span>
                      <span className="rounded-full bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-medium text-[var(--color-ink-soft)]">
                        {turn.response.tool_trace.length} eventos de ferramentas
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[var(--color-ink-soft)] md:text-base">
                      {turn.response.result.conclusion}
                    </p>

                    <div className="mt-5 rounded-[24px] bg-[#0f172a] p-4 text-sm text-slate-100">
                      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        SQL executado
                      </div>
                      <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[13px] leading-6">
                        {turn.response.result.sql_used}
                      </pre>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--color-border)] bg-white px-6 py-6 md:px-8">
            <label className="block text-sm font-semibold text-[var(--color-ink-soft)]">
              Sua pergunta de negocio
            </label>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ex.: Quais categorias cresceram mais em receita media por pedido?"
              className="mt-3 min-h-[132px] w-full resize-none rounded-[24px] border border-[var(--color-border)] bg-[var(--color-page)] px-4 py-4 text-sm leading-7 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]/70"
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--color-ink-soft)]">
                O agente trabalha pergunta a pergunta e sempre executa SQL antes de responder.
              </p>
              <Button onClick={() => void handleSubmit()} disabled={loading || question.trim().length < 3}>
                {loading ? <LoaderCircle size={18} className="animate-spin" /> : <SendHorizontal size={18} />}
                Analisar pergunta
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 md:p-7">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--color-primary-soft)] p-3 text-[var(--color-primary)]">
                <TerminalSquare size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                  Tool Trace
                </p>
                <h2 className="mt-1 text-xl font-semibold text-[var(--color-ink)]">
                  Ferramentas acionadas
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {latestResponse?.tool_trace.length ? (
                latestResponse.tool_trace.map((entry, index) => (
                  <ToolTraceCard key={`${entry.tool_name}-${entry.tool_call_id ?? index}`} entry={entry} index={index} />
                ))
              ) : (
                <p className="rounded-[24px] bg-[var(--color-surface-muted)] px-4 py-4 text-sm leading-7 text-[var(--color-ink-soft)]">
                  Quando voce rodar uma pergunta, esta coluna mostra as chamadas para `get_distinct_values` e `run_query` usadas pelo agente.
                </p>
              )}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_100%)] px-6 py-6 md:px-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                Boas perguntas
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[var(--color-ink)]">
                Como extrair respostas melhores
              </h2>
            </div>
            <div className="space-y-4 px-6 py-6 md:px-7">
              <TipCard
                title="Especifique a metrica"
                description="Use termos como receita, quantidade de pedidos, ticket medio ou avaliacao media para reduzir ambiguidade."
              />
              <TipCard
                title="Informe o recorte"
                description="Fale se voce quer top 10, por categoria, por estado ou por periodo para orientar a agregacao correta."
              />
              <TipCard
                title="Peça comparacoes"
                description="Perguntas como 'compare categorias' ou 'mostre os piores atrasos' ajudam o agente a retornar algo mais analitico."
              />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

interface HighlightCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function HighlightCard({ icon, label, value }: HighlightCardProps) {
  return (
    <div className="rounded-[24px] border border-white/20 bg-white/10 px-4 py-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-blue-100">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-[0.18em]">{label}</span>
      </div>
      <p className="mt-3 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

interface ToolTraceCardProps {
  entry: ToolTraceEntry;
  index: number;
}

function ToolTraceCard({ entry, index }: ToolTraceCardProps) {
  const isResult = entry.step_type === 'tool_result';
  const accentClass = isResult
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : 'border-blue-200 bg-blue-50 text-blue-700';

  return (
    <div className="rounded-[24px] border border-[var(--color-border)] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
            Etapa {index + 1}
          </div>
          <h3 className="mt-1 text-sm font-semibold text-[var(--color-ink)]">{entry.tool_name}</h3>
        </div>
        <span className={[ 'rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]', accentClass ].join(' ')}>
          {isResult ? 'retorno' : 'chamada'}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-[var(--color-ink-soft)]">{entry.message}</p>

      {entry.arguments ? (
        <div className="mt-3 rounded-[18px] bg-[var(--color-surface-muted)] p-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
            Argumentos
          </div>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-[12px] leading-6 text-[var(--color-ink-soft)]">
            {JSON.stringify(entry.arguments, null, 2)}
          </pre>
        </div>
      ) : null}

      {entry.result_preview ? (
        <div className="mt-3 rounded-[18px] bg-[#0f172a] p-3 text-slate-100">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Preview do retorno
          </div>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-[12px] leading-6 text-slate-200">
            {entry.result_preview}
          </pre>
        </div>
      ) : null}
    </div>
  );
}

interface TipCardProps {
  title: string;
  description: string;
}

function TipCard({ title, description }: TipCardProps) {
  return (
    <div className="rounded-[24px] border border-[var(--color-border)] bg-white px-4 py-4">
      <h3 className="text-sm font-semibold text-[var(--color-ink)]">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[var(--color-ink-soft)]">{description}</p>
    </div>
  );
}
