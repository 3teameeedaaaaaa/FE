export type SurveyType = "pretrade-survey" | "posttrade-survey";
export type QuestionType =
    | "stock-input"
    | "chip-select"
    | "radio-select"
    | "textarea";
export type QuestionId =
    | "stock"
    | "situationTag"
    | "emotion"
    | "thoughtTag"
    | "detailText";

export interface Question {
    id: QuestionId;
    title: string;
    description?: string;
    type: QuestionType;
    placeholder?: string;
    helperText?: string;
    options?: string[];
    starters?: string[];
    required?: boolean;
}

export interface SurveyStep {
    step: number;
    title: string;
    description?: string;
    questions: Question[];
    submitLabel?: string;
    bridgeNote?: string;
}

export interface SurveyAnswers {
    stock?:
        | {
              id: number;
              name: string;
          }
        | string;
    situationTag?: string;
    emotion?: string;
    thoughtTag?: string;
    detailText?: string;
}

const emotionOptions = [
    "불안해요",
    "조급해요",
    "확신해요",
    "후회돼요",
    "모르겠어요",
];

const thoughtOptions = [
    "지금 안 하면 늦을 것 같아요",
    "더 떨어질까 불안해요",
    "본전 생각이 나요",
    "왜 그랬는지 후회돼요",
    "확신이 너무 커졌어요",
    "나만 놓칠까 조급해요",
];

const detailStarters = [
    "제가 제일 걱정하는 건...",
    "지금 놓치기 싫은 건...",
    "계속 머릿속에 도는 건...",
    "그때 제가 믿고 있었던 건...",
];

const pretradeSteps: SurveyStep[] = [
    {
        step: 1,
        title: "어떤 종목이 마음에 걸리세요?",
        description: "종목명을 입력하거나 목록에서 선택해 주세요.",
        questions: [
            {
                id: "stock",
                title: "종목",
                type: "stock-input",
                placeholder: "예: 삼성전자, TSLA",
                required: true,
            },
        ],
    },
    {
        step: 2,
        title: "상황과 감정을 함께 살펴볼게요",
        description: "빠르게 고르면서 지금 상태를 먼저 정리해 보세요.",
        questions: [
            {
                id: "situationTag",
                title: "지금 어떤 상황에 가까운가요?",
                description: "객관적인 상황 하나를 골라 주세요.",
                type: "chip-select",
                options: [
                    "급등 중이에요",
                    "급락 중이에요",
                    "횡보 중이에요",
                    "손실 중이에요",
                    "수익 중이에요",
                    "뉴스를 봤어요",
                    "주변 얘기를 들었어요",
                ],
                required: true,
            },
            {
                id: "emotion",
                title: "이런 상황에서 어떤 감정이 가장 크게 느껴지나요?",
                description: "가장 가까운 감정 하나를 골라 주세요.",
                type: "radio-select",
                options: emotionOptions,
                required: true,
            },
        ],
    },
    {
        step: 3,
        title: "지금 제일 걸리는 생각을 정리해 볼게요",
        description: "생각을 먼저 고르고, 그 이유를 짧게 적어 주세요.",
        questions: [
            {
                id: "thoughtTag",
                title: "지금 제일 마음에 걸리는 건 어떤 생각인가요?",
                description: "가장 가까운 생각 하나를 골라 주세요.",
                type: "chip-select",
                options: thoughtOptions,
                required: true,
            },
            {
                id: "detailText",
                title: "그 생각이 왜 계속 마음에 걸리나요?",
                description: "왜 그 생각이 계속 남는지만 적어주세요.",
                helperText:
                    "길게 적지 않아도 괜찮아요. 지금 제일 걸리는 걸 적어주세요.",
                type: "textarea",
                placeholder:
                    "예: 지금 안 사면 영영 놓칠 것 같아서 계속 조급해져요.",
                starters: detailStarters,
                required: true,
            },
        ],
    },
    {
        step: 4,
        title: "이런 내용으로 대화를 시작해요",
        description: "입력한 내용을 확인하고 다음 단계로 넘어가세요.",
        questions: [],
        submitLabel: "대화 시작하기",
        bridgeNote:
            "AI의 답변은 감정 점검을 위한 대화이며, 투자 조언이 아닙니다.",
    },
];

