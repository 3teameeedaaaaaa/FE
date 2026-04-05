export type ChatMode = "pre" | "post";
export type ChatRole = "assistant" | "user" | "typing";
export type QuestionType = "exploratory" | "meta_cognition";
export type DistortionType =
    | "catastrophizing"
    | "all_or_nothing"
    | "emotional_reasoning"
    | "confirmation_bias"
    | "fomo_herd"
    | "illusion_of_control"
    | "anchoring_bias"
    | "sunk_cost";

export interface ChatMessage {
    id: string;
    role: ChatRole;
    text?: string;
    showAvatar?: boolean;
}

export interface ConversationHistoryItem {
    role: "assistant" | "user";
    content: string;
}

export interface LocalAiChatRequest {
    mode: ChatMode;
    ticker: string | null;
    emotion: string;
    text: string | null;
    turnNumber: 1 | 2;
    previousDistortionType?: DistortionType | null;
}

export interface LocalAiChatResponse {
    distortionType: DistortionType;
    distortionTag: string;
    empathy: string;
    question: string;
    questionType: QuestionType;
    metaQuestion: string | null;
    metaOptions: string[] | null;
    reflectionSummary: string | null;
    required: boolean;
}

export interface ChatResultState {
    resultId?: string;
    surveyType: "pretrade-survey" | "posttrade-survey";
    mode: ChatMode;
    ticker: string | null;
    distortionTag: string;
    reflectionSummary: string;
    selectedMetaOptionIndex?: number;
    selectedMetaOption?: string;
    metaOptions?: string[] | null;
}
