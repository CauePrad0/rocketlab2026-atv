import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[28px] border border-dashed border-[var(--color-border)] bg-white px-6 text-center">
      <Icon size={44} className="mb-4 text-[var(--color-ink-muted)]" />
      <h3 className="text-lg font-semibold text-[var(--color-ink)]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-[var(--color-ink-soft)]">{description}</p>
    </div>
  );
}
