import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={[
        'rounded-[28px] border border-[var(--color-border)] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
