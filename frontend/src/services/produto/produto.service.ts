import { apiClient } from '@/services/api/client';
import type {
  AtualizarProdutoPayload,
  CriarProdutoPayload,
  DetalhesProduto,
  Produto,
} from '@/types';

export const produtoService = {
  async listar(skip: number, limit: number, busca: string): Promise<Produto[]> {
    const response = await apiClient.get('/produtos', {
      params: { skip, limit, busca: busca || undefined },
    });

    return Array.isArray(response.data) ? response.data : [];
  },

  async buscarDetalhes(id: string): Promise<DetalhesProduto> {
    const response = await apiClient.get(`/produtos/${id}/detalhes`);
    return response.data;
  },

  async deletar(id: string): Promise<void> {
    await apiClient.delete(`/produtos/${id}`);
  },

  async criar(payload: CriarProdutoPayload): Promise<Produto> {
    const response = await apiClient.post('/produtos', payload);
    return response.data;
  },

  async atualizar(id: string, payload: AtualizarProdutoPayload): Promise<Produto> {
    const response = await apiClient.put(`/produtos/${id}`, payload);
    return response.data;
  },
};
