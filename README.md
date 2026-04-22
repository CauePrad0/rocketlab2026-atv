# Rocketlab 2026 ATV

Aplicação full stack para operação de E-commerce com um agente de Análise de Dados Text-to-SQL integrado.

- `backend/`: FastAPI + SQLAlchemy + Alembic + SQLite
- `frontend/`: React + TypeScript + Vite
- `backend/app/agents/`: agente Text-to-SQL com Pydantic AI + Gemini

---

## Arquitetura

### Backend

- **FastAPI** para API REST
- **SQLAlchemy** para acesso ao banco
- **Alembic** para migrations
- **SQLite** como banco local
- **Pydantic AI** para o agente Text-to-SQL
- **Gemini `gemini-2.5-flash`** como modelo do agente

### Frontend

- **React 19**
- **TypeScript**
- **Vite**
- Atomic Design em `frontend/src/components`
- Página `/analista` para interação com o agente

---

## Agente Text-to-SQL

O agente recebe perguntas de negócio em linguagem natural, gera SQL, executa a consulta e devolve:

- `sql_used`: query final executada
- `conclusion`: resposta em linguagem humana

### Funcionalidades

- Conversão de texto para SQL
- Injeção do schema real do SQLite no prompt
- Uso de tools para consulta iterativa
- Execução restrita a `SELECT`
- Endpoint HTTP e interface web

### Tools disponíveis

- `get_distinct_values(table_name, column_name)`
- `run_query(sql_query)`

### Arquivos principais

- `backend/app/agents/database_manager.py`
- `backend/app/agents/text_to_sql.py`
- `frontend/src/pages/AnalistaPage.tsx`

---

## Estrutura de Pastas

```text
.
├── backend
│   ├── app
│   │   ├── agents
│   │   ├── models
│   │   └── main.py
│   ├── alembic
│   ├── data
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

---

## Requisitos

| Ferramenta | Versão recomendada |
|---|---|
| Python | 3.13+ |
| Node.js | 20+ |
| pnpm | versão recente |
| Docker + Docker Compose | opcional |
| `GOOGLE_API_KEY` | obrigatória para o agente |

> Sem `GOOGLE_API_KEY`, a rota `/analyst/query` não consegue chamar o Gemini.

---

## Como Rodar Localmente

Siga exatamente esta ordem para subir a solução completa.

### 1. Configurar o backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

No Windows:

```bash
venv\Scripts\activate
```

### 2. Criar o arquivo `backend/.env`

Crie o arquivo `backend/.env` com este conteúdo:

```env
DATABASE_URL=sqlite:///./database.db
GOOGLE_API_KEY=sua-chave-aqui
```

> Com isso, não é necessário exportar a chave manualmente no terminal.

### 3. Preparar o banco de dados

Ainda dentro de `backend/`, rode:

```bash
python -m alembic upgrade head
python seed.py
```

### 4. Iniciar o backend

Ainda dentro de `backend/`, rode:

```bash
python -m uvicorn app.main:app --reload --reload-dir app
```

O backend ficará disponível em:

- API: http://localhost:8000
- Swagger: http://localhost:8000/docs

### 5. Configurar o frontend

Abra outro terminal e rode:

```bash
cd frontend
pnpm install
```

Se quiser, crie o arquivo `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 6. Iniciar o frontend

Ainda dentro de `frontend/`, rode:

```bash
pnpm dev
```

O frontend ficará disponível em:

- Frontend: http://localhost:5173
- Tela do agente: http://localhost:5173/analista

### 7. Usar a solução

Com backend e frontend rodando, acesse:

- http://localhost:5173/analista

Nessa tela você pode:

- Digitar perguntas de negócio em linguagem natural
- Ver a conclusão do agente
- Inspecionar o SQL final gerado
- Acompanhar o tool trace da análise

---

## Como Rodar com Docker

### 1. Configurar a chave do Gemini

No terminal, antes de subir os containers:

```bash
export GOOGLE_API_KEY="sua-chave-aqui"
```

### 2. Subir a aplicação

Na raiz do projeto, rode:

```bash
docker compose up --build
```

Na primeira execução, o backend aplica as migrations e popula o banco automaticamente.

### 3. Acessar a aplicação

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Swagger: http://localhost:8000/docs
- Tela do agente: http://localhost:5173/analista

### 4. Encerrar os containers

```bash
docker compose down
```

Para recriar o banco do zero:

```bash
docker compose down -v
```

---

## Endpoint do Agente

```http
POST /analyst/query
Content-Type: application/json
```

### Payload

```json
{
  "question": "Quais categorias geram mais receita total?"
}
```

### Resposta

```json
{
  "question": "Quais categorias geram mais receita total?",
  "result": {
    "sql_used": "SELECT ...",
    "conclusion": "..."
  },
  "tool_trace": [
    {
      "step_type": "tool_call",
      "tool_name": "run_query",
      "message": "Ferramenta acionada pelo agente.",
      "arguments": {
        "sql_query": "SELECT ..."
      }
    }
  ]
}
```

---

## Exemplos de Perguntas

- `Quais os top 10 produtos mais vendidos?`
- `Quais categorias possuem maior receita total?`
- `Qual a taxa de pedidos entregues fora do prazo?`
- `Quais estados concentram mais consumidores?`
- `Existe alguma categoria com avaliação média baixa e alto volume de vendas?`

---

## Comandos Úteis

### Frontend

```bash
cd frontend
pnpm lint
pnpm build
```

### Backend

```bash
cd backend
python -m py_compile \
  app/main.py \
  app/config.py \
  app/agents/database_manager.py \
  app/agents/text_to_sql.py
```

---

## Observações

- O banco local padrão fica em `backend/database.db`.
- O agente executa apenas consultas de leitura iniciadas por `SELECT`.
- Se você estiver usando Conda/Anaconda, prefira sempre `python -m ...` com o `venv` ativado para evitar conflito de ambiente.
