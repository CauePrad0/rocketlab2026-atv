import { PackageSearch } from 'lucide-react';

import { EmptyState } from '@/components/atoms/EmptyState';
import { ProductCard } from '@/components/organisms/ProductCard';
import type { Produto } from '@/types';

interface ProductGridProps {
  produtos: Produto[];
  onSelect: (id: string) => void;
}

export function ProductGrid({ produtos, onSelect }: ProductGridProps) {
  if (produtos.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="Nenhum produto encontrado"
        description="Ajuste a busca ou cadastre um novo item para alimentar o catalogo."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {produtos.map((produto) => (
        <ProductCard
          key={produto.id_produto}
          produto={produto}
          onClick={() => onSelect(produto.id_produto)}
        />
      ))}
    </div>
  );
}
