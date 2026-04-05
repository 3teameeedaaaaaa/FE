import { X } from "lucide-react";

interface ChatResultHeaderProps {
    label: string;
    title: string;
    dotClassName: string;
    onClose: () => void;
}

function ChatResultHeader({
    label,
    title,
    dotClassName,
    onClose,
}: ChatResultHeaderProps) {
    return (
        <header className="sticky top-0 z-20 shrink-0 border-b border-stone-200 bg-white/96 backdrop-blur-sm">
            <div className="px-4 pb-5 pt-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${dotClassName}`} />
                        <p className="text-sm leading-5 font-extrabold text-stone-900">
                            {label}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-white/70 text-stone-800 transition-colors hover:bg-stone-50"
                        aria-label="닫기"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <h1 className="mt-4 text-left text-[20px] leading-8 font-normal text-[#4A4A4A]">
                    {title}
                </h1>
            </div>
        </header>
    );
}

export default ChatResultHeader;
