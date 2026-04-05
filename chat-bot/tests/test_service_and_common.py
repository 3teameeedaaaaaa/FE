from __future__ import annotations

import json
import os
import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.common import build_openai_messages, build_user_message, inject_runtime_context
from app.main import create_app
from app.models import ChatRequest
from app.service import ChatService
from app.settings import DEFAULT_DEV_CORS_ORIGIN_REGEX, _parse_csv_env, get_settings


class _FakeResponse:
    def __init__(self, content: str) -> None:
        self.choices = [type("Choice", (), {"message": type("Message", (), {"content": content})()})()]


class _FakeCompletions:
    def __init__(self, content: str) -> None:
        self.content = content
        self.last_kwargs: dict[str, object] | None = None

    def create(self, **kwargs: object) -> _FakeResponse:
        self.last_kwargs = kwargs
        return _FakeResponse(self.content)


class _FakeClient:
    def __init__(self, content: str) -> None:
        self.chat = type("ChatNamespace", (), {"completions": _FakeCompletions(content)})()


class CommonHelpersTest(unittest.TestCase):
    def test_parse_csv_env_supports_single_value_and_strips_whitespace(self) -> None:
        with patch.dict(os.environ, {"AI_SERVER_CORS_ALLOW_ORIGINS": " https://a.com, https://b.com "}, clear=False):
            self.assertEqual(
                _parse_csv_env("AI_SERVER_CORS_ALLOW_ORIGINS", "*"),
                ["https://a.com", "https://b.com"],
            )

    def test_settings_use_localhost_regex_when_cors_origins_are_unset(self) -> None:
        with patch.dict(os.environ, {"AI_SERVER_CORS_ALLOW_ORIGINS": ""}, clear=False):
            settings = get_settings()

        self.assertEqual(settings.cors_allow_origins, [])
        self.assertEqual(settings.cors_allow_origin_regex, DEFAULT_DEV_CORS_ORIGIN_REGEX)
        self.assertTrue(settings.cors_allow_credentials)

    def test_build_openai_messages_inserts_history_before_current_user_turn(self) -> None:
        messages = build_openai_messages(
            runtime_system_prompt="system prompt",
            user_message="current user turn",
            conversation_history=[
                {"role": "user", "content": "previous user"},
                {"role": "assistant", "content": "previous assistant"},
            ],
        )

        self.assertEqual(
            messages,
            [
                {"role": "system", "content": "system prompt"},
                {"role": "user", "content": "previous user"},
                {"role": "assistant", "content": "previous assistant"},
                {"role": "user", "content": "current user turn"},
            ],
        )

    def test_build_user_message_includes_situation_and_single_chip(self) -> None:
        message = build_user_message(
            {
                "emotion": "불안해요",
                "ticker": "삼성전자",
                "situation": "급등 중이에요",
                "singleChip": "뉴스를 봤어요",
                "text": "지금이라도 안 사면 뒤쳐질까 봐 무서워요.",
            }
        )

        self.assertIn("[상황: 급등 중이에요]", message)
        self.assertIn("[singleChip: 뉴스를 봤어요]", message)

    def test_inject_runtime_context_marks_empty_or_null_text_as_not_present(self) -> None:
        self.assertIn(
            "text_present=False",
            inject_runtime_context(
                "system prompt",
                {
                    "mode": "pre",
                    "turn_number": 1,
                    "ticker": "NVDA",
                    "situation": "급등 중이에요",
                    "singleChip": "뉴스를 봤어요",
                    "text": "",
                },
            ),
        )
        self.assertIn(
            "text_present=False",
            inject_runtime_context(
                "system prompt",
                {
                    "mode": "pre",
                    "turn_number": 1,
                    "ticker": "NVDA",
                    "situation": "급등 중이에요",
                    "singleChip": "뉴스를 봤어요",
                    "text": None,
                },
            ),
        )

    def test_inject_runtime_context_includes_situation_and_single_chip(self) -> None:
        runtime_context = inject_runtime_context(
            "system prompt",
            {
                "mode": "post",
                "turn_number": 1,
                "ticker": "삼성전자",
                "situation": "급등 중이에요",
                "singleChip": "뉴스를 봤어요",
                "text": "지금이라도 안 사면 뒤쳐질까 봐 무서워요.",
            },
        )

        self.assertIn("situation=급등 중이에요", runtime_context)
        self.assertIn("singleChip=뉴스를 봤어요", runtime_context)


