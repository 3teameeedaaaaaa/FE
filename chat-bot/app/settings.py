from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from .common import load_env_file


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DEV_CORS_ORIGIN_REGEX = r"https?://(localhost|127\.0\.0\.1)(:\d+)?$"


@dataclass(frozen=True)
class AppSettings:
    repo_root: Path
    prompt_file: str
    llm_schema_file: str
    api_schema_file: str
    cors_allow_origins: list[str]
    cors_allow_origin_regex: str | None
    cors_allow_credentials: bool
    openai_model: str
    openai_temperature: float
    openai_timeout_seconds: float
    server_host: str
    server_port: int
    log_level: str


def _parse_csv_env(name: str, default: str) -> list[str]:
    raw = os.getenv(name, default)
    values = [item.strip() for item in raw.split(",")]
    return [item for item in values if item]


def _load_cors_settings() -> tuple[list[str], str | None, bool]:
    raw = os.getenv("AI_SERVER_CORS_ALLOW_ORIGINS")
    if raw is None or not raw.strip():
        return [], DEFAULT_DEV_CORS_ORIGIN_REGEX, True

    origins = _parse_csv_env("AI_SERVER_CORS_ALLOW_ORIGINS", "")
    if origins == ["*"]:
        return origins, None, False
    return origins, None, True


def get_settings() -> AppSettings:
    load_env_file()
    cors_allow_origins, cors_allow_origin_regex, cors_allow_credentials = _load_cors_settings()
    return AppSettings(
        repo_root=REPO_ROOT,
        prompt_file=os.getenv("AI_PROMPT_FILE", "prompts/system/system_v1.9.txt"),
        llm_schema_file=os.getenv(
            "AI_LLM_SCHEMA_FILE",
            "schemas/llm_output/cbt_response_v1.0.json",
        ),
        api_schema_file=os.getenv(
            "AI_API_SCHEMA_FILE",
            "schemas/api_contract/chat_response_v1.0.json",
        ),
        cors_allow_origins=cors_allow_origins,
        cors_allow_origin_regex=cors_allow_origin_regex,
        cors_allow_credentials=cors_allow_credentials,
        openai_model=os.getenv("OPENAI_MODEL", "gpt-5.4"),
        openai_temperature=float(os.getenv("OPENAI_TEMPERATURE", "0.6")),
        openai_timeout_seconds=float(os.getenv("OPENAI_TIMEOUT_SECONDS", "20")),
        server_host=os.getenv("AI_SERVER_HOST", "127.0.0.1"),
        server_port=int(os.getenv("AI_SERVER_PORT", "8000")),
        log_level=os.getenv("AI_SERVER_LOG_LEVEL", "INFO"),
    )
