import ChatModeCard from "@/components/chat/ChatModeCard";
import AppTopBar from "@/components/common/AppTopBar";
import AiAuraIndicator from "@/components/ui/AiAuraIndicator";
import BottomGradientBackdrop from "@/components/ui/BottomGradientBackdrop";

function Chat() {
    return (
        <div className="flex min-h-full flex-1 flex-col bg-stone-50">
            <AppTopBar sticky={false} />

            <main className="relative flex flex-1 justify-center overflow-hidden">
                <div className="relative min-h-[742px] w-full max-w-[390px] flex-1 overflow-hidden">
                    <BottomGradientBackdrop className="pointer-events-none absolute left-0 top-[353px] h-[772px] w-[390px] overflow-hidden" />

                    <div className="absolute left-1/2 top-[111px] flex w-[330px] -translate-x-1/2 flex-col items-center gap-5">
                        <div className="relative -translate-y-2 flex h-[120px] w-[120px] items-center justify-center">
                            <AiAuraIndicator
                                size={1.2}
                                variant="light"
                                className="drop-shadow-[0_0_50px_rgba(255,158,122,0.2)]"
                            />
                        </div>

                        <h1 className="text-center text-2xl font-extrabold leading-9 text-[#1a1a1a]">
                            지금 어떤 이야기를
                            <br />
                            하고 싶으세요?
                        </h1>
                    </div>

                    <p className="absolute left-1/2 top-[350px] w-[320px] -translate-x-1/2 text-center font-serif text-sm leading-6 text-stone-500">
                        종목 추천이 아니라, 지금 그 판단이
                        <br />
                        감정에서 온 건지 확인해보려는 흐름이에요.
                    </p>

                    <div className="absolute left-5 top-[480px] w-[350px] space-y-4">
                        <ChatModeCard
                            to="/chat/pretrade-survey/1"
                            label="사고 싶거나, 팔고 싶어요"
                        />
                        <ChatModeCard
                            to="/chat/posttrade-survey/1"
                            label="이미 한 매매가 마음에 걸려요"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Chat;
