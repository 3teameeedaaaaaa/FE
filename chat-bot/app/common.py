from __future__ import annotations

import json
import os
from datetime import datetime
from functools import lru_cache
from pathlib import Path
from typing import Any, Literal, Sequence

from jsonschema import validate


ROOT_DIR = Path(__file__).resolve().parents[1]


def load_env_file() -> None:
    candidates = [
        ROOT_DIR / ".env",
        ROOT_DIR / "tests" / "env",
    ]

    for path in candidates:
        if not path.exists():
            continue
        for raw_line in path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = value
        return


@lru_cache(maxsize=None)
def load_json(relative_path: str) -> dict[str, Any]:
    return json.loads((ROOT_DIR / relative_path).read_text(encoding="utf-8"))


def load_json_path(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def build_claude_tool_schema(schema: dict[str, Any]) -> dict[str, Any]:
    unsupported_keys = {
        "$schema",
        "$id",
        "title",
        "allOf",
        "anyOf",
        "oneOf",
        "if",
        "then",
        "else",
        "not",
        "dependentSchemas",
        "dependencies",
        "patternProperties",
        "unevaluatedProperties",
        "minItems",
        "maxItems",
    }

    if isinstance(schema, dict):
        cleaned: dict[str, Any] = {}
        for key, value in schema.items():
            if key in unsupported_keys:
                continue
            cleaned[key] = build_claude_tool_schema(value)
        return cleaned

    if isinstance(schema, list):
        return [build_claude_tool_schema(item) for item in schema]

    return schema


def build_openai_response_schema(schema: dict[str, Any]) -> dict[str, Any]:
    unsupported_keys = {
        "$schema",
        "$id",
        "title",
        "allOf",
        "anyOf",
        "oneOf",
        "if",
        "then",
        "else",
        "not",
        "dependentSchemas",
        "dependencies",
        "patternProperties",
        "unevaluatedProperties",
    }

    if isinstance(schema, dict):
        cleaned: dict[str, Any] = {}
        for key, value in schema.items():
            if key in unsupported_keys:
                continue
            cleaned[key] = build_openai_response_schema(value)
        return cleaned

    if isinstance(schema, list):
        return [build_openai_response_schema(item) for item in schema]

    return schema


@lru_cache(maxsize=None)
def load_text(relative_path: str) -> str:
    return (ROOT_DIR / relative_path).read_text(encoding="utf-8")


def build_user_message(req: dict[str, Any]) -> str:
    parts: list[str] = []
    if req.get("emotion"):
        parts.append(f"[감정 상태: {req['emotion']}]")
    if req.get("ticker"):
        parts.append(f"[종목: {req['ticker']}]")
    if req.get("situation"):
        parts.append(f"[상황: {req['situation']}]")
    if req.get("singleChip"):
        parts.append(f"[singleChip: {req['singleChip']}]")
    if req.get("text"):
        parts.append(req["text"])
    else:
        parts.append("[자유 텍스트 없음]")
    return "\n".join(parts)


def build_openai_messages(
    runtime_system_prompt: str,
    user_message: str,
    conversation_history: Sequence[dict[str, Any]] | None,
) -> list[dict[str, str]]:
    messages: list[dict[str, str]] = [{"role": "system", "content": runtime_system_prompt}]
    for message in conversation_history or []:
        messages.append(
            {
                "role": str(message["role"]),
                "content": str(message["content"]),
            }
        )
    messages.append({"role": "user", "content": user_message})
    return messages


def inject_runtime_context(system_prompt: str, req: dict[str, Any]) -> str:
    runtime_context = (
        f"{system_prompt}\n\n"
        "[RUNTIME CONTEXT]\n"
        f"mode={req['mode']}\n"
        f"turn_number={req['turn_number']}\n"
        f"ticker={req.get('ticker')}\n"
        f"situation={req.get('situation')}\n"
        f"singleChip={req.get('singleChip')}\n"
        f"text_present={bool(req.get('text'))}\n"
    )
    if req.get("previous_distortion_type") is not None:
        runtime_context += f"previous_distortion_type={req['previous_distortion_type']}\n"
    return runtime_context


def question_type_to_required(
    question_type: Literal["exploratory", "meta_cognition"]
) -> bool:
    mapping = {
        "exploratory": False,
        "meta_cognition": True,
    }
    return mapping[question_type]


def validate_llm_response(
    response_json: dict[str, Any],
    schema: dict[str, Any] | None = None,
) -> None:
    schema = schema or load_json("schemas/llm_output/cbt_response_v1.0.json")
    validate(instance=response_json, schema=schema)


def validate_api_response(
    response_json: dict[str, Any],
    schema: dict[str, Any] | None = None,
) -> None:
    schema = schema or load_json("schemas/api_contract/chat_response_v1.0.json")
    validate(instance=response_json, schema=schema)


def save_markdown_result(
    output_path: Path,
    title: str,
    fixture_name: str,
    request_json: dict[str, Any],
    response_json: dict[str, Any],
    notes: list[str],
) -> None:
    timestamp = datetime.now().isoformat(timespec="seconds")
    note_lines = "\n".join(f"- {note}" for note in notes) if notes else "- "
    content = f"""# {title}

- 생성 시각: {timestamp}
- fixture: `{fixture_name}`

## Request

```json
{json.dumps(request_json, ensure_ascii=False, indent=2)}
```

## Response

```json
{json.dumps(response_json, ensure_ascii=False, indent=2)}
```

## Notes

{note_lines}
"""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(content, encoding="utf-8")


def maybe_load_expectation(fixture_path: Path) -> dict[str, Any] | None:
    if fixture_path.name.endswith(".request.json"):
        expect_path = fixture_path.with_name(
            fixture_path.name.replace(".request.json", ".expect.json")
        )
    else:
        expect_path = fixture_path.with_suffix(".expect.json")

    if not expect_path.exists():
        return None
    return load_json_path(expect_path)


def evaluate_expectation(
    expectation: dict[str, Any],
    response_json: dict[str, Any],
) -> list[str]:
    notes: list[str] = []

    if "expected_question_type" in expectation:
        expected = expectation["expected_question_type"]
        actual = response_json.get("question_type")
        status = "PASS" if actual == expected else "FAIL"
        notes.append(
            f"EXPECT {status}: question_type expected={expected}, actual={actual}"
        )

    if "expected_required" in expectation:
        expected = expectation["expected_required"]
        actual = response_json.get("required")
        status = "PASS" if actual == expected else "FAIL"
        notes.append(f"EXPECT {status}: required expected={expected}, actual={actual}")

    if "preferred_distortions" in expectation:
        preferred = expectation["preferred_distortions"]
        actual = response_json.get("distortion_type")
        status = "PASS" if actual in preferred else "FAIL"
        notes.append(
            f"EXPECT {status}: distortion_type actual={actual}, preferred={preferred}"
        )

    if "expected_reflection_summary_null" in expectation:
        expected_null = expectation["expected_reflection_summary_null"]
        actual = response_json.get("reflection_summary")
        if expected_null:
            status = "PASS" if actual is None else "FAIL"
            notes.append(
                f"EXPECT {status}: reflection_summary expected=null, actual={repr(actual)}"
            )
        else:
            status = "PASS" if isinstance(actual, str) and len(actual) > 0 else "FAIL"
            notes.append(
                f"EXPECT {status}: reflection_summary expected=non-null string, actual={repr(actual)}"
            )

    if "forbidden_phrases" in expectation:
        forbidden = expectation["forbidden_phrases"]
        haystacks: list[str] = [
            str(response_json.get("empathy") or ""),
            str(response_json.get("question") or ""),
            str(response_json.get("meta_question") or ""),
        ]
        haystacks.extend(str(option) for option in (response_json.get("meta_options") or []))
        merged = "\n".join(haystacks)
        found = [phrase for phrase in forbidden if phrase in merged]
        status = "PASS" if not found else "FAIL"
        if found:
            notes.append(f"EXPECT {status}: forbidden_phrases found={found}")
        else:
            notes.append("EXPECT PASS: forbidden_phrases not found")

    return notes
