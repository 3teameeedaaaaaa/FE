import { motion } from "framer-motion";

import type { DistortionType } from "@/type/aiChat";

const DISTORTION_LABEL_BY_TYPE: Record<DistortionType, string> = {
    catastrophizing: "🌪️ 최악을 상상하고 있어요",
    all_or_nothing: "⚡ 지금 아니면 안된다는 생각",
    emotional_reasoning: "😵‍💫 감정이 판단을 이끌고 있어요",
    confirmation_bias: "🧐 보고 싶은 것만 보이고 있어요",
    fomo_herd: "🏃‍♂️ 나만 뒤쳐질 것 같은 느낌",
    illusion_of_control: "🕹️ 내가 컨트롤 할 수 있다는 믿음",
    anchoring_bias: "📌 처음 본 가격에 묶여 있어요",
    sunk_cost: "🧱 지금 까지 한게 아까운 마음",
};

function LocalDistortionBanner({
    text,
    type,
}: {
    text: string;
    type?: DistortionType;
}) {
    const resolvedText = type ? DISTORTION_LABEL_BY_TYPE[type] : text;

    return (
        <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.92 }}
            animate={{
                opacity: [0, 1, 1],
                y: [36, -4, 0],
                scale: [0.92, 1.015, 1],
            }}
            transition={{
                duration: 0.88,
                ease: [0.22, 1, 0.36, 1],
                times: [0, 0.78, 1],
            }}
            className="shrink-0 border-b border-stone-100 bg-white px-5 py-2"
        >
            <div className="flex h-11 w-full items-center justify-center rounded-xl bg-[rgba(117,159,239,0.16)] px-4 text-center shadow-[0_8px_24px_rgba(123,157,242,0.08)]">
                <p className="text-base leading-6 font-medium text-slate-900">
                    {resolvedText}
                </p>
            </div>
        </motion.div>
    );
}

export default LocalDistortionBanner;
