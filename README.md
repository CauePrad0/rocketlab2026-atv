# Rocketlab 2026 ATV

Aplicacao full stack com:

- `backend/`: API em FastAPI + SQLAlchemy + Alembic + SQLite
- `frontend/`: interface em React + TypeScript + Vite

O projeto pode ser executado localmente ou com Docker Compose.

## Arquitetura

### Backend

- FastAPI para a API REST
- SQLAlchemy para acesso a dados
- Alembic para migrations
- SQLite como banco local

### Frontend

- React 19
- TypeScript
- Vite
- Atomic Design em `src/components`

## Como executar com Docker Compose

### Requisitos

- Docker
- Docker Compose

### Subir a aplicacao inteira

Na raiz do projeto, execute:

```bash
docker compose up --build
```

Depois disso:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:8000](http://localhost:8000)
- Swagger: [http://localhost:8000/docs](http://localhost:8000/docs)

Na primeira subida, o backend aplica as migrations e importa automaticamente os dados dos CSVs.

### Derrubar os containers

```bash
docker compose down
```

### Derrubar os containers e remover o volume do banco

```bash
docker compose down -v
```

Use esse comando quando quiser apagar o banco persistido e recriar tudo do zero.

## Como executar localmente

## Backend

### 1. Criar ambiente virtual

```bash
cd backend
python -m venv venv
source venv/bin/activate
```

No Windows:

```bash
venv\Scripts\activate
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Aplicar migrations

```bash
alembic upgrade head
```

### 4. Rodar a API

```bash
uvicorn app.main:app --reload
```

Backend disponivel em [http://localhost:8000](http://localhost:8000).

## Frontend

### 1. Instalar dependencias

```bash
cd frontend
pnpm install
```

### 2. Configurar a URL da API

Opcionalmente, crie um arquivo `.env` em `frontend/` com:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Rodar a aplicacao

```bash
pnpm dev
```

Frontend disponivel em [http://localhost:5173](http://localhost:5173).

## Estrutura de pastas

```text
.
├── backend
│   ├── app
│   ├── alembic
│   ├── Dockerfile
│   └── entrypoint.sh
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── hooks
│   │   ├── pages
│   │   ├── routes
│   │   ├── services
│   │   └── types
│   └── Dockerfile
└── docker-compose.yml
```

## Comandos uteis

### Frontend

```bash
cd frontend
pnpm lint
pnpm build
```

### Backend

```bash
cd backend
python -m py_compile app/main.py app/schemas.py
```

## Observacoes

- O `docker compose` sobe frontend e backend juntos.
- O backend aplica `alembic upgrade head` automaticamente ao iniciar o container.
- O backend executa `python seed.py` automaticamente quando o banco estiver vazio.
- O banco SQLite fica persistido em um volume Docker.
- Se voce ja subiu os containers antes desta automacao de seed, rode `docker compose down -v` e depois `docker compose up --build` para recriar o banco com os dados.
