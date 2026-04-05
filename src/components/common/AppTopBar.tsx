import { UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import trademindLogo from "@/assets/login/trademind-logo.svg";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth/AuthStore";

interface AppTopBarProps {
    sticky?: boolean;
    className?: string;
}

function AppTopBar({
    sticky = true,
    className,
}: AppTopBarProps) {
    const user = useAuthStore((state) => state.user);
    const scrolled = useScrolled();

    return (
        <header
            className={cn(
                "z-20 bg-white px-5 pb-5 pt-6",
                sticky && "sticky top-0",
                sticky && scrolled
                    ? "border-b border-stone-100/80 bg-white/80 shadow-[0_1px_8px_rgba(28,25,23,0.04)] backdrop-blur-md"
                    : "bg-white",
                className,
            )}
        >
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

export default AppTopBar;