class ChatServiceTest(unittest.TestCase):
    def test_chat_service_preloads_prompt_and_schemas_once_at_init(self) -> None:
        fake_llm_schema = {"type": "object", "properties": {}}
        fake_api_schema = {"type": "object", "properties": {}}
        fake_openai_schema = {"type": "object"}

        with (
            patch("app.service.load_text", return_value="system prompt") as load_text_mock,
            patch("app.service.load_json", side_effect=[fake_llm_schema, fake_api_schema]) as load_json_mock,
            patch("app.service.build_openai_response_schema", return_value=fake_openai_schema) as build_schema_mock,
        ):
            service = ChatService()

        self.assertEqual(service.system_prompt, "system prompt")
        self.assertIs(service.llm_schema, fake_llm_schema)
        self.assertIs(service.api_schema, fake_api_schema)
        self.assertIs(service.openai_schema, fake_openai_schema)
        load_text_mock.assert_called_once_with(service.settings.prompt_file)
        self.assertEqual(
            load_json_mock.call_args_list,
            [
                ((service.settings.llm_schema_file,), {}),
                ((service.settings.api_schema_file,), {}),
            ],
        )
        build_schema_mock.assert_called_once_with(fake_llm_schema)

    def test_chat_request_normalizes_null_conversation_history_to_empty_list(self) -> None:
        request = ChatRequest.model_validate(
            {
                "mode": "pre",
                "situation": " 급등 중이에요 ",
                "singleChip": " 뉴스를 봤어요 ",
                "emotion": "불안해요",
                "text": "지금 사야 할까요?",
                "turn_number": 1,
                "conversation_history": None,
            }
        )

        self.assertEqual(request.conversation_history, [])
        self.assertEqual(request.situation, "급등 중이에요")
        self.assertEqual(request.single_chip, "뉴스를 봤어요")

    def test_chat_request_requires_situation_and_single_chip(self) -> None:
        with self.assertRaisesRegex(Exception, "Field required"):
            ChatRequest.model_validate(
                {
                    "mode": "pre",
                    "emotion": "불안해요",
                    "text": "지금 사야 할까요?",
                    "turn_number": 1,
                    "conversation_history": [],
                }
            )

    def test_chat_request_rejects_blank_situation_and_single_chip(self) -> None:
        with self.assertRaisesRegex(Exception, "must be a non-empty string"):
            ChatRequest.model_validate(
                {
                    "mode": "pre",
                    "situation": " ",
                    "singleChip": " ",
                    "emotion": "불안해요",
                    "text": "지금 사야 할까요?",
                    "turn_number": 1,
                    "conversation_history": [],
                }
            )

    def test_generate_chat_response_passes_conversation_history_to_openai(self) -> None:
        fake_payload = json.dumps(
            {
                "distortion_type": "catastrophizing",
                "distortion_tag": "파국화",
                "empathy": "그 마음이 이해돼요.",
                "question": "그 생각을 하게 된 근거는 무엇인가요?",
                "question_type": "exploratory",
                "meta_question": None,
                "meta_options": None,
                "reflection_summary": None,
            },
            ensure_ascii=False,
        )
        fake_client = _FakeClient(fake_payload)
        request = ChatRequest.model_validate(
            {
                "mode": "pre",
                "ticker": "NVDA",
                "situation": "급등 중이에요",
                "singleChip": "뉴스를 봤어요",
                "emotion": "불안해요",
                "text": "지금 사야 할까요?",
                "turn_number": 2,
                "previous_distortion_type": "catastrophizing",
                "conversation_history": [
                    {"role": "user", "content": "이전 사용자 질문"},
                    {"role": "assistant", "content": "이전 상담 응답"},
                ],
            }
        )

        with patch.dict(os.environ, {"OPENAI_API_KEY": "sk-test-key"}, clear=False):
            service = ChatService()
            service.client = fake_client
            response = service.generate_chat_response(request)

        self.assertEqual(response.required, False)
        sent_messages = fake_client.chat.completions.last_kwargs["messages"]
        self.assertIn("situation=급등 중이에요", sent_messages[0]["content"])
        self.assertIn("singleChip=뉴스를 봤어요", sent_messages[0]["content"])
        self.assertEqual(sent_messages[1], {"role": "user", "content": "이전 사용자 질문"})
        self.assertEqual(sent_messages[2], {"role": "assistant", "content": "이전 상담 응답"})
        self.assertEqual(sent_messages[-1]["role"], "user")
        self.assertIn("[상황: 급등 중이에요]", sent_messages[-1]["content"])
        self.assertIn("[singleChip: 뉴스를 봤어요]", sent_messages[-1]["content"])
        self.assertIn("지금 사야 할까요?", sent_messages[-1]["content"])


class AppIntegrationTest(unittest.TestCase):
    def test_health_endpoint_is_available_without_openai_api_key(self) -> None:
        client = TestClient(create_app())
        response = client.get("/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_cors_preflight_allows_cross_origin_chat_requests(self) -> None:
        with patch.dict(
            os.environ,
            {"AI_SERVER_CORS_ALLOW_ORIGINS": "https://frontend.example.com"},
            clear=False,
        ):
            client = TestClient(create_app())
            response = client.options(
                "/api/chat",
                headers={
                    "Origin": "https://frontend.example.com",
                    "Access-Control-Request-Method": "POST",
                },
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["access-control-allow-origin"], "https://frontend.example.com")


if __name__ == "__main__":
    unittest.main()
