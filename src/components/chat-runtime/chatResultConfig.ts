import type { ChatMode } from "@/type/aiChat";

export interface ChatResultConfig {
    headerLabel: string;
    headerTitle: string;
    headerDotClassName: string;
    summaryTitle: string;
    donutPercent: number;
    donutCenterLabel: string;
    legends: Array<{
        label: string;
        value: number;
        dotClassName: string;
    }>;
    examples: string[];
    footerHelper: string;
    primaryButtonLabel: string;
    secondaryButtonLabel?: string;
}

const CHAT_RESULT_CONFIG: Record<ChatMode, ChatResultConfig> = {
    pre: {
        headerLabel: "매매전 점검 결과",
        headerTitle: "지금 판단을 한번 더 살펴봤어요.",
        headerDotClassName: "bg-[#F3A891]",
        summaryTitle: "지금 마음을 이렇게 읽었어요",
        donutPercent: 75,
        donutCenterLabel: "잠시 관망",
        legends: [
            {
                label: "잠시 관망",
                value: 75,
                dotClassName: "bg-stone-900",
            },
            {
                label: "그래도 진행",
                value: 25,
                dotClassName: "bg-stone-200",
            },
        ],
        examples: [
            "손절하고 나서 다음 날 반등한 적이 있어서, 원칙부터 다시 확인했어요.",
            "불안이 클수록 차트보다 처음 세운 근거를 먼저 다시 읽어봤어요.",
        ],
        footerHelper: "지금 마음을 여기까지 함께 정리했어요.",
        primaryButtonLabel: "홈으로 가기",
    },
    post: {
        headerLabel: "매매 돌아보기 결과",
        headerTitle: "이번 기록을 다음번 판단에 남겨둘게요.",
        headerDotClassName: "bg-[#759FEF]",
        summaryTitle: "이번 기록에서 이런 흐름이 있었어요",
        donutPercent: 89,
        donutCenterLabel: "잠시 관망",
        legends: [
            {
                label: "사후 후회 경험",
                value: 89,
                dotClassName: "bg-stone-900",
            },
            {
                label: "비슷한 패턴 재발",
                value: 21,
                dotClassName: "bg-stone-200",
            },
        ],
        examples: [
            "급등장에서 산 건 거의 다 비슷한 이유였고, 기록해두니 패턴이 보였어요.",
            "근거보다 놓치기 싫은 마음이 앞섰던 날들이 반복됐다는 걸 나중에 알았어요.",
        ],
        footerHelper: "이번 마음의 흐름도 여기까지 정리됐어요.",
        primaryButtonLabel: "홈으로 가기",
    },
};

export function getChatResultConfig(mode: ChatMode) {
    return CHAT_RESULT_CONFIG[mode];
}
