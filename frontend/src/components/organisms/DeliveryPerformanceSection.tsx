import { Truck } from 'lucide-react';

import { Card } from '@/components/atoms/Card';
import { PerformanceBar } from '@/components/molecules/PerformanceBar';
import type { PerformanceEntrega } from '@/types';

interface DeliveryPerformanceSectionProps {
  performance: PerformanceEntrega[];
}

export function DeliveryPerformanceSection({
  performance,
}: DeliveryPerformanceSectionProps) {
  const total = performance.reduce((accumulator, item) => accumulator + item.quantidade, 0);

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl bg-[var(--color-primary-soft)] p-3 text-[var(--color-primary)]">
          <Truck size={20} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--color-ink)]">Performance de entregas</h2>
          <p className="text-sm text-[var(--color-ink-soft)]">
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {performance.map((item) => (
          <PerformanceBar key={item.status_entrega} item={item} total={total} />
        ))}
      </div>
    </Card>
  );
}
