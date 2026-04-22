from __future__ import annotations

import asyncio
import re
import sqlite3
from pathlib import Path
from typing import Any

NAME_PATTERN = re.compile(r'^[A-Za-z_][A-Za-z0-9_]*$')
LIMIT_PATTERN = re.compile(r'\blimit\b', re.IGNORECASE)


class DatabaseManager:
#Classe simples para leitura segura do banco SQLite

    def __init__(
        self,
        db_path: str | Path,
        *,
        distinct_limit: int = 50,
        query_row_limit: int = 100,
    ) -> None:
        self.db_path = Path(db_path).expanduser().resolve()
        self.distinct_limit = distinct_limit
        self.query_row_limit = query_row_limit

    async def get_schema(self) -> str:
        return await asyncio.to_thread(self._get_schema_sync)

    async def get_distinct_values(self, table_name: str, column_name: str) -> dict[str, Any]:
        return await asyncio.to_thread(self._get_distinct_values_sync, table_name, column_name)

    async def run_query(self, sql_query: str) -> dict[str, Any]:
        return await asyncio.to_thread(self._run_query_sync, sql_query)

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.db_path, check_same_thread=False)
        connection.row_factory = sqlite3.Row
        return connection

    def _get_schema_sync(self) -> str:
        # Busca o DDL das tabelas para injetar no prompt do agente.
        query = """
        SELECT sql
        FROM sqlite_master
        WHERE type = 'table'
          AND name NOT LIKE 'sqlite_%'
          AND name != 'alembic_version'
          AND sql IS NOT NULL
        ORDER BY name
        """

        with self._connect() as connection:
            rows = connection.execute(query).fetchall()

        if not rows:
            raise ValueError('Nenhuma tabela foi encontrada no banco de dados.')

        return '\n\n'.join(row['sql'] for row in rows)

    def _get_distinct_values_sync(self, table_name: str, column_name: str) -> dict[str, Any]:
        # Validacao simples para evitar nomes maliciosos em tabela/coluna.
        self._validate_name(table_name, 'table_name')
        self._validate_name(column_name, 'column_name')

        with self._connect() as connection:
            self._validate_table_and_column(connection, table_name, column_name)
            query = (
                f'SELECT DISTINCT "{column_name}" AS value '
                f'FROM "{table_name}" '
                f'WHERE "{column_name}" IS NOT NULL '
                f'ORDER BY 1 '
                f'LIMIT {self.distinct_limit}'
            )
            rows = connection.execute(query).fetchall()

        values = [row['value'] for row in rows]
        return {
            'table_name': table_name,
            'column_name': column_name,
            'values': values,
        }

    def _run_query_sync(self, sql_query: str) -> dict[str, Any]:
        cleaned_query = sql_query.strip().rstrip(';').strip()

        if not cleaned_query:
            raise ValueError('A consulta SQL nao pode estar vazia.')

        if ';' in cleaned_query:
            raise ValueError('Envie apenas uma consulta por vez.')

        if not cleaned_query.upper().startswith('SELECT'):
            raise ValueError('Somente consultas iniciadas por SELECT sao permitidas.')

        # Se o modelo nao limitar a consulta, aplicamos um LIMIT automatico.
        if LIMIT_PATTERN.search(cleaned_query):
            final_query = cleaned_query
        else:
            final_query = f'{cleaned_query}\nLIMIT {self.query_row_limit}'

        try:
            with self._connect() as connection:
                cursor = connection.execute(final_query)
                rows = cursor.fetchall()
        except sqlite3.Error as exc:
            raise ValueError(f'Falha ao executar SQL: {exc}') from exc

        return {
            'executed_sql': final_query,
            'columns': [column[0] for column in cursor.description or []],
            'rows': [dict(row) for row in rows[: self.query_row_limit]],
            'row_count': len(rows[: self.query_row_limit]),
        }

    def _validate_table_and_column(
        self,
        connection: sqlite3.Connection,
        table_name: str,
        column_name: str,
    ) -> None:
        tables = {
            row['name']
            for row in connection.execute(
                "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'"
            ).fetchall()
        }
        if table_name not in tables:
            raise ValueError(f"A tabela '{table_name}' nao existe.")

        columns = {
            row['name']
            for row in connection.execute(f'PRAGMA table_info("{table_name}")').fetchall()
        }
        if column_name not in columns:
            raise ValueError(f"A coluna '{column_name}' nao existe na tabela '{table_name}'.")

    @staticmethod
    def _validate_name(value: str, field_name: str) -> None:
        if not NAME_PATTERN.match(value):
            raise ValueError(f'{field_name} contem caracteres invalidos.')
