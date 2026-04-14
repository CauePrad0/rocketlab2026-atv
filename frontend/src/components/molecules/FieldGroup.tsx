import type { ReactNode } from 'react';

interface FieldGroupProps {
  label: string;
  children: ReactNode;
}

export function FieldGroup({ label, children }: FieldGroupProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[var(--color-ink-soft)]">{label}</p>
      <div className="text-base font-semibold text-[var(--color-ink)]">{children}</div>
    </div>
  );
}
