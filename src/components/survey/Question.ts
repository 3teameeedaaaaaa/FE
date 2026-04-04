export type QuestionType = "input" | "textarea" | "select";

export interface Question {
    step: number;
    title: string;
    description?: string;
    type: QuestionType;
    options?: string[]; // select일 때만 사용
}

export const questions: Question[] = [
    {
        step: 1,
        title: "어떤 종목이 마음에 걸리세요?",
        description: "종목명을 입력하거나 목록에서 선택해 주세요.",
        type: "input",
    },
    {
        step: 2,
        title: "지금 어떤 감정에 가까운가요?",
        description: "가장 가까운 감정 하나를 골라 주세요.",
        type: "select",
        options: ["불안해요", "조급해요", "확신해요", "후회돼요", "모르겠어요"],
    },
    {
        step: 3,
        title: "어떤 상황 때문에 '불안해요'라고 느껴지나요?",
        description: "지금 상황을 자유롭게 적어 주세요.",
        type: "textarea",
    },
];
