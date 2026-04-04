import { create } from "zustand";

import type { SurveyAnswers, SurveyType } from "@/components/survey/Question";

interface SurveyState {
    surveyType: SurveyType;
    step: number;

    answers: Record<SurveyType, SurveyAnswers>;

    setSurveyType: (type: SurveyType) => void;
    setStep: (step: number) => void;

    setAnswer: (
        type: SurveyType,
        questionId: string,
        value: string | { id: number; name: string },
    ) => void;

    reset: (type?: SurveyType) => void;
}

const createInitialAnswers = (): Record<SurveyType, SurveyAnswers> => ({
    "pretrade-survey": {},
    "posttrade-survey": {},
});

export const useSurveyStore = create<SurveyState>((set) => ({
    surveyType: "pretrade-survey",
    step: 1,
    answers: createInitialAnswers(),

    setSurveyType: (type) => set({ surveyType: type }),

    setStep: (step) => set({ step }),

    setAnswer: (type, questionId, value) =>
        set((state) => ({
            answers: {
                ...state.answers,
                [type]: {
                    ...state.answers[type],
                    [questionId]: value,
                },
            },
        })),

    reset: (type) =>
        set((state) => {
            if (!type) return { answers: createInitialAnswers() };
            return {
                answers: {
                    ...state.answers,
                    [type]: {},
                },
            };
        }),
}));
