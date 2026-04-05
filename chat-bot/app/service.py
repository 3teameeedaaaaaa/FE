from __future__ import annotations

import json
import logging
import os

from openai import AuthenticationError, OpenAI

from .common import (
    build_openai_messages,
    build_openai_response_schema,
    build_user_message,
    inject_runtime_context,
    load_json,
    load_text,
    question_type_to_required,
    validate_api_response,
    validate_llm_response,
)
from .errors import ChatGenerationError
from .models import ChatRequest, ChatResponse
from .settings import get_settings

logger = logging.getLogger(__name__)


class ChatService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.client: OpenAI | None = None
        self.system_prompt = load_text(self.settings.prompt_file)
        self.llm_schema = load_json(self.settings.llm_schema_file)
        self.api_schema = load_json(self.settings.api_schema_file)
        self.openai_schema = build_openai_response_schema(self.llm_schema)

    def _get_client(self) -> OpenAI:
        if self.client is None:
            self.client = OpenAI(timeout=self.settings.openai_timeout_seconds, max_retries=1)
        return self.client

    def generate_chat_response(self, request: ChatRequest) -> ChatResponse:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ChatGenerationError(
                "OPENAI_API_KEY is not set. Add it to .env or tests/env, or export it in the current shell.",
                code="missing_api_key",
                status_code=500,
            )
        if not api_key.startswith("sk-"):
            raise ChatGenerationError(
                "OPENAI_API_KEY looks invalid. The current value does not start with 'sk-'.",
                code="invalid_api_key",
                status_code=500,
            )

        request_json = request.model_dump(by_alias=True, exclude_none=True)
        runtime_system_prompt = inject_runtime_context(self.system_prompt, request_json)
        user_message = build_user_message(request_json)
        messages = build_openai_messages(
            runtime_system_prompt=runtime_system_prompt,
            user_message=user_message,
            conversation_history=request_json.get("conversation_history"),
        )

        logger.info(
            "calling openai model=%s mode=%s turn=%s ticker=%s situation=%s single_chip=%s text_length=%s history_count=%s",
            self.settings.openai_model,
            request.mode,
            request.turn_number,
            request.ticker,
            request.situation,
            request.single_chip,
            len(request.text),
            len(request.conversation_history),
        )
        try:
            response = self._get_client().chat.completions.create(
                model=self.settings.openai_model,
                messages=messages,
                response_format={
                    "type": "json_schema",
                    "json_schema": {
                        "name": "cbt_response",
                        "strict": True,
                        "schema": self.openai_schema,
                    },
                },
                temperature=self.settings.openai_temperature,
            )
        except AuthenticationError as exc:
            raise ChatGenerationError(
                "OpenAI authentication failed. Reset OPENAI_API_KEY with a valid platform key and rerun.",
                code="upstream_auth_error",
                status_code=502,
            ) from exc
        except Exception as exc:
            raise ChatGenerationError(
                f"OpenAI request failed: {exc}",
                code="upstream_request_error",
                status_code=502,
            ) from exc

        content = response.choices[0].message.content
        if content is None:
            raise ChatGenerationError(
                "LLM response content is empty.",
                code="empty_llm_response",
                status_code=502,
            )

        try:
            raw_response = json.loads(content)
        except json.JSONDecodeError as exc:
            raise ChatGenerationError(
                "LLM response is not valid JSON.",
                code="invalid_llm_json",
                status_code=502,
            ) from exc

        try:
            validate_llm_response(raw_response, self.llm_schema)
        except Exception as exc:
            raise ChatGenerationError(
                f"LLM response schema validation failed: {exc}",
                code="invalid_llm_schema",
                status_code=502,
            ) from exc

        api_response = {
            **raw_response,
            "required": question_type_to_required(raw_response["question_type"]),
        }
        try:
            validate_api_response(api_response, self.api_schema)
        except Exception as exc:
            raise ChatGenerationError(
                f"API response schema validation failed: {exc}",
                code="invalid_api_schema",
                status_code=502,
            ) from exc

        return ChatResponse.model_validate(api_response)
