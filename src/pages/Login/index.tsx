import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import emailIcon from "@/assets/login/email-ico.webp";
import passwordIcon from "@/assets/login/password-ico.webp";
import BackButton from "@/components/backButton/backButton";
import LoginInput from "@/components/login/LoginInput";
import { TypographyH2 } from "@/components/ui/Typography";
import { login } from "@/service/auth/login";
import { useAuthStore } from "@/store/auth/AuthStore";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const validation = email && password;
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!validation) {
            return;
        }

        setLoading(true);
        try {
            const res = await login({
                loginId: email,
                hashedPassword: password,
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

    return (
        <>
            <header className="flex items-center gap-3 border-b border-stone-200 px-5 pb-4 pt-5">
                <BackButton onClick={() => {}} />
                <div>
                    <p className="text-sm font-medium text-stone-500">계정</p>
                    <TypographyH2>로그인</TypographyH2>
                </div>
            </header>
            <main className="min-h-0 flex-1 overflow-y-auto bg-stone-50 px-5 py-5">
                <form className="space-y-5 rounded-[28px] border border-stone-200 bg-white p-5">
                    <LoginInput
                        key="email"
                        id="email"
                        placeholder="name@example.com"
                        icon={emailIcon}
                        label="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <LoginInput
                        key="password"
                        id="password"
                        placeholder="비밀번호를 입력해 주세요"
                        icon={passwordIcon}
                        label="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background px-4 py-2 h-12 w-full rounded-2xl bg-stone-900 text-white hover:bg-stone-900/95"
                        onClick={handleLogin}
                        disabled={!validation || loading}
                    >
                        로그인
                    </button>
                    <p>
                        처음이신가요? <NavLink to="/sign-up">회원가입</NavLink>
                    </p>
                </form>
            </main>
        </>
    );
}

export default Login;
