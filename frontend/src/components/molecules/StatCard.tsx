import type { LucideIcon } from 'lucide-react';

import { Card } from '@/components/atoms/Card';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--color-ink-soft)]">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--color-ink)]">{value}</p>
        </div>
        <div className="rounded-2xl bg-[var(--color-primary-soft)] p-3 text-[var(--color-primary)]">
          <Icon size={22} />
        </div>
      </div>
      <p className="text-sm text-[var(--color-ink-soft)]">{description}</p>
    </Card>
  );
}
