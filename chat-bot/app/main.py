from __future__ import annotations

import logging
import sys
import time
import uuid
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

if __package__ in {None, ""}:
    repo_root = Path(__file__).resolve().parents[2]
    if str(repo_root) not in sys.path:
        sys.path.insert(0, str(repo_root))

    from python_ai_server.app.api.chat import router as chat_router
    from python_ai_server.app.errors import ChatGenerationError
    from python_ai_server.app.settings import get_settings
else:
    from .api.chat import router as chat_router
    from .errors import ChatGenerationError
    from .settings import get_settings


settings = get_settings()
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)
logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="Python AI Server", version="0.1.0")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_allow_origins,
        allow_origin_regex=settings.cors_allow_origin_regex,
        allow_credentials=settings.cors_allow_credentials,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(chat_router, prefix="/api")

    @app.middleware("http")
    async def request_context_middleware(request: Request, call_next):
        request_id = request.headers.get("x-request-id", str(uuid.uuid4()))
        request.state.request_id = request_id
        started_at = time.perf_counter()
        response = await call_next(request)

        latency_ms = (time.perf_counter() - started_at) * 1000
        response.headers["x-request-id"] = request_id
        logger.info(
            "request completed request_id=%s method=%s path=%s status=%s latency_ms=%.1f",
            request_id,
            request.method,
            request.url.path,
            response.status_code,
            latency_ms,
        )
        return response

    @app.exception_handler(RequestValidationError)
    async def request_validation_exception_handler(request: Request, exc: RequestValidationError):
        request_id = getattr(request.state, "request_id", "unknown")
        sanitized_errors = []
        for error in exc.errors():
            sanitized = dict(error)
            ctx = sanitized.get("ctx")
            if isinstance(ctx, dict):
                sanitized["ctx"] = {
                    key: str(value) if isinstance(value, BaseException) else value
                    for key, value in ctx.items()
                }
            sanitized_errors.append(sanitized)

        logger.warning("request validation failed request_id=%s errors=%s", request_id, sanitized_errors)
        return JSONResponse(
            status_code=422,
            content={
                "error": {
                    "code": "invalid_request",
                    "message": "Request validation failed.",
                    "details": sanitized_errors,
                    "request_id": request_id,
                }
            }
        )

    @app.exception_handler(ChatGenerationError)
    async def chat_generation_exception_handler(request: Request, exc: ChatGenerationError):
        request_id = getattr(request.state, "request_id", "unknown")
        logger.error(
            "chat generation failed request_id=%s code=%s message=%s",
            request_id,
            exc.code,
            str(exc),
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": exc.code,
                    "message": str(exc),
                    "request_id": request_id,
                }
            },
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        request_id = getattr(request.state, "request_id", "unknown")
        logger.exception("internal server error request_id=%s", request_id)
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "code": "internal_server_error",
                    "message": "Internal server error.",
                    "request_id": request_id,
                }
            }
        )

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()


if __name__ == "__main__":
    import sys
    import uvicorn

    settings = get_settings()
    if len(sys.argv) > 1 and sys.argv[1] == "runserver":
        port = int(sys.argv[2]) if len(sys.argv) > 2 else settings.server_port
        uvicorn.run(app, host=settings.server_host, port=port)
    else:
        uvicorn.run(app, host=settings.server_host, port=settings.server_port)
