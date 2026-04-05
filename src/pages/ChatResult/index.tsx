import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { getChatResultConfig } from "@/components/chat-runtime/chatResultConfig";
import ChatResultHeader from "@/components/chat-runtime/ChatResultHeader";
import ChatResultSummaryCard from "@/components/chat-runtime/ChatResultSummaryCard";
import ChatResultTogetherCard from "@/components/chat-runtime/ChatResultTogetherCard";
import { useRecordStore } from "@/store/record/RecordStore";
import { useSurveyStore } from "@/store/survey/SurveyStore";
import type { ChatResultState } from "@/type/aiChat";

function ChatResult() {
    const navigate = useNavigate();
    const params = useParams<{ surveyType: "pretrade-survey" | "posttrade-survey" }>();
    const location = useLocation();
    const state = location.state as ChatResultState | null;
    const surveyType =
        params.surveyType === "posttrade-survey"
            ? "posttrade-survey"
            : "pretrade-survey";
    const mode = state?.mode ?? (surveyType === "posttrade-survey" ? "post" : "pre");
    const config = getChatResultConfig(mode);
    const answers = useSurveyStore((store) => store.answers[surveyType]);
    const addRecord = useRecordStore((store) => store.addRecord);

    useEffect(() => {
        if (!state?.reflectionSummary) {
            navigate(`/chat/${surveyType}/conversation`, { replace: true });
        }
    }, [navigate, state?.reflectionSummary, surveyType]);

    useEffect(() => {
        if (!state?.reflectionSummary || !state.resultId) {
            return;
        }

        addRecord({
            id: state.resultId,
            phase: mode === "pre" ? "사전" : "사후",
            emotion: answers.emotion ?? "복잡해요",
            thought: state.distortionTag,
            summary: state.reflectionSummary,
            createdAt: new Date().toISOString(),
            ticker: state.ticker,
        });
    }, [
        addRecord,
        answers.emotion,
        mode,
        state?.distortionTag,
        state?.reflectionSummary,
        state?.resultId,
        state?.ticker,
    ]);

    if (!state?.reflectionSummary) {
        return null;
    }

    const handleClose = () => {
        navigate("/chat", { replace: true });
    };

    const handlePrimaryAction = () => {
        navigate("/", { replace: true });
    };

    return (
        <div className="flex min-h-full flex-1 flex-col bg-stone-50">
            <ChatResultHeader
                label={config.headerLabel}
                title={config.headerTitle}
                dotClassName={config.headerDotClassName}
                onClose={handleClose}
            />

            <div className="relative flex-1 overflow-y-auto pb-[192px]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[1120px] overflow-hidden">
                    <div className="absolute left-[6px] top-[146px] h-[545px] w-[323px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,223,209,0.26)_0%,_rgba(255,223,209,0)_68%)]" />
                    <div className="absolute left-[6px] top-[51px] h-[483px] w-[385px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(183,205,255,0.24)_0%,_rgba(183,205,255,0)_72%)]" />
                </div>

                <main className="relative z-10 space-y-5 px-4 pb-8 pt-6">
                    <ChatResultSummaryCard
                        tag={state.distortionTag}
                        title={config.summaryTitle}
                        summary={state.reflectionSummary}
                    />

                    <ChatResultTogetherCard
                        percent={config.donutPercent}
                        centerLabel={config.donutCenterLabel}
                        legends={config.legends}
                        examples={config.examples}
                    />
                </main>
            </div>

            <div className="fixed bottom-0 left-1/2 z-30 w-[390px] max-w-full -translate-x-1/2 border-t border-stone-200 bg-white px-5 pb-5 pt-3">
                <p className="px-5 text-center text-sm leading-5 font-semibold text-[#4A4A4A]">
                    {config.footerHelper}
                </p>

                <div className="mt-[10px]">
                    <button
                        type="button"
                        onClick={handlePrimaryAction}
                        className="flex h-14 w-full items-center justify-center rounded-2xl bg-stone-900 text-base leading-6 font-bold text-stone-50 transition-colors hover:bg-stone-800"
                    >
                        {config.primaryButtonLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatResult;
