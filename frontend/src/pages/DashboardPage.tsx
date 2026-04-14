import { AlertCircle } from 'lucide-react';

import { Card } from '@/components/atoms/Card';
import { Spinner } from '@/components/atoms/Spinner';
import { DeliveryPerformanceSection } from '@/components/organisms/DeliveryPerformanceSection';
import { SummarySection } from '@/components/organisms/SummarySection';
import { DashboardTemplate } from '@/components/templates/DashboardTemplate';
import { useDashboard } from '@/hooks/useDashboard';

export function DashboardPage() {
  const { resumo, performance, loading, error } = useDashboard();

  return (
    <DashboardTemplate>
      {loading ? (
        <Card className="flex min-h-[320px] flex-col items-center justify-center gap-4">
          <Spinner />
          <p className="text-sm text-[var(--color-ink-soft)]">Carregando indicadores...</p>
        </Card>
      ) : (
        <>
          {error ? (
            <Card className="flex items-center gap-3 p-4 text-sm text-[var(--color-danger)]">
              <AlertCircle size={18} />
              {error}
            </Card>
          ) : null}
          <SummarySection resumo={resumo} />
          <DeliveryPerformanceSection performance={performance} />
        </>
      )}
    </DashboardTemplate>
  );
}
