import { Link } from "react-router-dom";

interface ChatModeCardProps {
    to: string;
    label: string;
}

function ChatModeCard({ to, label }: ChatModeCardProps) {
    return (
        <Link
            to={to}
            className="flex h-14 items-center justify-center rounded-2xl bg-white px-6 text-center shadow-[0_8px_32px_rgba(176,107,255,0.12)] transition-transform duration-200 hover:translate-y-[-1px]"
        >
            <span className="text-base font-bold text-stone-800">{label}</span>
        </Link>
    );
}

export default ChatModeCard;
