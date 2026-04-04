import { UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import trademindLogo from "@/assets/login/trademind-logo.svg";
import { useAuthStore } from "@/store/auth/AuthStore";

function ChatHeader() {
    const user = useAuthStore((state) => state.user);

    return (
        <header className="bg-white px-5 pb-5 pt-6">
            <div className="flex items-center justify-between">
                <img
                    src={trademindLogo}
                    alt="TRADEMIND"
                    className="h-auto w-36"
                />

                {!user ? (
                    <Link
                        to="/login"
                        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#fce1d9] bg-white px-3 text-sm font-semibold text-stone-800 transition-colors hover:bg-stone-50"
                    >
                        <UserRound className="h-4 w-4 text-stone-700" />
                        로그인
                    </Link>
                ) : null}
            </div>
        </header>
    );
}

export default ChatHeader;
