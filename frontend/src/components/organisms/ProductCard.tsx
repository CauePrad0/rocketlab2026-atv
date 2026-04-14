import { Badge } from '@/components/atoms/Badge';
import { Card } from '@/components/atoms/Card';
import { ProductImage } from '@/components/molecules/ProductImage';
import type { Produto } from '@/types';

interface ProductCardProps {
  produto: Produto;
  onClick: () => void;
}

export function ProductCard({ produto, onClick }: ProductCardProps) {
  return (
    <button type="button" className="group text-left" onClick={onClick}>
      <Card className="h-full p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.12)]">
        <ProductImage
          imageUrl={produto.imagem_url}
          alt={produto.nome_produto}
          className="mb-4 h-40"
        />
        <Badge>{produto.categoria_produto}</Badge>
        <h3 className="mt-3 line-clamp-2 text-base font-semibold text-[var(--color-ink)]">
          {produto.nome_produto}
        </h3>
      </Card>
    </button>
  );
}
