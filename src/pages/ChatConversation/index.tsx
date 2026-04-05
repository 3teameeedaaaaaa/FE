import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    appendAssistantHistory,
    buildAssistantMessageText,
    buildInitialUserText,
    createChatId,
    createTypingMessage,
    getChatMode,
    getTickerLabel,
} from "@/components/chat-runtime/chatRuntime";
import LocalApiKeyCard from "@/components/chat-runtime/LocalApiKeyCard";
import LocalChatFooter from "@/components/chat-runtime/LocalChatFooter";
import LocalChatHeader from "@/components/chat-runtime/LocalChatHeader";
import LocalChatMessageList from "@/components/chat-runtime/LocalChatMessageList";
import LocalDistortionBanner from "@/components/chat-runtime/LocalDistortionBanner";
import type { SurveyType } from "@/components/survey/Question";
import BottomGradientBackdrop from "@/components/ui/BottomGradientBackdrop";
import { getStoredOpenAiApiKey, requestLocalAiChat } from "@/service/ai/localAiClient";
import { useSurveyStore } from "@/store/survey/SurveyStore";
import type {
    ChatMessage,
    ChatResultState,
    ConversationHistoryItem,
    LocalAiChatResponse,
} from "@/type/aiChat";

function ChatConversation() {
    const navigate = useNavigate();
    const params = useParams<{ surveyType: SurveyType }>();
    const surveyType =
        params.surveyType === "posttrade-survey"
            ? "posttrade-survey"
            : "pretrade-survey";
    const answers = useSurveyStore((state) => state.answers[surveyType]);
    const mode = getChatMode(surveyType);
    const ticker = getTickerLabel(answers);
    const openingText = useMemo(() => buildInitialUserText(answers), [answers]);
    const [apiKey, setApiKey] = useState(getStoredOpenAiApiKey());
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [history, setHistory] = useState<ConversationHistoryItem[]>([]);
    const [composerValue, setComposerValue] = useState("");
    const [distortionTag, setDistortionTag] = useState("");
    const [latestResponse, setLatestResponse] = useState<LocalAiChatResponse | null>(null);
    const [turnNumber, setTurnNumber] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!answers.emotion) {
            navigate(`/chat/${surveyType}/1`, { replace: true });
        }
    }, [answers.emotion, navigate, surveyType]);

    useEffect(() => {
        if (!apiKey || !answers.emotion) {
            return;
        }

        let cancelled = false;

        const requestTurnOne = async () => {
            setLoading(true);
            setError("");

            const initialMessages: ChatMessage[] = [
                {
                    id: createChatId("opening"),
                    role: "user",
                    text: openingText || "감정을 먼저 정리해봤어요.",
                },
                createTypingMessage(),
            ];

            setMessages(initialMessages);
            setHistory([]);

            try {
                const response = await requestLocalAiChat(apiKey, {
                    mode,
                    ticker,
                    emotion: answers.emotion!,
                    text: openingText || null,
                    turnNumber: 1,
                });

                if (cancelled) {
                    return;
                }

                const assistantMessage = {
                    id: createChatId("assistant-turn-1"),
                    role: "assistant" as const,
                    showAvatar: true,
                    text: buildAssistantMessageText(response),
                };

                setMessages([
                    initialMessages[0],
                    assistantMessage,
                ]);
                setHistory(appendAssistantHistory([], response));
                setLatestResponse(response);
                setDistortionTag(response.distortionTag);
                setTurnNumber(1);
            } catch (requestError) {
                if (cancelled) {
                    return;
                }

                setMessages(initialMessages.slice(0, 1));
                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : "AI 응답 생성에 실패했습니다.",
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        requestTurnOne();

        return () => {
            cancelled = true;
        };
    }, [answers.emotion, apiKey, mode, openingText, surveyType, ticker]);

    const headerCopy = useMemo(() => {
        if (loading && turnNumber === 1) {
            return {
                title: "입력한 마음을 읽고 있어요",
                description: "함께 볼 질문을 천천히 준비하고 있어요.",
            };
        }

        if (mode === "pre" && latestResponse?.required) {
            return {
                title: "마음의 패턴이 보여요",
                description: "정답은 없어요. 더 솔직하게 느껴지는 쪽이면 충분해요.",
            };
        }

        return {
            title:
                mode === "pre"
                    ? "지금 드는 마음부터 같이 볼게요"
                    : "이번 선택을 천천히 돌아볼게요",
            description:
                mode === "pre"
                    ? "판단보다 먼저, 지금 마음에서 시작해볼게요."
                    : "그때의 감정과 생각을 차분히 다시 짚어볼게요.",
        };
    }, [latestResponse?.required, loading, mode, turnNumber]);

    const handleTurnTwo = async (text: string | null) => {
        if (!apiKey || !answers.emotion || !latestResponse) {
            return;
        }

        setLoading(true);
        setError("");

        const nextMessages = [
            ...messages,
            ...(text
                ? [
                      {
                          id: createChatId("user-reply"),
                          role: "user" as const,
                          text,
                      },
                  ]
                : []),
            createTypingMessage(),
        ];

        setMessages(nextMessages);

        const nextHistory = [
            ...history,
            ...(text
                ? [
                      {
                          role: "user" as const,
                          content: text,
                      },
                  ]
                : []),
        ];

        try {
            const response = await requestLocalAiChat(apiKey, {
                mode,
                ticker,
                emotion: answers.emotion,
                text,
                turnNumber: 2,
                // 백엔드가 하던 왜곡 유형 주입을 클라이언트가 직접 대신한다.
                previousDistortionType: latestResponse.distortionType,
            });

            const assistantMessage = {
                id: createChatId("assistant-turn-2"),
                role: "assistant" as const,
                showAvatar: true,
                text: buildAssistantMessageText(response),
            };

            setMessages([
                ...nextMessages.filter((message) => message.role !== "typing"),
                assistantMessage,
            ]);
            setHistory(appendAssistantHistory(nextHistory, response));
            setLatestResponse(response);
            setDistortionTag(response.distortionTag);
            setTurnNumber(2);
        } catch (requestError) {
            setMessages(nextMessages.filter((message) => message.role !== "typing"));
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "AI 응답 생성에 실패했습니다.",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleMetaChoice = (index: number, label: string) => {
        const resultState: ChatResultState = {
            resultId: createChatId("result"),
            surveyType,
            mode,
            ticker,
            distortionTag,
            reflectionSummary: latestResponse?.reflectionSummary ?? "",
            selectedMetaOptionIndex: index,
            selectedMetaOption: label,
            metaOptions: latestResponse?.metaOptions ?? null,
        };

        navigate(`/chat/${surveyType}/result`, {
            state: resultState,
        });
    };

    const handlePostResult = () => {
        const resultState: ChatResultState = {
            resultId: createChatId("result"),
            surveyType,
            mode,
            ticker,
            distortionTag,
            reflectionSummary: latestResponse?.reflectionSummary ?? "",
        };

        navigate(`/chat/${surveyType}/result`, {
            state: resultState,
        });
    };

    return (
        <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-stone-50">
            <BottomGradientBackdrop className="pointer-events-none fixed left-1/2 top-[228px] z-0 h-[860px] w-[390px] -translate-x-1/2 overflow-hidden opacity-28" />

            <LocalChatHeader
                mode={mode}
                title={headerCopy.title}
                description={headerCopy.description}
                onBack={() => navigate(`/chat/${surveyType}/4`)}
            />

            {!apiKey ? (
                <div className="relative z-10">
                    <LocalApiKeyCard onSaved={setApiKey} />
                </div>
            ) : (
                <div className="relative z-10 flex min-h-0 flex-1 flex-col">
                    {distortionTag ? (
                        <LocalDistortionBanner
                            text={distortionTag}
                            type={latestResponse?.distortionType}
                        />
                    ) : null}

                    <LocalChatMessageList messages={messages} />

                    {error ? (
                        <div className="px-5 pb-3 text-sm text-red-500">
                            {error}
                        </div>
                    ) : null}

                    {mode === "pre" && turnNumber === 1 ? (
                        <LocalChatFooter
                            type="composer"
                            value={composerValue}
                            placeholder="편하게 적어주세요"
                            disabled={loading}
                            secondaryActionLabel="건너뛸게요"
                            onChange={setComposerValue}
                            onSubmit={() => {
                                if (!composerValue.trim()) {
                                    return;
                                }
                                const replyText = composerValue.trim();
                                setComposerValue("");
                                void handleTurnTwo(replyText);
                            }}
                            onSecondaryAction={() => {
                                void handleTurnTwo(null);
                            }}
                        />
                    ) : mode === "pre" && latestResponse?.required ? (
                        <LocalChatFooter
                            type="choices"
                            title={latestResponse.metaQuestion ?? "지금 필요한 선택"}
                            description="솔직하게 골라주세요. 틀린 답은 없어요."
                            choices={latestResponse.metaOptions ?? []}
                            onSelect={handleMetaChoice}
                        />
                    ) : mode === "post" && latestResponse?.reflectionSummary ? (
                        <LocalChatFooter
                            type="cta"
                            title="이제 결과를 확인할 수 있어요"
                            description="이번 복기 내용을 프론트에서 바로 이어서 정리할게요."
                            label="결과 보기"
                            onClick={handlePostResult}
                        />
                    ) : null}
                </div>
            )}
        </div>
    );
}

export default ChatConversation;
