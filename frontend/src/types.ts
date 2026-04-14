export interface Avaliacao {
  id_avaliacao: string;
  id_produto: string;
  id_pedido: string;
  avaliacao: number;
  comentario?: string;
}

export interface Produto {
  id_produto: string;
  nome_produto: string;
  categoria_produto: string;
  imagem_url?: string;
}


export interface DetalhesProduto extends Produto {
  peso_produto_gramas?: number;
  comprimento_centimetros?: number;
  altura_centimetros?: number;
  largura_centimetros?: number;
  vendas_totais?: number;
  media_avaliacoes?: number;
  avaliacoes: Avaliacao[];
}