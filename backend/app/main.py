from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from sqlalchemy import desc

from app.database import get_db
from app.models.produto import Produto
from app.models.item_pedido import ItemPedido
from app.models.pedido import Pedido
from app.models.avaliacao_pedido import AvaliacaoPedido
from app import schemas
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="API E-Commerce")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite que qualquer frontend acesse (ideal para MVP local)
    allow_credentials=True,
    allow_methods=["*"],  # Permite GET, POST, PUT, DELETE
    allow_headers=["*"],
)

#navegar pelo catalogo
@app.get("/produtos", response_model=List[schemas.ProdutoResponse])
def listar_ou_buscar_produtos(
    busca: Optional[str] = Query(None, description="Busque pelo nome ou categoria"),
    skip: int = 0, 
    limit: int = 50, 
    db: Session = Depends(get_db)
):
    query = db.query(Produto)
    if busca:
        query = query.filter(
            Produto.nome_produto.ilike(f"%{busca}%") | 
            Produto.categoria_produto.ilike(f"%{busca}%")
        )
    return query.offset(skip).limit(limit).all()

#detalhes do produto
@app.get("/produtos/{id_produto}/detalhes", response_model=schemas.ProdutoDetalhesResponse)
def detalhes_do_produto(id_produto: str, db: Session = Depends(get_db)):

    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")


    vendas = db.query(func.count(ItemPedido.id_item)).filter(ItemPedido.id_produto == id_produto).scalar() or 0

    avaliacoes_db = db.query(AvaliacaoPedido).\
        join(ItemPedido, AvaliacaoPedido.id_pedido == ItemPedido.id_pedido).\
        filter(ItemPedido.id_produto == id_produto).all()
    
    lista_avaliacoes = [
        {"avaliacao": a.avaliacao, "titulo_comentario": a.titulo_comentario, "comentario": a.comentario} 
        for a in avaliacoes_db
    ]

    return {
        **produto.__dict__,
        "quantidade_vendas": vendas,
        "avaliacoes_consumidores": lista_avaliacoes
    }

#Analise de performance entregas
@app.get("/dashboard/performance-entregas")
def performance_entregas(db: Session = Depends(get_db)):
    resultado = db.query(
        Pedido.entrega_no_prazo,
        func.count(Pedido.id_pedido).label("quantidade")
    ).filter(Pedido.entrega_no_prazo.isnot(None))\
     .group_by(Pedido.entrega_no_prazo).all()
    
    # Dicionário inicializando as categorias exatas
    stats = {
        "No Prazo": 0, 
        "Atrasado": 0, 
        "Não Entregue": 0
    }
    
    for r in resultado:
        valor = str(r.entrega_no_prazo).strip()
        
        if valor == "Sim":
            stats["No Prazo"] += r.quantidade
        elif valor == "Não":
            stats["Atrasado"] += r.quantidade
        elif valor == "Não Entregue":
            stats["Não Entregue"] += r.quantidade
            
    return [
        {"status_entrega": label, "quantidade": qtd} 
        for label, qtd in stats.items()
    ]
#Resumo geral da operaçao
@app.get("/dashboard/resumo")
def resumo_dashboard(db: Session = Depends(get_db)):
    # Calcula o total de produtos cadastrados
    total_produtos = db.query(func.count(Produto.id_produto)).scalar()
    
    # Calcula a soma de todo o dinheiro que já entrou (Receita)
    receita_total = db.query(func.sum(ItemPedido.preco_BRL)).scalar()
    
    # Calcula a média de notas de toda a loja
    media_lojas = db.query(func.avg(AvaliacaoPedido.avaliacao)).scalar()

    return {
        "total_produtos": total_produtos or 0,
        "receita_total": round(receita_total or 0.0, 2),
        "media_geral_lojas": round(media_lojas or 0.0, 1)
    }

#Media do produto
@app.get("/produtos/{id_produto}/media-avaliacoes")
def media_avaliacoes_produto(id_produto: str, db: Session = Depends(get_db)):
    media = db.query(func.avg(AvaliacaoPedido.avaliacao)).\
        join(ItemPedido, AvaliacaoPedido.id_pedido == ItemPedido.id_pedido).\
        filter(ItemPedido.id_produto == id_produto).scalar()
    
    return {
        "id_produto": id_produto, 
        "media": round(media, 1) if media else 0.0
    }

#add produto
@app.post("/produtos", response_model=schemas.ProdutoResponse, status_code=201)
def adicionar_produto(produto: schemas.ProdutoCreate, db: Session = Depends(get_db)):
    if db.query(Produto).filter(Produto.id_produto == produto.id_produto).first():
        raise HTTPException(status_code=400, detail="ID já existe")
    
    novo_produto = Produto(**produto.model_dump())
    db.add(novo_produto)
    db.commit()
    db.refresh(novo_produto)
    return novo_produto

#update produto
@app.put("/produtos/{id_produto}", response_model=schemas.ProdutoResponse)
def atualizar_produto(id_produto: str, prod_atualizado: schemas.ProdutoUpdate, db: Session = Depends(get_db)):
    db_produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    for key, value in prod_atualizado.model_dump(exclude_unset=True).items():
        setattr(db_produto, key, value)
        
    db.commit()
    db.refresh(db_produto)
    return db_produto

#Remover produto
@app.delete("/produtos/{id_produto}", status_code=204)
def remover_produto(id_produto: str, db: Session = Depends(get_db)):
    db_produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    db.delete(db_produto)
    db.commit()
    return None


