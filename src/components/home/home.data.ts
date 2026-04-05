export type HomeSentimentItem = {
    label: string;
    percent: number;
    tone: string;
    emphasized?: boolean;
};

export type HomeStoryCategory = "all" | "pre" | "post";

export type HomeStoryItem = {
    id: number;
    category: "pre" | "post";
    emotionLabel: string;
    emotionTone: string;
    content: string;
};

export const homeSentimentItems: HomeSentimentItem[] = [
    {
        label: "지금 아니면 안된다는 생각",
        percent: 38,
        tone: "#44403C",
        emphasized: true,
    },
    {
        label: "최악을 상상하고 있어요",
        percent: 27,
        tone: "#78716C",
    },
    {
        label: "나만 뒤처지는 것 같은 느낌",
        percent: 19,
        tone: "#A8A29E",
    },
    {
        label: "불안함이 신호처럼 느껴져요",
        percent: 16,
        tone: "#D6D3D1",
    },
];

export const homeStoryFilters: {
    id: HomeStoryCategory;
    label: string;
}[] = [
    { id: "all", label: "전체" },
    { id: "pre", label: "사전" },
    { id: "post", label: "사후" },
];

export const homeStoryItems: HomeStoryItem[] = [
    {
        id: 1,
        category: "pre",
        emotionLabel: "지금 아니면 안 된다는 생각",
        emotionTone: "#45556C",
        content: "NVDA 급등 보고 30분 기다렸다가 안 샀어요",
    },
    {
        id: 2,
        category: "pre",
        emotionLabel: "최악을 상상하고 있어요",
        emotionTone: "#62748E",
        content: "삼성전자 3일 연속 하락인데 일단 버텨보기로 했어요",
    },
    {
        id: 3,
        category: "post",
        emotionLabel: "지금 아니면 안 된다는 생각",
        emotionTone: "#45556C",
        content: "급등장에서 산 거 거의 다 후회함. 이제 30분 기다리는 규칙 만들었어요",
    },
    {
        id: 4,
        category: "pre",
        emotionLabel: "나만 뒤처지는 것 같은 느낌",
        emotionTone: "#90A1B9",
        content: "FOMO인 거 알면서도 샀다가 후회한 게 한두 번이 아니에요",
    },
];
