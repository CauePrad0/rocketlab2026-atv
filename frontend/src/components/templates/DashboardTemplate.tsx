import type { ReactNode } from 'react';

interface DashboardTemplateProps {
  children: ReactNode;
}

export function DashboardTemplate({ children }: DashboardTemplateProps) {
  return (
    <section className="mx-auto max-w-7xl">
      <header className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
          Dashboard
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-[var(--color-ink)]">
          Indicadores reais de Produtos Cadastrados, Receita Total e Media Geral das Lojas
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--color-ink-soft)]">
        </p>
      </header>

      <div className="space-y-8">{children}</div>
    </section>
  );
}