const posttradeSteps: SurveyStep[] = [
    {
        step: 1,
        title: "어떤 종목이 마음에 걸리세요?",
        description: "기록하고 싶은 종목을 먼저 적어 주세요.",
        questions: [
            {
                id: "stock",
                title: "종목",
                type: "stock-input",
                placeholder: "예: 삼성전자, TSLA",
                required: true,
            },
        ],
    },
    {
        step: 2,
        title: "매매 당시 상황과 감정을 함께 볼게요",
        description: "그때의 맥락을 먼저 고르고 감정을 이어서 선택해 주세요.",
        questions: [
            {
                id: "situationTag",
                title: "지금 어떤 상황에 가까운가요?",
                description: "매매 당시 상황 하나를 골라 주세요.",
                type: "chip-select",
                options: [
                    "급등할 때 샀어요",
                    "급락할 때 팔았어요",
                    "손실 중이에요",
                    "수익 중이에요",
                    "뉴스 보고 들어갔어요",
                    "주변 분위기에 휩쓸렸어요",
                ],
                required: true,
            },
            {
                id: "emotion",
                title: "이런 상황에서 어떤 감정이 가장 크게 느껴지나요?",
                description: "가장 가까운 감정 하나를 골라 주세요.",
                type: "radio-select",
                options: emotionOptions,
                required: true,
            },
        ],
    },
    {
        step: 3,
        title: "그때의 생각과 이유를 정리해 볼게요",
        description: "생각을 먼저 고르고, 마음에 남는 이유를 적어 주세요.",
        questions: [
            {
                id: "thoughtTag",
                title: "지금 제일 마음에 걸리는 건 어떤 생각인가요?",
                description: "가장 가까운 생각 하나를 골라 주세요.",
                type: "chip-select",
                options: thoughtOptions,
                required: true,
            },
            {
                id: "detailText",
                title: "그 생각이 왜 계속 마음에 걸리나요?",
                description: "왜 그 생각이 계속 남는지만 적어주세요.",
                helperText:
                    "길게 적지 않아도 괜찮아요. 지금 제일 걸리는 걸 적어주세요.",
                type: "textarea",
                placeholder:
                    "예: 왜 그때 들어갔는지 스스로도 납득이 안 돼서 계속 걸려요.",
                starters: detailStarters,
                required: true,
            },
        ],
    },
    {
        step: 4,
        title: "이런 내용으로 대화를 시작해요",
        description: "입력한 내용을 확인하고 다음 단계로 넘어가세요.",
        questions: [],
        submitLabel: "대화 시작하기",
        bridgeNote:
            "AI의 답변은 감정 점검을 위한 대화이며, 투자 조언이 아닙니다.",
    },
];

export const surveyStepsByType: Record<SurveyType, SurveyStep[]> = {
    "pretrade-survey": pretradeSteps,
    "posttrade-survey": posttradeSteps,
};

export function getSurveySteps(surveyType?: string) {
    if (surveyType === "posttrade-survey") {
        return surveyStepsByType["posttrade-survey"];
    }

    return surveyStepsByType["pretrade-survey"];
}

export function isQuestionAnswered(question: Question, answers: SurveyAnswers) {
    if (!question.required) {
        return true;
    }

    const key = question.id as keyof SurveyAnswers;
    const value = answers[key];

    if (typeof value === "string") {
        return value.trim().length > 0;
    }

    if (typeof value === "object" && value !== null) {
        return !!value; // stock 객체 체크
    }

    return false;
}

export function buildSurveySummary(answers: SurveyAnswers) {
    const stockLabel =
        typeof answers.stock === "string" ? answers.stock : answers.stock?.name;

    return [
        { label: "종목", value: stockLabel },
        { label: "상황", value: answers.situationTag },
        { label: "감정", value: answers.emotion },
        { label: "생각", value: answers.thoughtTag },
        { label: "추가", value: answers.detailText },
    ].filter((item) => item.value);
}

export function buildSurveyPayloadText(answers: SurveyAnswers) {
    return [
        answers.situationTag ? `상황: ${answers.situationTag}` : "",
        answers.emotion ? `감정: ${answers.emotion}` : "",
        answers.thoughtTag ? `생각: ${answers.thoughtTag}` : "",
        answers.detailText ? `추가: ${answers.detailText}` : "",
    ]
        .filter(Boolean)
        .join("\n");
}
