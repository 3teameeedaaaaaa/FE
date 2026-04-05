import { useEffect, useRef } from "react";

import type { ChatMessage } from "@/type/aiChat";

import LocalChatMessageBubble from "./LocalChatMessageBubble";

function LocalChatMessageList({ messages }: { messages: ChatMessage[] }) {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const latestAiMessageIndex = [...messages]
        .map((message, index) => ({
            message,
            index,
        }))
        .filter(({ message }) => message.role === "assistant" || message.role === "typing")
        .at(-1)?.index;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <div className="flex min-h-full flex-col justify-end gap-3">
                {messages.map((message, index) => (
                    <LocalChatMessageBubble
                        key={message.id}
                        message={message}
                        showAura={index === latestAiMessageIndex}
                    />
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}

export default LocalChatMessageList;
