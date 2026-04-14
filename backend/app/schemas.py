from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class ProdutoBase(BaseModel):
    nome_produto: str
    categoria_produto: str
    peso_produto_gramas: Optional[float] = None
    comprimento_centimetros: Optional[float] = None
    altura_centimetros: Optional[float] = None
    largura_centimetros: Optional[float] = None


class ProdutoCreate(ProdutoBase):
    id_produto: str


class ProdutoUpdate(BaseModel):
    nome_produto: Optional[str] = None
    categoria_produto: Optional[str] = None
    peso_produto_gramas: Optional[float] = None
    comprimento_centimetros: Optional[float] = None
    altura_centimetros: Optional[float] = None
    largura_centimetros: Optional[float] = None


class ProdutoResponse(ProdutoBase):
    id_produto: str
    imagem_url: Optional[str] = None

    class Config:
        from_attributes = True

class AvaliacaoDetalhe(BaseModel):
    avaliacao: int
    titulo_comentario: Optional[str] = None
    comentario: Optional[str] = None


class ProdutoDetalhesResponse(ProdutoResponse):
    vendas_totais: int
    avaliacoes: List[Dict[str, Any]] = []
    media_avaliacoes: Optional[float] = None
