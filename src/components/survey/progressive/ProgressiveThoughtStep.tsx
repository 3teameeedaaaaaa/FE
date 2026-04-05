import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import type { AnswerValue } from "@/type/answer";

import type { Question, SurveyAnswers } from "../Question";
import QuestionField from "../questionField/QuestionField";

interface ProgressiveThoughtStepProps {
    questions: Question[];
    answers: SurveyAnswers;
    onChangeAnswer: (questionId: string, value: AnswerValue) => void;
}

function ProgressiveThoughtStep({
    questions,
    answers,
    onChangeAnswer,
}: ProgressiveThoughtStepProps) {
    const [firstQuestion, secondQuestion] = questions;
    const firstValue = answers[firstQuestion.id] ?? "";
    const secondValue = answers[secondQuestion.id] ?? "";
    const hasFirstSelection =
        typeof firstValue === "string" && firstValue.trim().length > 0;
    const [isFirstQuestionExpanded, setIsFirstQuestionExpanded] =
        useState(!hasFirstSelection);
    const showFirstQuestionExpanded =
        !hasFirstSelection || isFirstQuestionExpanded;

    const handleSelectFirst = (option: string) => {
        const nextValue = firstValue === option ? "" : option;

        onChangeAnswer(firstQuestion.id, nextValue);
        onChangeAnswer(secondQuestion.id, "");
        setIsFirstQuestionExpanded(nextValue.length === 0);
    };

    const handleEditFirst = () => {
        // 첫 선택을 바꾸면 아래 서술도 맥락이 달라지므로 함께 초기화한다.
        onChangeAnswer(firstQuestion.id, "");
        onChangeAnswer(secondQuestion.id, "");
        setIsFirstQuestionExpanded(true);
    };

    return (
        <div className="relative z-10 flex flex-col gap-4 pb-28">
            <AnimatePresence initial={false} mode="popLayout">
                {showFirstQuestionExpanded ? (
                    <motion.section
                        key="first-expanded"
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.24, ease: "easeOut" }}
                        className="space-y-4 rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_8px_24px_rgba(28,25,23,0.04)]"
                    >
                        <div>
                            <h2 className="text-base font-semibold text-stone-950">
                                {firstQuestion.title}
                            </h2>
                            {firstQuestion.description ? (
                                <p className="mt-2 text-sm leading-6 text-stone-500">
                                    {firstQuestion.description}
                                </p>
                            ) : null}
                        </div>

                        <div className="flex flex-wrap gap-2.5">
                            {firstQuestion.options?.map((option) => {
                                const selected = firstValue === option;

                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => handleSelectFirst(option)}
                                        className={[
                                            "rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
                                            selected
                                                ? "border-stone-900 bg-stone-900 text-white"
                                                : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100",
                                        ].join(" ")}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.section>
                ) : (
                    <motion.button
                        key="first-collapsed"
                        layout
                        type="button"
                        onClick={handleEditFirst}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.24, ease: "easeOut" }}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-left shadow-[0_6px_18px_rgba(28,25,23,0.04)]"
                    >
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-stone-400">
                                {firstQuestion.title}
                            </p>
                            <p className="mt-1 line-clamp-2 text-sm font-semibold text-stone-950">
                                {firstValue}
                            </p>
                        </div>
                        <span className="shrink-0 text-xs font-medium text-stone-500">
                            다시 선택
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
                {hasFirstSelection && !showFirstQuestionExpanded ? (
                    <motion.div
                        key="second-question"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                    >
                        <QuestionField
                            question={secondQuestion}
                            value={secondValue}
                            answers={answers}
                            onChangeAnswer={onChangeAnswer}
                        />
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}

export default ProgressiveThoughtStep;
