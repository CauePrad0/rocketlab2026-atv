import csv
import os
from datetime import datetime
from app.database import SessionLocal
from app.models.consumidor import Consumidor
from app.models.produto import Produto
from app.models.vendedor import Vendedor
from app.models.pedido import Pedido
from app.models.item_pedido import ItemPedido
from app.models.avaliacao_pedido import AvaliacaoPedido

BASE_DIR = os.path.join(os.path.dirname(__file__), "data")

def safe_num(val):
    try:
        return float(val) if val and val.strip() else None
    except ValueError:
        return None

def safe_dt(val):
    try:
        return datetime.fromisoformat(val) if val and val.strip() else None
    except ValueError:
        return None

def safe_d(val):
    try:
        return datetime.strptime(val.strip(), "%Y-%m-%d").date() if val and val.strip() else None
    except ValueError:
        return None

def populate_consumidores(session):
    path = os.path.join(BASE_DIR, "dim_consumidores.csv")
    with open(path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for item in reader:
            obj = Consumidor(
                id_consumidor=item["id_consumidor"],
                prefixo_cep=item["prefixo_cep"],
                nome_consumidor=item["nome_consumidor"],
                cidade=item["cidade"],
                estado=item["estado"]
            )
            session.add(obj)
    session.commit()
    print("Tudo certo com dados de consumidores")

def populate_produtos(session):
    path = os.path.join(BASE_DIR, "dim_produtos.csv")
    with open(path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for item in reader:
            obj = Produto(
                id_produto=item["id_produto"],
                nome_produto=item["nome_produto"],
                categoria_produto=item["categoria_produto"],
                peso_produto_gramas=safe_num(item.get("peso_produto_gramas")),
                comprimento_centimetros=safe_num(item.get("comprimento_centimetros")),
                altura_centimetros=safe_num(item.get("altura_centimetros")),
                largura_centimetros=safe_num(item.get("largura_centimetros"))
            )
            session.add(obj)
    session.commit()
    print("Tudo certo com dados de produtos")

def populate_vendedores(session):
    path = os.path.join(BASE_DIR, "dim_vendedores.csv")
    with open(path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for item in reader:
            obj = Vendedor(
                id_vendedor=item["id_vendedor"],
                nome_vendedor=item["nome_vendedor"],
                prefixo_cep=item["prefixo_cep"],
                cidade=item["cidade"],
                estado=item["estado"]
            )
            session.add(obj)
    session.commit()
    print("Tudo certo com dados de vendedores.")

def populate_pedidos(session):
    path = os.path.join(BASE_DIR, "fat_pedidos.csv")
    with open(path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for item in reader:
            obj = Pedido(
                id_pedido=item["id_pedido"],
                id_consumidor=item["id_consumidor"],
                status=item["status"],
                pedido_compra_timestamp=safe_dt(item.get("pedido_compra_timestamp")),
                pedido_entregue_timestamp=safe_dt(item.get("pedido_entregue_timestamp")),
                data_estimada_entrega=safe_d(item.get("data_estimada_entrega")),
                tempo_entrega_dias=safe_num(item.get("tempo_entrega_dias")),
                tempo_entrega_estimado_dias=safe_num(item.get("tempo_entrega_estimado_dias")),
                diferenca_entrega_dias=safe_num(item.get("diferenca_entrega_dias")),
                entrega_no_prazo=item.get("entrega_no_prazo")
            )
            session.add(obj)
    session.commit()
    print("Tudo certo com dados de pedidos.")

def populate_itens_pedidos(session):
    path = os.path.join(BASE_DIR, "fat_itens_pedidos.csv")
    with open(path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for item in reader:
            obj = ItemPedido(
                id_pedido=item["id_pedido"],
                id_item=int(item["id_item"]),
                id_produto=item["id_produto"],
                id_vendedor=item["id_vendedor"],
                preco_BRL=safe_num(item["preco_BRL"]),
                preco_frete=safe_num(item["preco_frete"])
            )
            session.add(obj)
    session.commit()
    print("Tudo certo com dados de itens dos pedidos.")

def populate_avaliacoes(session):
    path = os.path.join(BASE_DIR, "fat_avaliacoes_pedidos.csv")
    ids_vistos = set()
    with open(path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for item in reader:
            current_id = item["id_avaliacao"]
            if current_id in ids_vistos:
                continue
            ids_vistos.add(current_id)
            
            obj = AvaliacaoPedido(
                id_avaliacao=current_id,
                id_pedido=item["id_pedido"],
                avaliacao=int(item["avaliacao"]),
                titulo_comentario=item.get("titulo_comentario") or None,
                comentario=item.get("comentario") or None,
                data_comentario=safe_dt(item.get("data_comentario")),
                data_resposta=safe_dt(item.get("data_resposta"))
            )
            session.add(obj)
    session.commit()
    print("Tudo certo com Dados de avaliacoes.")

def execute_seed():
    db_session = SessionLocal()
    try:
        print("Iniciando populacao db")
        populate_consumidores(db_session)
        populate_produtos(db_session)
        populate_vendedores(db_session)
        populate_pedidos(db_session)
        populate_itens_pedidos(db_session)
        populate_avaliacoes(db_session)
        print("tudo inserido corretamente")
    except Exception as err:
        db_session.rollback()
        print(f"Falha: {err}")
        raise
    finally:
        db_session.close()

if __name__ == "__main__":
    execute_seed()