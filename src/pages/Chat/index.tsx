import { NavLink } from "react-router-dom";

import { TypographyH1 } from "@/components/ui/Typography";

function Chat() {
    return (
        <>
            <header className="border-b border-stone-100 px-5 pb-4 pt-5">
                <span className="text-sm font-semibold tracking-widest text-stone-400">
                    TRADEMIND
                </span>
            </header>
            <main className="flex flex-1 flex-col px-5 pb-6 pt-8">
                <div className="flex justify-center">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-stone-100"></div>
                </div>
                <div className="mt-8 text-center">
                    <TypographyH1>
                        지금 어떤 이야기를 하고 싶으세요?
                    </TypographyH1>
                    <p className="mt-3 font-serif text-sm leading-6 text-stone-500">
                        종목 추천이 아니라, 지금 그 판단이
                        <br />
                        감정에서 온 건지 확인해보려는 흐름이에요.
                    </p>
                </div>
                <div className="mt-8 space-y-3">
                    <div className="w-full rounded-2xl border px-5 py-5 text-left transition-colors border-stone-900 bg-stone-800 text-white">
                        <NavLink to="/chat/pretrade-survey/1">
                            <p className="text-base font-semibold">
                                사고 싶거나 팔고 싶어요
                            </p>
                            <p className="mt-1 text-sm text-white/70">
                                매매 전 감정 살펴보기
                            </p>
                        </NavLink>
                    </div>
                    <div className="w-full rounded-2xl border px-5 py-5 text-left transition-colors border-stone-300 bg-stone-400 text-white">
                        <NavLink to="/chat/posttrade-survey/1">
                            <p className="text-base font-semibold">
                                이미 한 매매가 마음에 걸려요
                            </p>
                            <p className="mt-1 text-sm text-white/70">
                                매매 후 감정 기록
                            </p>
                        </NavLink>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Chat;
