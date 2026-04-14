import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/atoms/Button';
import { SearchBar } from '@/components/molecules/SearchBar';

interface CatalogTemplateProps {
  busca: string;
  onBuscaChange: (value: string) => void;
  onBuscaSubmit: () => void;
  onCreateClick: () => void;
  children: ReactNode;
}

export function CatalogTemplate({
  busca,
  onBuscaChange,
  onBuscaSubmit,
  onCreateClick,
  children,
}: CatalogTemplateProps) {
  return (
    <section className="mx-auto max-w-7xl">
      <header className="mb-8 rounded-[24px] border border-[var(--color-border)] bg-white px-6 py-7 md:px-8 md:py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
              Catalogo
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-[var(--color-ink)] md:text-4xl">
              Gestão de produtos
            </h1>
            <p className="mt-3 text-sm leading-6 text-[var(--color-ink-soft)] md:text-base">
              Busque, visualize detalhes, cadastre, edite e remova produtos.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 lg:max-w-xl lg:items-end">
            <SearchBar
              value={busca}
              onChange={onBuscaChange}
              onSubmit={onBuscaSubmit}
            />
            <Button onClick={onCreateClick}>
              <Plus size={18} />
              Novo produto
            </Button>
          </div>
        </div>
      </header>

      {children}
    </section>
  );
}
