import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function IconButton({
  children,
  className = '',
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={[
        'inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-ink-soft)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)]',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
