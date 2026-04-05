import type {
    DistortionType,
    LocalAiChatRequest,
    LocalAiChatResponse,
} from "@/type/aiChat";

export const LOCAL_OPENAI_KEY_STORAGE_KEY =
    "trademind_local_openai_api_key";

const DEFAULT_OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || "gpt-5";

const SYSTEM_PROMPT = `당신은 투자자의 인지 왜곡을 1개만 탐지하고 CBT 기반 메타인지 질문을 제공하는 AI입니다.

목표:
- 공감으로 시작하고 질문으로 사고를 정리하게 돕습니다.
- 사용자가 스스로 왜곡을 발견하게 합니다.
- 직접적인 투자 판단, 행동 지시, 추천은 하지 않습니다.

입력 필드:
- mode: "pre" | "post"
- ticker: string | null
- emotion: 단일 감정 태그
- text: 자유 텍스트 | null
- turn_number: 1 | 2
- previous_distortion_type: pre turn 2에서만 올 수 있음

전제:
- mode와 turn_number는 이미 결정된 값이므로 다시 판별하지 마세요.
- text가 없으면 emotion, ticker만 참고하세요.
- ticker가 null이면 "이 종목" 대신 "이 상황", "지금 느끼는 감정"처럼 표현하세요.

인지 왜곡 enum:
- catastrophizing
- all_or_nothing
- emotional_reasoning
- confirmation_bias
- fomo_herd
- illusion_of_control
- anchoring_bias
- sunk_cost

출력 규칙:
- distortion_type: 위 enum 중 1개
- distortion_tag: 사용자에게 보이는 짧은 일상 언어 태그
- empathy: 판단 없는 공감 1문장. "~셨군요", "~하셨겠어요" 어조 사용
- question: 사용자가 스스로 정리하게 하는 질문 1개
- question_type: "exploratory" | "meta_cognition"
- meta_question: meta_cognition일 때만 문자열, 아니면 null
- meta_options: meta_cognition일 때만 문자열 2개, 아니면 null
- reflection_summary:
  - pre turn1: null
  - pre turn2, post turn1: 반드시 문자열
  - 2문장
  - 관찰형 어조 사용
  - 결과를 판정하거나 단정하지 말고, 사용자의 마음을 함께 정리해주는 톤으로 작성
  - "보여요", "있었어요", "느껴졌을 수 있어요"처럼 여지를 두는 표현 사용
  - 사용자를 평가하거나 교정하려는 말투 금지
  - 직접 조언 금지
- required는 절대 출력하지 마세요

턴 규칙:
- turn 1: question_type은 반드시 exploratory, meta_question/meta_options는 null
- pre turn 2:
  - question_type은 반드시 meta_cognition
  - meta_question, meta_options(정확히 2개), reflection_summary는 반드시 작성
  - previous_distortion_type이 주어지면 기본적으로 유지
- post turn 1:
  - question_type은 반드시 exploratory
  - meta_question/meta_options는 null
  - reflection_summary는 반드시 작성

질문 원칙:
- 열린 질문
- 정답 유도 금지
- 감정 증폭 금지
- 전문 용어를 말풍선에 직접 쓰지 않기
- 사용자가 감정, 생각, 판단 근거를 구분하게 돕기

금지:
- 매수/매도/보유 지시
- 수익률 예측
- 종목 추천
- 투자 전략 제시
- required 필드 출력

톤:
- 차분하고 건조하게
- 과장 없는 공감
- 기본은 공감 1문장 + 질문 1문장
- reflection_summary는 상담 앱의 결과 요약처럼 부드럽고 부담 없게 작성

반드시 JSON 객체만 출력하세요.`;

function getOutputText(response: unknown) {
    const output = (response as { output?: unknown[] })?.output;

    if (!Array.isArray(output)) {
        return null;
    }

    for (const item of output) {
        const content = (item as { content?: unknown[] })?.content;
        if (!Array.isArray(content)) {
            continue;
        }

        for (const block of content) {
            if (
                (block as { type?: string }).type === "output_text" &&
                typeof (block as { text?: string }).text === "string"
            ) {
                return (block as { text: string }).text;
            }
        }
    }

    return null;
}

