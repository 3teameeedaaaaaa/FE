import { AnimatePresence, motion } from "framer-motion";

import AiAuraIndicator from "@/components/ui/AiAuraIndicator";
import { useAuthStore } from "@/store/auth/AuthStore";
import type { ChatMessage } from "@/type/aiChat";

function AIAura({
    visible,
}: {
    visible: boolean;
}) {
    return (
        <div className="flex h-8 w-8 shrink-0 items-end justify-center">
            <AnimatePresence mode="wait" initial={false}>
                {visible ? (
                    <motion.div
                        key="aura"
                        initial={{ opacity: 0, scale: 0.82, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.68, y: -10 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        className="flex h-8 w-8 items-center justify-center overflow-visible"
                    >
                        <div className="flex h-[100px] w-[100px] scale-[0.32] items-center justify-center">
                            <AiAuraIndicator
                                size={1}
                                variant="light"
                                className="drop-shadow-[0_4px_14px_rgba(123,157,242,0.18)]"
                            />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="spacer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="h-8 w-8"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function UserAvatar() {
    const nickname = useAuthStore((state) => state.user?.nickname?.trim() ?? "");
    const initial = nickname ? nickname.slice(0, 1).toUpperCase() : "나";

    return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-300 text-[12px] leading-none font-bold text-white">
            {initial}
        </div>
    );
}

function TypingDots() {
    return (
        <div className="flex gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:300ms]" />
        </div>
    );
}

function LocalChatMessageBubble({
    message,
    showAura,
}: {
    message: ChatMessage;
    showAura?: boolean;
}) {
    if (message.role === "typing") {
        return (
            <div className="flex items-end gap-2">
                <AIAura visible={Boolean(showAura)} />
                <div className="rounded-2xl rounded-bl-md border border-stone-200 bg-white px-4 py-3">
                    <TypingDots />
                </div>
            </div>
        );
    }

    if (message.role === "user") {
        return (
            <div className="flex items-end justify-end gap-2">
                <div className="max-w-[268px] rounded-2xl rounded-br-md bg-stone-700 px-4 py-3">
                    <p className="whitespace-pre-line text-sm leading-6 text-white">
                        {message.text}
                    </p>
                </div>
                <UserAvatar />
            </div>
        );
    }

    return (
        <div className="flex items-end gap-2">
            <AIAura visible={Boolean(showAura && message.showAvatar !== false)} />
            <div className="max-w-[268px] rounded-2xl rounded-bl-md border border-stone-200 bg-white px-4 py-3">
                <p className="whitespace-pre-line font-serif text-sm leading-6 text-stone-800">
                    {message.text}
                </p>
            </div>
        </div>
    );
}

export default LocalChatMessageBubble;
