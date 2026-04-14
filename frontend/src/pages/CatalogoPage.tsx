import { useState } from 'react';

import { Card } from '@/components/atoms/Card';
import { Spinner } from '@/components/atoms/Spinner';
import { PaginationControls } from '@/components/organisms/PaginationControls';
import { ProductDetailsModal } from '@/components/organisms/ProductDetailsModal';
import { ProductFormModal } from '@/components/organisms/ProductFormModal';
import { ProductGrid } from '@/components/organisms/ProductGrid';
import { CatalogTemplate } from '@/components/templates/CatalogTemplate';
import { useProdutos } from '@/hooks/useProdutos';
import { getApiErrorMessage } from '@/services/api/error';
import type { DetalhesProduto, ProdutoFormValues } from '@/types';

function parseNumber(value: string) {
  return Number(value) || 0;
}

export function CatalogoPage() {
  const [buscaInput, setBuscaInput] = useState('');
  const [buscaAplicada, setBuscaAplicada] = useState('');
  const [pagina, setPagina] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<DetalhesProduto | null>(null);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<DetalhesProduto | null>(null);

  const {
    produtos,
    loading,
    error,
    hasNextPage,
    buscarDetalhes,
    deletarProduto,
    criarProduto,
    atualizarProduto,
  } = useProdutos({
    pagina,
    busca: buscaAplicada,
    limit: 8,
  });

  const handleBusca = () => {
    setPagina(1);
    setBuscaAplicada(buscaInput.trim());
  };

  const handleSelectProduct = async (id: string) => {
    try {
      const detalhes = await buscarDetalhes(id);
      setProdutoSelecionado(detalhes);
    } catch (err) {
      console.error('Erro ao buscar detalhes do produto:', err);
      window.alert('Nao foi possivel carregar os detalhes do produto.');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir este produto?');

    if (!confirmed) {
      return;
    }

    try {
      await deletarProduto(id);
      setProdutoSelecionado(null);
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
      window.alert('Nao foi possivel excluir o produto.');
    }
  };

  const handleCreate = async (values: ProdutoFormValues) => {
    try {
      const produtoCriado = await criarProduto({
        nome_produto: values.nome_produto,
        categoria_produto: values.categoria_produto,
        peso_produto_gramas: parseNumber(values.peso_produto_gramas),
        comprimento_centimetros: parseNumber(values.comprimento_centimetros),
        altura_centimetros: parseNumber(values.altura_centimetros),
        largura_centimetros: parseNumber(values.largura_centimetros),
      });

      setBuscaInput('');
      setBuscaAplicada('');
      setPagina(1);
      setProdutoSelecionado(produtoCriado);
      setIsCreateModalOpen(false);
      window.alert('Produto salvo com sucesso.');
    } catch (err) {
      console.error('Erro ao criar produto:', err);
      window.alert(getApiErrorMessage(err, 'Nao foi possivel salvar o produto.'));
    }
  };

  const handleStartEdit = () => {
    if (!produtoSelecionado) {
      return;
    }

    setProdutoSelecionado(null);
    setProdutoEmEdicao(produtoSelecionado);
  };

  const handleUpdate = async (values: ProdutoFormValues) => {
    if (!produtoEmEdicao) {
      return;
    }

    try {
      const produtoAtualizado = await atualizarProduto(produtoEmEdicao.id_produto, {
        nome_produto: values.nome_produto,
        categoria_produto: values.categoria_produto,
        peso_produto_gramas: parseNumber(values.peso_produto_gramas),
        comprimento_centimetros: parseNumber(values.comprimento_centimetros),
        altura_centimetros: parseNumber(values.altura_centimetros),
        largura_centimetros: parseNumber(values.largura_centimetros),
      });

      setProdutoSelecionado(produtoAtualizado);
      setProdutoEmEdicao(null);
      window.alert('Produto atualizado com sucesso.');
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
      window.alert(getApiErrorMessage(err, 'Nao foi possivel atualizar o produto.'));
    }
  };

  return (
    <CatalogTemplate
      busca={buscaInput}
      onBuscaChange={setBuscaInput}
      onBuscaSubmit={handleBusca}
      onCreateClick={() => setIsCreateModalOpen(true)}
    >
      {loading ? (
        <Card className="flex min-h-[320px] flex-col items-center justify-center gap-4">
          <Spinner />
          <p className="text-sm text-[var(--color-ink-soft)]">Carregando produtos...</p>
        </Card>
      ) : (
        <>
          {error ? (
            <Card className="mb-6 p-4 text-sm text-[var(--color-danger)]">{error}</Card>
          ) : null}
          <ProductGrid produtos={produtos} onSelect={handleSelectProduct} />
          {produtos.length > 0 ? (
            <PaginationControls
              currentPage={pagina}
              hasNextPage={hasNextPage}
              onPrevious={() => setPagina((current) => Math.max(1, current - 1))}
              onNext={() => setPagina((current) => current + 1)}
            />
          ) : null}
        </>
      )}

      {produtoSelecionado && !produtoEmEdicao ? (
        <ProductDetailsModal
          produto={produtoSelecionado}
          onClose={() => setProdutoSelecionado(null)}
          onDelete={handleDelete}
          onEdit={handleStartEdit}
        />
      ) : null}

      {isCreateModalOpen ? (
        <ProductFormModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreate}
          mode="create"
        />
      ) : null}

      {produtoEmEdicao ? (
        <ProductFormModal
          onClose={() => setProdutoEmEdicao(null)}
          onSubmit={handleUpdate}
          mode="edit"
          initialValues={{
            nome_produto: produtoEmEdicao.nome_produto,
            categoria_produto: produtoEmEdicao.categoria_produto,
            peso_produto_gramas: String(produtoEmEdicao.peso_produto_gramas ?? ''),
            comprimento_centimetros: String(produtoEmEdicao.comprimento_centimetros ?? ''),
            altura_centimetros: String(produtoEmEdicao.altura_centimetros ?? ''),
            largura_centimetros: String(produtoEmEdicao.largura_centimetros ?? ''),
          }}
        />
      ) : null}
    </CatalogTemplate>
  );
}
