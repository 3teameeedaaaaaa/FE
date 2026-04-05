import { useState } from "react";

import {
    getStoredOpenAiApiKey,
    setStoredOpenAiApiKey,
} from "@/service/ai/localAiClient";

function LocalApiKeyCard({
    onSaved,
}: {
    onSaved: (apiKey: string) => void;
}) {
    const [value, setValue] = useState(getStoredOpenAiApiKey());

    return (
        <div className="mx-5 mt-5 rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_8px_24px_rgba(28,25,23,0.04)]">
            <div className="space-y-2 text-left">
                <h2 className="text-base font-semibold text-stone-950">
                    로컬 OpenAI 키가 필요해요
                </h2>
                <p className="text-sm leading-6 text-stone-500">
                    이 모드는 브라우저에서 OpenAI를 직접 호출합니다. 키는
                    이 기기의 로컬 저장소에만 저장되고, 서버에는 남지 않습니다.
                </p>
            </div>

            <div className="mt-4 space-y-3">
                <input
                    type="password"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder="sk-..."
                    className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-900 outline-none transition focus:border-stone-400"
                />

                <button
                    type="button"
                    onClick={() => {
                        setStoredOpenAiApiKey(value);
                        onSaved(value.trim());
                    }}
                    className="h-12 w-full rounded-2xl bg-stone-900 text-sm font-bold text-white transition-colors hover:bg-stone-800"
                >
                    로컬 키 저장하고 시작하기
                </button>
            </div>
        </div>
    );
}

export default LocalApiKeyCard;
