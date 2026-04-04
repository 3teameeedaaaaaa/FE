import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { TypographyH1 } from "@/components/ui/Typography";
import useStep from "@/hooks/useStep";
import useSurveyType from "@/hooks/useSurveyType";
import { createChatSession } from "@/service/survey/createChatSession";
import { useSurveyStore } from "@/store/survey/SurveyStore";
import type { AnswerValue } from "@/type/answer";

import ActionButtons from "../actionButtons/ActionButtons";
import Body from "../body/Body";
import Desc from "../desc/Desc";
import SurveyHeader from "../header/SurveyHeader";
import {
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
    const isCurrentStepValid = currentStep.questions.every((question) =>
        isQuestionAnswered(question, answers),
    );
    const summaryItems = buildSurveySummary(answers);

    const isLastStep = currentStep.step === steps.length;
    const isSubmitStep = isLastStep && isBridgeStep;

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

    const SURVEY_PAYLOAD_KEY = "survey";

    const handleNext = async () => {
        if (!isBridgeStep && !isCurrentStepValid) {
            return;
        }

        // 👉 마지막 submit step일 때만 POST
        if (isSubmitStep) {
            const { detailText, emotion, situationTag, stock, thoughtTag } =
                answers;

            const payload = {
                mode: surveyType === "pretrade-survey" ? "PRE" : "POST",
                ticker: typeof stock === "object" ? stock.name : "",
                emotion: emotion as string,
                situation: thoughtTag as string,
                singleChip: situationTag as string,
                text: detailText as string,
                turn_number: 1,
                previouse_distorstion: "",
                conversation_history: [],
            };

            sessionStorage.setItem(SURVEY_PAYLOAD_KEY, JSON.stringify(payload));

            try {
                const res = await createChatSession(payload);

                console.log("API 응답", res);

                navigate("/aichat");
            } catch (error) {
                console.error("API 에러", error);
            }

            return;
        }

        // 👉 그 외는 step 이동만
        navigate(`/chat/${resolvedSurveyType}/${currentStep.step + 1}`);
        // 아직 API 계약이 없으므로, 문서 제안처럼 전송 직전 조합될 값을 남긴다.
    };

    return (
        <div className="flex min-h-full flex-1 flex-col bg-stone-50">
            <SurveyHeader
                step={currentStep.step}
                totalSteps={steps.length}
                onBack={handleBack}
            />

            <div className="flex flex-1 flex-col px-5 py-6">
                <div>
                    <TypographyH1>{currentStep.title}</TypographyH1>
                    {currentStep.description ? (
                        <Desc>{currentStep.description}</Desc>
                    ) : null}
                </div>

                {isBridgeStep ? (
                    <div className="mt-6 rounded-[28px] border border-stone-200 bg-white p-5">
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
                            <p className="mt-6 text-xs leading-5 text-stone-400">
                                {currentStep.bridgeNote}
                            </p>
                        ) : null}
                    </div>
                ) : (
                    <Body
                        questions={currentStep.questions}
                        answers={answers}
                        onChangeAnswer={handleChangeAnswer}
                    />
                )}

                <div className="mt-auto pt-6">
                    <ActionButtons
                        canGoBack={currentStep.step > 1}
                        isLastStep={currentStep.step === steps.length}
                        disabled={!isBridgeStep && !isCurrentStepValid}
                        submitLabel={currentStep.submitLabel}
                        onBack={handleBack}
                        onNext={handleNext}
                    />
                </div>
            </div>
        </div>
    );
};

export default QuestionBox;
