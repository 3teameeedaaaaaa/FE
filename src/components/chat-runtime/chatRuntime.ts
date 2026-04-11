import type { SurveyAnswers, SurveyType } from "@/components/survey/Question";
import type {
    ChatMessage,
    ChatMode,
    ConversationHistoryItem,
    LocalAiChatResponse,
} from "@/type/aiChat";

export function getChatMode(surveyType: SurveyType): ChatMode {
    return surveyType === "posttrade-survey" ? "post" : "pre";
}

export function getTickerLabel(answers: SurveyAnswers) {
    if (typeof answers.stock === "string") {
        return answers.stock || null;
    }

    return answers.stock?.name ?? null;
}

export function buildInitialUserText(answers: SurveyAnswers) {
    const ticker = getTickerLabel(answers);

    return [
        ticker ? `종목: ${ticker}` : null,
        answers.situationTag ? `상황: ${answers.situationTag}` : null,
        answers.emotion ? `감정: ${answers.emotion}` : null,
        answers.thoughtTag ? `생각: ${answers.thoughtTag}` : null,
        answers.detailText ? `추가: ${answers.detailText}` : null,
    ]
        .filter(Boolean)
        .join("\n");
}

export function createChatId(prefix: string) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function buildAssistantMessageText(response: LocalAiChatResponse) {
    return `${response.empathy}\n\n${response.question}`;
}

export function appendAssistantHistory(
    history: ConversationHistoryItem[],
    response: LocalAiChatResponse,
) {
    return [
        ...history,
        {
            role: "assistant" as const,
            content: `${response.empathy} ${response.question}`.trim(),
        },
    ];
}

export function createTypingMessage(): ChatMessage {
    return {
        id: createChatId("typing"),
        role: "typing",
    };
}
