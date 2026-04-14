import type { InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function TextInput({ className = '', label, ...props }: TextInputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink-soft)]">
      {label ? <span>{label}</span> : null}
      <input
        className={[
          'w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]/70',
          className,
        ].join(' ')}
        {...props}
      />
    </label>
  );
}
