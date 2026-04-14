from pydantic import BaseModel
from typing import Optional, List

class ProdutoBase(BaseModel):
    nome_produto: str
    categoria_produto: str
    peso_produto_gramas: Optional[float] = None
    comprimento_centimetros: Optional[float] = None
    altura_centimetros: Optional[float] = None
    largura_centimetros: Optional[float] = None
    imagem_url: Optional[str] = None

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
    class Config:
        from_attributes = True



class AvaliacaoDetalhe(BaseModel):
    avaliacao: int
    titulo_comentario: Optional[str] = None
    comentario: Optional[str] = None

# Schema para o detalhamento completo do produto
class ProdutoDetalhesResponse(ProdutoResponse):
    quantidade_vendas: int
    avaliacoes_consumidores: List[AvaliacaoDetalhe]