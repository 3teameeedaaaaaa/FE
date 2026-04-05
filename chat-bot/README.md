# Python AI Server Draft

FastAPI 기반의 초안 서버입니다.

목적:
- `python_ai_server` 내부 프롬프트/스키마/검증 유틸을 사용
- `POST /api/chat`으로 turn1/turn2 요청 처리
- `question_type -> required` 매핑을 서버에서 수행

기본값:
- prompt: `prompts/system/system_v1.9.txt`
- llm schema: `schemas/llm_output/cbt_response_v1.0.json`
- api schema: `schemas/api_contract/chat_response_v1.0.json`
- CORS: `localhost`/`127.0.0.1` 모든 포트 허용
- model: `gpt-5.4`
- temperature: `0.6`
- openai timeout: `20s`
- host: `127.0.0.1`
- port: `8000`

## Run

```bash
cd /Users/kyu/hackert/python_ai_server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Example

```bash
curl -X POST http://127.0.0.1:8000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{
    "mode": "pre",
    "ticker": "NVDA",
    "situation": "급등 중이에요",
    "singleChip": "뉴스를 봤어요",
    "emotion": "불안해요",
    "text": "다들 엔비디아로 돈 벌었다는데 나만 못 탄 것 같아요. 지금이라도 들어가야 할까요?",
    "turn_number": 1,
    "conversation_history": []
  }'
```

## Endpoints

- `GET /health`
- `POST /api/chat`

## Env

- `OPENAI_API_KEY`
- `AI_PROMPT_FILE`
- `AI_SERVER_CORS_ALLOW_ORIGINS`
- `AI_SERVER_HOST`
- `AI_SERVER_PORT`
- `OPENAI_MODEL`
- `OPENAI_TEMPERATURE`
- `OPENAI_TIMEOUT_SECONDS`
- `AI_SERVER_LOG_LEVEL`

`AI_SERVER_CORS_ALLOW_ORIGINS`를 비우면 개발용으로 `localhost`와 `127.0.0.1`의 모든 포트를 허용합니다. `*`를 명시하면 CORS credentials는 자동으로 비활성화됩니다.
