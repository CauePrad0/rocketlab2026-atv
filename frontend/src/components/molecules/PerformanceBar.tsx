import { Card } from '@/components/atoms/Card';
import type { PerformanceEntrega } from '@/types';

interface PerformanceBarProps {
  item: PerformanceEntrega;
  total: number;
}

export function PerformanceBar({ item, total }: PerformanceBarProps) {
  const percentual = total > 0 ? (item.quantidade / total) * 100 : 0;

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-[var(--color-ink)]">{item.status_entrega}</span>
        <span className="text-sm text-[var(--color-ink-soft)]">{item.quantidade}</span>
      </div>
      <div className="h-3 rounded-full bg-[var(--color-surface-muted)]">
        <div
          className="h-3 rounded-full bg-[linear-gradient(90deg,var(--color-primary),var(--color-highlight))]"
          style={{ width: `${percentual}%` }}
        />
      </div>
    </Card>
  );
}
