import { LockKeyhole, UserRound, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import trademindLogo from "@/assets/login/trademind-logo.svg";
import LoginInput from "@/components/login/LoginInput";
import { login } from "@/service/auth/login";
import { useAuthStore } from "@/store/auth/AuthStore";

function Login() {
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const validation = Boolean(loginId && password);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validation) {
            return;
        }

        setLoading(true);
        try {
            const res = await login({
                loginId,
                password,
            });
            useAuthStore.getState().setUser(res);
            console.log(res);
            navigate("/");
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        navigate("/", { replace: true });
    };

    return (
        <main
            className="relative flex min-h-screen flex-1 flex-col overflow-hidden px-5 pb-10 pt-[18px]"
            style={{
                background:
                    "linear-gradient(180deg, var(--login-gradient-top) 0%, var(--login-gradient-middle) 54%, var(--login-gradient-bottom) 100%)",
            }}
        >
            <div className="pointer-events-none absolute inset-0">
                {/* 피그마 하단의 따뜻한 광원 느낌을 배경 레이어로 분리한다. */}
                <div
                    className="absolute inset-x-[-8%] bottom-[-12%] h-[48%] rounded-full blur-3xl"
                    style={{ background: "var(--login-glow)" }}
                />
            </div>

            <div className="relative z-10 flex justify-end">
                <button
                    type="button"
                    onClick={handleClose}
                    aria-label="닫기"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--login-close-border)] bg-[var(--login-close-bg)] text-stone-800 backdrop-blur-md transition-colors hover:bg-white/60"
                >
                    <X className="h-4 w-4" strokeWidth={2.1} />
                </button>
            </div>

            <section className="relative z-10 flex flex-1 flex-col items-center">
                <div className="pt-24 text-center">
                    {/* 피그마 워드마크를 텍스트 근사치 대신 실제 asset으로 노출한다. */}
                    <img
                        src={trademindLogo}
                        alt="TRADEMIND"
                        className="mx-auto h-auto w-[308px] max-w-full"
                    />
                    <p className="pt-2 text-base font-medium text-[var(--login-subtitle)]">
                        선택보다 먼저, 마음을 살피는 연습
                    </p>
                </div>

                <form
                    className="mt-[10.5rem] w-full max-w-[350px] space-y-4"
                    onSubmit={handleLogin}
                >
                    <LoginInput
                        id="loginId"
                        type="text"
                        autoComplete="username"
                        placeholder="아이디를 입력해주세요"
                        iconComponent={UserRound}
                        label="아이디"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        hideLabel
                        wrapperClassName="h-14 rounded-2xl border-[var(--login-input-border)] bg-[var(--login-input-bg)] px-3.5 shadow-[0_6px_18px_rgba(255,255,255,0.16)]"
                        inputClassName="text-base font-medium text-stone-800 placeholder:text-[var(--login-placeholder)]"
                        iconClassName="text-[var(--login-placeholder)]"
                    />
                    <LoginInput
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="비밀번호를 입력해주세요"
                        iconComponent={LockKeyhole}
                        label="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        hideLabel
                        wrapperClassName="h-14 rounded-2xl border-[var(--login-input-border)] bg-[var(--login-input-bg)] px-3.5 shadow-[0_6px_18px_rgba(255,255,255,0.16)]"
                        inputClassName="text-base font-medium text-stone-800 placeholder:text-[var(--login-placeholder)]"
                        iconClassName="text-[var(--login-placeholder)]"
                    />

                    <button
                        type="submit"
                        className="mt-5 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[var(--login-button-bg)] px-4 text-base font-bold text-[var(--login-button-text)] transition-transform duration-200 hover:translate-y-[-1px] hover:bg-black/95 disabled:pointer-events-none disabled:opacity-50"
                        disabled={!validation || loading}
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </button>

                    <p className="pt-1 text-center text-sm font-semibold text-[var(--login-helper)]">
                        처음이신가요?{" "}
                        <NavLink
                            to="/sign-up"
                            className="font-bold text-[var(--login-link)] underline underline-offset-2"
                        >
                            회원가입
                        </NavLink>
                    </p>
                </form>
            </section>
        </main>
    );
}

export default Login;
