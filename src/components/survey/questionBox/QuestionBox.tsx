import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import BottomGradientBackdrop from "@/components/ui/BottomGradientBackdrop";
import { TypographyH1 } from "@/components/ui/Typography";
import useStep from "@/hooks/useStep";
import useSurveyType from "@/hooks/useSurveyType";
import { useSurveyStore } from "@/store/survey/SurveyStore";
import type { AnswerValue } from "@/type/answer";

import ActionButtons from "../actionButtons/ActionButtons";
import Body from "../body/Body";
import Desc from "../desc/Desc";
import SurveyHeader from "../header/SurveyHeader";
import ProgressiveDualStep from "../progressive/ProgressiveDualStep";
import ProgressiveThoughtStep from "../progressive/ProgressiveThoughtStep";
import {
    buildSurveyPayloadText,
    buildSurveySummary,
    getSurveySteps,
    isQuestionAnswered,
} from "../Question";

const QuestionBox = () => {
    const navigate = useNavigate();
    const surveyType = useSurveyType();
    const currentStepNumber = useStep();
    const resolvedSurveyType =
        surveyType === "posttrade-survey"
            ? "posttrade-survey"
            : "pretrade-survey";
    const steps = useMemo(
        () => getSurveySteps(resolvedSurveyType),
        [resolvedSurveyType],
    );
    const answers = useSurveyStore((s) => s.answers[resolvedSurveyType]);
    const setAnswer = useSurveyStore((s) => s.setAnswer);

    const currentStep =
        steps.find((step) => step.step === currentStepNumber) ?? steps[0];
    const isBridgeStep = currentStep.questions.length === 0;
    const isStockEntryStep =
        currentStep.step === 1 &&
        currentStep.questions.length === 1 &&
        currentStep.questions[0]?.type === "stock-input";
    const isProgressiveSelectionStep =
        currentStep.step === 2 &&
        currentStep.questions.length === 2 &&
        currentStep.questions[0]?.type === "chip-select" &&
        currentStep.questions[1]?.type === "radio-select";
    const isProgressiveThoughtStep =
        currentStep.step === 3 &&
        currentStep.questions.length === 2 &&
        currentStep.questions[0]?.type === "chip-select" &&
        currentStep.questions[1]?.type === "textarea";
    const isCurrentStepValid = currentStep.questions.every((question) =>
        isQuestionAnswered(question, answers),
    );
    const summaryItems = buildSurveySummary(answers);

    useEffect(() => {
        // 잘못된 step 접근은 첫 화면으로 정리해서 상태 분기를 단순하게 유지한다.
        if (currentStepNumber < 1 || currentStepNumber > steps.length) {
            navigate(`/chat/${resolvedSurveyType}/1`, { replace: true });
        }
    }, [currentStepNumber, navigate, resolvedSurveyType, steps.length]);

    const handleChangeAnswer = (questionId: string, value: AnswerValue) => {
        setAnswer(resolvedSurveyType, questionId, value);
    };

    const handleBack = () => {
        if (currentStep.step === 1) {
            navigate("/chat");
            return;
        }

        navigate(`/chat/${resolvedSurveyType}/${currentStep.step - 1}`);
    };

    const handleNext = () => {
        if (!isBridgeStep && !isCurrentStepValid) {
            return;
        }

        if (currentStep.step < steps.length) {
            navigate(`/chat/${resolvedSurveyType}/${currentStep.step + 1}`);
            return;
        }

        // 아직 API 계약이 없으므로, 문서 제안처럼 전송 직전 조합될 값을 남긴다.
        console.log({
            surveyType: resolvedSurveyType,
            answers,
            text: buildSurveyPayloadText(answers),
        });
        navigate(`/chat/${resolvedSurveyType}/conversation`);
    };

    const handleSkipStock = () => {
        if (currentStep.step < steps.length) {
            navigate(`/chat/${resolvedSurveyType}/${currentStep.step + 1}`);
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col bg-stone-50">
            <SurveyHeader
                step={currentStep.step}
                totalSteps={steps.length}
                onBack={handleBack}
            />

            {isStockEntryStep ? (
                <div className="relative flex flex-1 flex-col overflow-hidden">
                    <BottomGradientBackdrop className="pointer-events-none absolute left-0 top-[252px] z-0 h-[772px] w-[390px] overflow-hidden" />

                    <div className="relative z-10 px-5 py-7">
                        <h1 className="whitespace-pre-line text-left text-2xl font-bold leading-9 text-stone-950">
                            {currentStep.title}
                        </h1>
                        {currentStep.description ? (
                            <p className="mt-5 text-left font-serif text-sm leading-6 text-stone-500">
                                {currentStep.description}
                            </p>
                        ) : null}
                    </div>

                    <div className="relative z-10 mt-auto px-5 pb-5">
                        <Body
                            questions={currentStep.questions}
                            answers={answers}
                            onChangeAnswer={handleChangeAnswer}
                            className="mt-0 space-y-0"
                        />
                    </div>

                    <div className="relative z-20 border-t border-stone-200 bg-white px-5 pb-5 pt-4">
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={!isCurrentStepValid}
                            className="h-14 w-full rounded-2xl bg-stone-900 text-base font-bold text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
                        >
                            다음
                        </button>

                        <button
                            type="button"
                            onClick={handleSkipStock}
                            className="mt-3 block w-full py-3 text-center text-sm font-medium text-stone-500"
                        >
                            종목 없이 건너갈게요
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative flex flex-1 flex-col overflow-hidden">
                    <BottomGradientBackdrop className="pointer-events-none absolute left-0 top-[320px] z-0 h-[772px] w-[390px] overflow-hidden opacity-85" />

                    <div className="relative z-10 px-5 pb-6 pt-6">
                        <TypographyH1>{currentStep.title}</TypographyH1>
                        {currentStep.description ? (
                            <Desc>{currentStep.description}</Desc>
                        ) : null}
                    </div>

                    <div className="relative z-10 flex-1 overflow-y-auto px-5 pb-32">
                        {isBridgeStep ? (
                            <div className="mt-8 rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_8px_24px_rgba(28,25,23,0.04)]">
                                <div className="space-y-3">
                                    {summaryItems.map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex items-start justify-between gap-4 border-b border-stone-100 pb-3 last:border-b-0 last:pb-0"
                                        >
                                            <span className="text-sm text-stone-500">
                                                {item.label}
                                            </span>
                                            <span className="max-w-[70%] text-right text-sm font-medium text-stone-900">
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {currentStep.bridgeNote ? (
                                    <p className="pt-5 text-xs leading-5 text-stone-400">
                                        {currentStep.bridgeNote}
                                    </p>
                                ) : null}
                            </div>
                        ) : isProgressiveSelectionStep ? (
                            <div className="mt-4">
                                <ProgressiveDualStep
                                    questions={currentStep.questions}
                                    answers={answers}
                                    onChangeAnswer={handleChangeAnswer}
                                />
                            </div>
                        ) : isProgressiveThoughtStep ? (
                            <div className="mt-4">
                                <ProgressiveThoughtStep
                                    questions={currentStep.questions}
                                    answers={answers}
                                    onChangeAnswer={handleChangeAnswer}
                                />
                            </div>
                        ) : (
                            <Body
                                questions={currentStep.questions}
                                answers={answers}
                                onChangeAnswer={handleChangeAnswer}
                                className="mt-4 space-y-5"
                            />
                        )}
                    </div>

                    {isProgressiveSelectionStep || isProgressiveThoughtStep ? (
                        <div className="fixed inset-x-0 bottom-0 z-30">
                            <div className="mx-auto w-full max-w-[390px] border-t border-stone-200 bg-white/95 px-5 pb-5 pt-4 backdrop-blur-sm">
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={!isCurrentStepValid}
                                    className="h-14 w-full rounded-2xl bg-stone-900 text-base font-bold text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
                                >
                                    다음
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative z-20 border-t border-stone-200 bg-white px-5 pb-5 pt-4">
                            <ActionButtons
                                canGoBack={
                                    currentStep.step > 1 &&
                                    currentStep.step !== steps.length
                                }
                                isLastStep={currentStep.step === steps.length}
                                disabled={!isBridgeStep && !isCurrentStepValid}
                                submitLabel={currentStep.submitLabel}
                                onBack={handleBack}
                                onNext={handleNext}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuestionBox;
