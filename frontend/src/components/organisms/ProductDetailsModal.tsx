import { Edit3, Info, Trash2, X } from 'lucide-react';

import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { IconButton } from '@/components/atoms/IconButton';
import { FieldGroup } from '@/components/molecules/FieldGroup';
import { ProductImage } from '@/components/molecules/ProductImage';
import { RatingStars } from '@/components/molecules/RatingStars';
import type { DetalhesProduto } from '@/types';

interface ProductDetailsModalProps {
  produto: DetalhesProduto;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
  onEdit: () => void;
}

function formatDimensionValue(value?: number | null) {
  return value ? `${value} cm` : '--';
}

export function ProductDetailsModal({
  produto,
  onClose,
  onDelete,
  onEdit,
}: ProductDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-sm">
      <Card className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto p-6 md:p-8">
        <IconButton className="absolute right-5 top-5" onClick={onClose}>
          <X size={22} />
        </IconButton>

        <div className="grid gap-6 md:grid-cols-[1.1fr_1fr]">
          <ProductImage
            imageUrl={produto.imagem_url}
            alt={produto.nome_produto}
            className="min-h-[320px]"
          />

          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                {produto.categoria_produto}
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">
                {produto.nome_produto}
              </h2>
            </div>

            <Card className="flex items-center justify-between gap-4 bg-[var(--color-surface-muted)] p-4">
              <div>
                <p className="text-sm text-[var(--color-ink-soft)]">Media de avaliacoes</p>
                <p className="mt-1 text-2xl font-semibold text-[var(--color-ink)]">
                  {produto.media_avaliacoes ? produto.media_avaliacoes.toFixed(1) : 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <RatingStars rating={Math.round(produto.media_avaliacoes ?? 0)} />
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                  {produto.avaliacoes?.length ?? 0} avaliacoes
                </p>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <FieldGroup label="Peso">
                  {produto.peso_produto_gramas ? `${produto.peso_produto_gramas} g` : '--'}
                </FieldGroup>
              </Card>
              <Card className="p-4">
                <FieldGroup label="Vendas totais">
                  {produto.vendas_totais ?? 0}
                </FieldGroup>
              </Card>
              <Card className="p-4">
                <FieldGroup label="Altura">
                  {formatDimensionValue(produto.altura_centimetros)}
                </FieldGroup>
              </Card>
              <Card className="p-4">
                <FieldGroup label="Largura">
                  {formatDimensionValue(produto.largura_centimetros)}
                </FieldGroup>
              </Card>
              <Card className="col-span-2 p-4">
                <FieldGroup label="Comprimento">
                  {formatDimensionValue(produto.comprimento_centimetros)}
                </FieldGroup>
              </Card>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <Button variant="secondary" onClick={onEdit} fullWidth>
                <Edit3 size={18} />
                Editar produto
              </Button>
              <Button variant="danger" onClick={() => void onDelete(produto.id_produto)} fullWidth>
                <Trash2 size={18} />
                Excluir produto
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <Info size={18} className="text-[var(--color-primary)]" />
            <h3 className="text-lg font-semibold text-[var(--color-ink)]">Ultimas avaliacoes</h3>
          </div>

          <div className="space-y-3">
            {produto.avaliacoes && produto.avaliacoes.length > 0 ? (
              produto.avaliacoes.slice(0, 3).map((avaliacao, index) => (
                <Card key={`${avaliacao.comentario ?? 'avaliacao'}-${index}`} className="p-4">
                  <RatingStars rating={avaliacao.avaliacao} />
                  <p className="mt-3 text-sm font-semibold text-[var(--color-ink)]">
                    {avaliacao.titulo_comentario || 'Avaliacao do cliente'}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                    {avaliacao.comentario || 'Sem comentario informado.'}
                  </p>
                </Card>
              ))
            ) : (
              <Card className="p-4 text-sm text-[var(--color-ink-soft)]">
                Nenhuma avaliacao encontrada para este produto.
              </Card>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
