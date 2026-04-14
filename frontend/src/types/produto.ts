export interface Avaliacao {
  avaliacao: number;
  titulo_comentario?: string;
  comentario?: string;
}

export interface Produto {
  id_produto: string;
  nome_produto: string;
  categoria_produto: string;
  imagem_url?: string;
}

export interface DetalhesProduto extends Produto {
  peso_produto_gramas?: number | null;
  comprimento_centimetros?: number | null;
  altura_centimetros?: number | null;
  largura_centimetros?: number | null;
  vendas_totais?: number;
  media_avaliacoes?: number | null;
  avaliacoes?: Avaliacao[];
}

export interface ProdutoFormValues {
  nome_produto: string;
  categoria_produto: string;
  peso_produto_gramas: string;
  comprimento_centimetros: string;
  altura_centimetros: string;
  largura_centimetros: string;
}

export interface CriarProdutoPayload {
  id_produto: string;
  nome_produto: string;
  categoria_produto: string;
  peso_produto_gramas: number;
  comprimento_centimetros: number;
  altura_centimetros: number;
  largura_centimetros: number;
}

export interface AtualizarProdutoPayload {
  nome_produto: string;
  categoria_produto: string;
  peso_produto_gramas: number;
  comprimento_centimetros: number;
  altura_centimetros: number;
  largura_centimetros: number;
}
