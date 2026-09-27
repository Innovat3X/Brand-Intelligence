from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application configuration.

    Values can be provided through environment variables or a .env file.
    """

    app_name: str = "Brand Intelligence API"
    app_version: str = "1.0.0"
    environment: str = "development"
    debug: bool = True

    # Database
    database_url: str = "sqlite:///./brand_intelligence.db"

    # API
    api_prefix: str = "/api"

    # CORS
    cors_origins: str = Field(
        default="http://localhost:3000,http://127.0.0.1:3000"
    )

    # Security
    secret_key: str = "development-secret-key-change-in-production"

    # AIML service
    aiml_service_url: str = "http://localhost:8001"
    aiml_service_timeout: float = 60.0

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origins_list(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.cors_origins.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()