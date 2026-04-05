import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import type { ChatMode } from "@/type/aiChat";

function LocalChatHeader({
    title,
    onBack,
}: {
    mode: ChatMode;
    title: string;
    description: string;
    onBack: () => void;
}) {
    return (
        <header className="shrink-0 border-b border-stone-200 bg-white px-4 py-3">
            <div className="grid grid-cols-[40px_1fr_40px] items-center">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-800 transition-colors hover:bg-stone-100"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>

                <div className="px-2 text-center">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.p
                            key={title}
                            initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                            transition={{
                                duration: 0.42,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="truncate text-sm leading-5 font-semibold text-stone-900"
                        >
                            {title}
                        </motion.p>
                    </AnimatePresence>
                </div>

                <div />
            </div>
        </header>
    );
}

export default LocalChatHeader;
