from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_DATABASE_PATH = BASE_DIR / "database.db"
ENV_FILE = BASE_DIR / ".env"

# Carrega o .env no ambiente do processo para bibliotecas externas,
# como o cliente do Gemini, conseguirem ler GOOGLE_API_KEY.
load_dotenv(ENV_FILE, override=True)

class Settings(BaseSettings):
    DATABASE_URL: str = f"sqlite:///{DEFAULT_DATABASE_PATH.as_posix()}"
    ANALYST_MODEL: str = "google-gla:gemini-2.5-flash-lite"
    ANALYST_DISTINCT_LIMIT: int = 50
    ANALYST_QUERY_LIMIT: int = 100
    GOOGLE_API_KEY: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def DATABASE_FILE(self) -> Path:
        if not self.DATABASE_URL.startswith("sqlite:///"):
            raise ValueError("A configuracao atual do agente suporta apenas SQLite.")

        raw_path = self.DATABASE_URL.removeprefix("sqlite:///")
        path = Path(raw_path).expanduser()
        return path if path.is_absolute() else (BASE_DIR / path).resolve()


settings = Settings()
