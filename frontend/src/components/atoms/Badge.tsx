import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex w-fit rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
      {children}
    </span>
  );
}
