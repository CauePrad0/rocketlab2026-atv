import { useCallback, useEffect, useState } from 'react';

import { produtoService } from '@/services/produto/produto.service';
import type {
  AtualizarProdutoPayload,
  CriarProdutoPayload,
  DetalhesProduto,
  Produto,
} from '@/types';

interface UseProdutosOptions {
  pagina: number;
  busca: string;
  limit?: number;
}

export function useProdutos({
  pagina,
  busca,
  limit = 8,
}: UseProdutosOptions) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const carregarProdutos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const skip = (pagina - 1) * limit;
      const data = await produtoService.listar(skip, limit, busca);

      setProdutos(data);
      setHasNextPage(data.length === limit);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setProdutos([]);
      setHasNextPage(false);
      setError('Nao foi possivel carregar os produtos.');
    } finally {
      setLoading(false);
    }
  }, [busca, limit, pagina]);

  useEffect(() => {
    void carregarProdutos();
  }, [carregarProdutos]);

  const buscarDetalhes = async (id: string): Promise<DetalhesProduto> => {
    return produtoService.buscarDetalhes(id);
  };

  const deletarProduto = async (id: string) => {
    await produtoService.deletar(id);
    await carregarProdutos();
  };

  const criarProduto = async (
    payload: Omit<CriarProdutoPayload, 'id_produto'>,
  ): Promise<DetalhesProduto> => {
    const requestPayload: CriarProdutoPayload = {
      ...payload,
      id_produto: crypto.randomUUID().replaceAll('-', ''),
    };

    const produtoCriado = await produtoService.criar(requestPayload);
    await carregarProdutos();
    return produtoService.buscarDetalhes(produtoCriado.id_produto);
  };

  const atualizarProduto = async (
    id: string,
    payload: AtualizarProdutoPayload,
  ): Promise<DetalhesProduto> => {
    await produtoService.atualizar(id, payload);
    await carregarProdutos();
    return produtoService.buscarDetalhes(id);
  };

  return {
    produtos,
    loading,
    error,
    hasNextPage,
    carregarProdutos,
    buscarDetalhes,
    deletarProduto,
    criarProduto,
    atualizarProduto,
  };
}
