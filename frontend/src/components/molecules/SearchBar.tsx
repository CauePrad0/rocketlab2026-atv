import { Search } from 'lucide-react';

import { TextInput } from '@/components/atoms/TextInput';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  return (
    <form
      className="relative w-full md:max-w-md"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]" />
      <TextInput
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Busque por nome ou categoria"
        className="pl-11"
      />
    </form>
  );
}
