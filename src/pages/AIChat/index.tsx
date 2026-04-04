// import { useEffect } from "react";

// import AiMsg from "@/components/aiChat/aiMessage/AiMsg";
// import MyMsg from "@/components/aiChat/myMessage/MyMsg";
// import BackButton from "@/components/backButton/backButton";
// import { TypographyH2 } from "@/components/ui/Typography";
// import { chatSession } from "@/service/survey/chatSession";

// // const CHOICES = [
// //     { label: "매수 근거가 바뀌었어요", isPrimary: true },
// //     { label: "감정 때문인 것 같아요", isPrimary: false },
// // ];

// function AIChat() {
//     // const handleSelect = (label: string) => {
//     //     console.log("선택:", label);
//     //     // zustand store dispatch or SSE message send 연결
//     // };

//     const handleResult = () => {
//         console.log("결과보기 클릭");
//         // 결과 페이지 이동 or zustand 액션 연결
//     };

//     // useEffect(() => {
//     //     const res = chatSession();
//     //     console.log(res);
//     // }, []);

//     return (
//         <div className="flex flex-col h-screen bg-white">
//             {/* 헤더 */}
//             <header className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-stone-100">
//                 <BackButton onClick={() => {}} />
//                 <TypographyH2>대화하기</TypographyH2>
//                 <button
//                     onClick={() => {}}
//                     className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-600 text-lg"
//                 >
//                     ✕
//                 </button>
//             </header>

//             {/* 상태 배너 */}
//             <div className="mx-4 mt-3 flex items-center justify-between px-4 py-2 bg-stone-100 rounded-full text-sm text-stone-500">
//                 <span>🍀 최악을 상상하고 있어요</span>
//                 <button className="text-stone-400">ⓘ</button>
//             </div>

//             {/* 메시지 영역 */}
//             <main className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-white">
//                 <AiMsg message="사용자님은 최악을 상상하는 [파국화] 상태에요." />
//                 <MyMsg message="3일 연속 하락이면 정말 불안하셨겠어요." />
//                 <AiMsg message="처음 이 종목을 매수했을 때의 근거, 예를 들면 실적이나 배당, 장기 보유 계획 같은 것들이 오늘도 여전히 유효한가요?" />
//             </main>

//             {/* <ChoiceInput
//                 title="지금 필요한 선택"
//                 subtitle="솔직하게 골라주세요. 틀린 답은 없어요."
//                 choices={CHOICES}
//                 onSelect={handleSelect}
//             /> */}
//             {/* <ResultFooter
//                 description="기록을 저장하고 나면 결과를 바로 확인할 수 있어요."
//                 buttonLabel="결과보기"
//                 onClickResult={handleResult}
//             /> */}
//         </div>
//     );
// }

// export default AIChat;

import { useEffect, useMemo, useState } from "react";

import AiMsg from "@/components/aiChat/aiMessage/AiMsg";
import ChoiceInput from "@/components/aiChat/choiceInput.tsx/ChoiceInput";
import MyMsg from "@/components/aiChat/myMessage/MyMsg";
import ResultFooter from "@/components/aiChat/resultFooter/ResultFooter";
import SkippableTextInput from "@/components/aiChat/skippableTextInput/SkippableTextInput";
import BackButton from "@/components/backButton/backButton";
import { TypographyH2 } from "@/components/ui/Typography";
const SESSION_KEY = "survey";

function AIChat() {
    const [payload, setPayload] = useState<any>(null);

    // PRE / POST
    const mode: "PRE" | "POST" = useMemo(() => {
        if (!payload) return "POST";
        return payload.mode === "PRE" ? "PRE" : "POST";
    }, [payload]);

    // turn 상태
    const [turn, setTurn] = useState(1);

    // 사용자 입력
    const [input, setInput] = useState("");
    const [myMessages, setMyMessages] = useState<string[]>([]);

    useEffect(() => {
        const stored = sessionStorage.getItem(SESSION_KEY);
        if (stored) {
            setPayload(JSON.parse(stored));
        }
    }, []);

    // AI 가상 응답
    const getAiMessage = (step: number) => {
        if (mode === "POST") {
            return "현재 감정과 생각을 정리해볼까요?";
        }

        if (step === 1) {
            return "지금 상황을 조금 더 이야기해볼까요?";
        }

        return "선택지를 통해 생각을 정리해보세요.";
    };

    // NEXT 로직
    const handleNext = () => {
        if (mode === "POST") {
            if (turn === 1) {
                setMyMessages((prev) => [...prev, input]);
                setInput("");
                setTurn(2); // result
                return;
            }
            return;
        }

        // PRE
        if (turn === 1) {
            setMyMessages((prev) => [...prev, input]);
            setInput("");
            setTurn(2); // choice input
            return;
        }

        if (turn === 2) {
            setTurn(3); // result
        }
    };

    const handleResult = () => {
        console.log("결과보기");
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* HEADER */}
            <header className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-stone-100">
                <BackButton onClick={() => {}} />
                <TypographyH2>대화하기</TypographyH2>
                <button className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-600 text-lg">
                    ✕
                </button>
            </header>

            {/* 상태 */}
            <div className="mx-4 mt-3 flex items-center justify-between px-4 py-2 bg-stone-100 rounded-full text-sm text-stone-500">
                <span>🍀 상태 분석 중</span>
            </div>

            {/* 메시지 영역 */}
            <main className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                <AiMsg message="사용자님의 감정 상태를 분석 중입니다." />

                {myMessages.map((msg, idx) => (
                    <MyMsg key={idx} message={msg} />
                ))}

                {turn < 3 && <AiMsg message={getAiMessage(turn)} />}
            </main>

            {/* ========================= */}
            {/* POST FLOW */}
            {/* ========================= */}
            {mode === "POST" && turn === 1 && (
                <SkippableTextInput
                    value={input}
                    onChange={setInput}
                    onNext={handleNext}
                />
            )}

            {mode === "POST" && turn === 2 && (
                <ResultFooter
                    description="기록을 저장하고 결과를 확인할 수 있어요."
                    buttonLabel="결과보기"
                    onClickResult={handleResult}
                />
            )}

            {/* ========================= */}
            {/* PRE FLOW */}
            {/* ========================= */}
            {mode === "PRE" && turn === 1 && (
                <SkippableTextInput
                    value={input}
                    onChange={setInput}
                    onNext={handleNext}
                />
            )}

            {mode === "PRE" && turn === 2 && (
                <ChoiceInput
                    title="지금 필요한 선택"
                    subtitle="솔직하게 골라주세요."
                    choices={[
                        { label: "매수 근거가 바뀌었어요", isPrimary: true },
                        { label: "감정 때문인 것 같아요", isPrimary: false },
                    ]}
                    onSelect={(label: string) => {
                        console.log("choice:", label);
                        setTurn(3);
                    }}
                />
            )}

            {mode === "PRE" && turn === 3 && (
                <ResultFooter
                    description="기록을 저장하고 결과를 확인할 수 있어요."
                    buttonLabel="결과보기"
                    onClickResult={handleResult}
                />
            )}
        </div>
    );
}

export default AIChat;