function isDistortionType(value: string): value is DistortionType {
    return [
        "catastrophizing",
        "all_or_nothing",
        "emotional_reasoning",
        "confirmation_bias",
        "fomo_herd",
        "illusion_of_control",
        "anchoring_bias",
        "sunk_cost",
    ].includes(value);
}

function parseLocalAiResponse(rawText: string): LocalAiChatResponse {
    const parsed = JSON.parse(rawText) as Record<string, unknown>;

    if (
        typeof parsed.distortion_type !== "string" ||
        !isDistortionType(parsed.distortion_type)
    ) {
        throw new Error("AI 응답의 distortion_type 형식이 올바르지 않습니다.");
    }

    if (
        typeof parsed.distortion_tag !== "string" ||
        typeof parsed.empathy !== "string" ||
        typeof parsed.question !== "string" ||
        typeof parsed.question_type !== "string"
    ) {
        throw new Error("AI 응답의 필수 문자열 필드가 누락되었습니다.");
    }

    if (
        parsed.question_type !== "exploratory" &&
        parsed.question_type !== "meta_cognition"
    ) {
        throw new Error("AI 응답의 question_type 값이 올바르지 않습니다.");
    }

    const metaQuestion =
        typeof parsed.meta_question === "string" ? parsed.meta_question : null;
    const metaOptions =
        Array.isArray(parsed.meta_options) &&
        parsed.meta_options.every((option) => typeof option === "string")
            ? parsed.meta_options
            : null;
    const reflectionSummary =
        typeof parsed.reflection_summary === "string"
            ? parsed.reflection_summary
            : null;

    return {
        distortionType: parsed.distortion_type,
        distortionTag: parsed.distortion_tag,
        empathy: parsed.empathy,
        question: parsed.question,
        questionType: parsed.question_type,
        metaQuestion: metaQuestion,
        metaOptions: metaOptions,
        reflectionSummary,
        // 백엔드가 하던 required 계산을 프론트에서 그대로 대체한다.
        required: parsed.question_type === "meta_cognition",
    };
}

export function getStoredOpenAiApiKey() {
    return window.localStorage.getItem(LOCAL_OPENAI_KEY_STORAGE_KEY) ?? "";
}

export function setStoredOpenAiApiKey(apiKey: string) {
    const trimmed = apiKey.trim();

    if (!trimmed) {
        window.localStorage.removeItem(LOCAL_OPENAI_KEY_STORAGE_KEY);
        return;
    }

    window.localStorage.setItem(LOCAL_OPENAI_KEY_STORAGE_KEY, trimmed);
}

export async function requestLocalAiChat(
    apiKey: string,
    payload: LocalAiChatRequest,
): Promise<LocalAiChatResponse> {
    const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: DEFAULT_OPENAI_MODEL,
            input: [
                {
                    role: "system",
                    content: [
                        {
                            type: "input_text",
                            text: SYSTEM_PROMPT,
                        },
                    ],
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "input_text",
                            text: JSON.stringify(
                                {
                                    mode: payload.mode,
                                    ticker: payload.ticker,
                                    emotion: payload.emotion,
                                    text: payload.text,
                                    turn_number: payload.turnNumber,
                                    previous_distortion_type:
                                        payload.previousDistortionType ?? null,
                                },
                                null,
                                2,
                            ),
                        },
                    ],
                },
            ],
            text: {
                // 공식 docs 기준으로 json_schema가 더 권장이지만,
                // 현재 handoff 스키마는 strict subset에 맞지 않아 데모 모드에서는 json_object + 클라이언트 검증으로 처리한다.
                format: {
                    type: "json_object",
                },
            },
        }),
    });

    const json = (await response.json()) as unknown;

    if (!response.ok) {
        const message =
            (json as { error?: { message?: string } })?.error?.message ??
            "OpenAI 호출에 실패했습니다.";
        throw new Error(message);
    }

    const outputText = getOutputText(json);

    if (!outputText) {
        throw new Error("AI 응답 본문을 읽을 수 없습니다.");
    }

    return parseLocalAiResponse(outputText);
}
