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
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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
            className="relative flex min-h-screen min-h-svh flex-1 flex-col overflow-y-auto px-5 py-4"
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

            <section className="relative z-10 mx-auto flex w-full max-w-[350px] flex-1 flex-col">
                <div className="text-center">
                    {/* 피그마 워드마크를 텍스트 근사치 대신 실제 asset으로 노출한다. */}
                    <img
                        src={trademindLogo}
                        alt="TRADEMIND"
                        className="mx-auto mt-24 h-auto w-[308px] max-w-full"
                    />
                    <p className="pt-2 text-base leading-6 font-semibold text-[var(--login-subtitle)]">
                        선택보다 먼저, 마음을 살피는 연습
                    </p>
                </div>

                {/* 남는 높이를 위아래로 분배해서 짧은 화면과 긴 화면 모두에서 간격이 자연스럽게 반응하도록 한다. */}
                <div className="min-h-20 flex-1" />

                <form
                    className="w-full space-y-4"
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
                        wrapperClassName="h-14 rounded-2xl border-[var(--login-input-border)] bg-[var(--login-input-bg)] px-3.5 shadow-[0_6px_18px_rgba(255,255,255,0.16)] transition-[border-color,box-shadow,background-color] focus-within:border-[var(--login-link)]/25 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(45,34,36,0.08),0_12px_28px_rgba(255,255,255,0.24)]"
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
                        wrapperClassName="h-14 rounded-2xl border-[var(--login-input-border)] bg-[var(--login-input-bg)] px-3.5 shadow-[0_6px_18px_rgba(255,255,255,0.16)] transition-[border-color,box-shadow,background-color] focus-within:border-[var(--login-link)]/25 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(45,34,36,0.08),0_12px_28px_rgba(255,255,255,0.24)]"
                        inputClassName="text-base font-medium text-stone-800 placeholder:text-[var(--login-placeholder)]"
                        iconClassName="text-[var(--login-placeholder)]"
                    />

                    <button
                        type="submit"
                        className="login-submit-text mt-5 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[var(--login-button-bg)] px-4 text-base text-[var(--login-button-text)] transition-transform duration-200 hover:translate-y-[-1px] hover:bg-black/95 disabled:pointer-events-none disabled:opacity-50"
                        disabled={loading}
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

                <div className="min-h-6 flex-1" />
            </section>
        </main>
    );
}

export default Login;
