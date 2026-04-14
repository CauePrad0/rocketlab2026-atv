import { Boxes, DollarSign, Star } from 'lucide-react';

import { StatCard } from '@/components/molecules/StatCard';
import type { DashboardResumo } from '@/types';

interface SummarySectionProps {
  resumo: DashboardResumo;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function SummarySection({ resumo }: SummarySectionProps) {
  return (
    <section className="grid gap-5 md:grid-cols-3">
      <StatCard
        title="Produtos cadastrados"
        value={String(resumo.total_produtos)}
        description="Quantidade total de SKUs disponiveis banco."
        icon={Boxes}
      />
      <StatCard
        title="Receita total"
        value={formatCurrency(resumo.receita_total)}
        description="Faturamento Total do Ecommerce."
        icon={DollarSign}
      />
      <StatCard
        title="Media geral das lojas"
        value={resumo.media_geral_lojas.toFixed(1)}
        description="Nota media das avaliacoes."
        icon={Star}
      />
    </section>
  );
}
