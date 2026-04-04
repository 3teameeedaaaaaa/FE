import { useEffect } from "react";

import AiMsg from "@/components/aiChat/aiMessage/AiMsg";
import MyMsg from "@/components/aiChat/myMessage/MyMsg";
import BackButton from "@/components/backButton/backButton";
import { TypographyH2 } from "@/components/ui/Typography";
import { chatSession } from "@/service/survey/chatSession";

// const CHOICES = [
//     { label: "매수 근거가 바뀌었어요", isPrimary: true },
//     { label: "감정 때문인 것 같아요", isPrimary: false },
// ];

function AIChat() {
    // const handleSelect = (label: string) => {
    //     console.log("선택:", label);
    //     // zustand store dispatch or SSE message send 연결
    // };

    const handleResult = () => {
        console.log("결과보기 클릭");
        // 결과 페이지 이동 or zustand 액션 연결
    };

    useEffect(() => {
        const res = chatSession();
        console.log(res);
    }, []);

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* 헤더 */}
            <header className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-stone-100">
                <BackButton onClick={() => {}} />
                <TypographyH2>대화하기</TypographyH2>
                <button
                    onClick={() => {}}
                    className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-600 text-lg"
                >
                    ✕
                </button>
            </header>

            {/* 상태 배너 */}
            <div className="mx-4 mt-3 flex items-center justify-between px-4 py-2 bg-stone-100 rounded-full text-sm text-stone-500">
                <span>🍀 최악을 상상하고 있어요</span>
                <button className="text-stone-400">ⓘ</button>
            </div>

            {/* 메시지 영역 */}
            <main className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-white">
                <AiMsg message="사용자님은 최악을 상상하는 [파국화] 상태에요." />
                <MyMsg message="3일 연속 하락이면 정말 불안하셨겠어요." />
                <AiMsg message="처음 이 종목을 매수했을 때의 근거, 예를 들면 실적이나 배당, 장기 보유 계획 같은 것들이 오늘도 여전히 유효한가요?" />
            </main>

            {/* <ChoiceInput
                title="지금 필요한 선택"
                subtitle="솔직하게 골라주세요. 틀린 답은 없어요."
                choices={CHOICES}
                onSelect={handleSelect}
            /> */}
            {/* <ResultFooter
                description="기록을 저장하고 나면 결과를 바로 확인할 수 있어요."
                buttonLabel="결과보기"
                onClickResult={handleResult}
            /> */}
        </div>
    );
}

export default AIChat;
