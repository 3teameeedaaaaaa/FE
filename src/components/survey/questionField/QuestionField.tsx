import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import type { Question, SurveyAnswers } from "../Question";
import EmotionFaceIcon from "./EmotionFaceIcon";
import StockSearchField from "./StockSearchField";

type FieldValue = string | { id: number; name: string };

interface QuestionFieldProps {
    question: Question;
    value: FieldValue;
    answers: SurveyAnswers;
    onChangeAnswer: (questionId: string, value: FieldValue) => void;
}

function QuestionField({
    question,
    value,
    onChangeAnswer,
}: QuestionFieldProps) {
    if (question.type === "stock-input") {
        return (
            <StockSearchField
                question={question}
                value={value}
                onChangeAnswer={onChangeAnswer}
            />
        );
    }

    return (
        <section className="space-y-4 rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_8px_24px_rgba(28,25,23,0.04)]">
            <div>
                <h2 className="text-base font-semibold text-stone-950">
                    {question.title}
                </h2>
                {question.description ? (
                    <p className="mt-2 text-sm leading-6 text-stone-500">
                        {question.description}
                    </p>
                ) : null}
            </div>
            {question.type === "chip-select" ? (
                <div className="flex flex-wrap gap-2.5">
                    {question.options?.map((option) => {
                        const selected = value === option;
                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() =>
                                    onChangeAnswer(question.id, option)
                                }
                                className={cn(
                                    "rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
                                    selected
                                        ? "border-stone-900 bg-stone-900 text-white"
                                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100",
                                )}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            ) : null}

            {question.type === "radio-select" ? (
                <div className="space-y-2.5">
                    {question.options?.map((option) => {
                        const selected = value === option;
                        const isEmotionQuestion = question.id === "emotion";
                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() =>
                                    onChangeAnswer(question.id, option)
                                }
                                className={cn(
                                    "flex w-full items-center gap-4 text-left transition-colors",
                                    isEmotionQuestion
                                        ? "rounded-[24px] px-5 py-5"
                                        : "rounded-2xl border px-4 py-4",
                                    isEmotionQuestion && selected
                                        ? "border-2 border-[#759FEF] bg-[rgba(117,159,239,0.10)] text-stone-950"
                                        : null,
                                    isEmotionQuestion && !selected
                                        ? "border border-stone-200 bg-white text-stone-900 hover:bg-stone-50"
                                        : null,
                                    !isEmotionQuestion && selected
                                        ? "border-stone-900 bg-stone-900 text-white"
                                        : null,
                                    !isEmotionQuestion && !selected
                                        ? "border-stone-200 bg-white text-stone-800 hover:bg-stone-50"
                                        : null,
                                )}
                            >
                                {isEmotionQuestion ? (
                                    <>
                                        <div className="flex flex-1 items-center justify-between gap-3 pr-1">
                                            <div className="flex items-center gap-3">
                                                <EmotionFaceIcon
                                                    emotion={
                                                        option as
                                                            | "확신해요"
                                                            | "조급해요"
                                                            | "불안해요"
                                                            | "후회돼요"
                                                            | "모르겠어요"
                                                    }
                                                    selected={selected}
                                                />
                                                <span className="text-base font-semibold text-stone-950">
                                                    {option}
                                                </span>
                                            </div>

                                            <span
                                                className={cn(
                                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                                                    selected
                                                        ? "bg-[rgba(117,159,239,0.40)] text-[#759FEF]"
                                                        : "bg-stone-200 text-transparent",
                                                )}
                                            >
                                                <Check className="h-4 w-4 stroke-[3]" />
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span
                                            className={cn(
                                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                                                selected
                                                    ? "border-white bg-white"
                                                    : "border-stone-300 bg-transparent",
                                            )}
                                        >
                                            {selected ? (
                                                <span className="h-2.5 w-2.5 rounded-full bg-stone-900" />
                                            ) : null}
                                        </span>
                                        <span className="text-sm font-medium">
                                            {option}
                                        </span>
                                    </>
                                )}
                            </button>
                        );
                    })}
                </div>
            ) : null}

            {question.type === "textarea" ? (
                <div>
                    <textarea
                        value={typeof value === "string" ? value : ""}
                        onChange={(event) =>
                            onChangeAnswer(question.id, event.target.value)
                        }
                        placeholder={
                            question.placeholder
                                ? `예시) ${question.placeholder.replace(/^예:\s*/, "")}`
                                : undefined
                        }
                        className="min-h-32 w-full resize-none rounded-2xl border border-stone-200 bg-white px-4 py-4 text-sm leading-6 text-stone-950 outline-none transition focus:border-stone-400"
                    />
                </div>
            ) : null}
        </section>
    );
}

export default QuestionField;
