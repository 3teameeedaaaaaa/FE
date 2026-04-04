import type { Dispatch, SetStateAction } from "react";

function SkippableTextInput({
    value,
    onChange,
    onNext,
}: {
    value: string;
    onChange: Dispatch<SetStateAction<number>>;
    onNext: () => void;
}) {
    return (
        <div className="px-4 pb-8 pt-3 border-t border-stone-100 bg-white">
            <div className="flex flex-col gap-3">
                {/* 입력창 */}
                <div className="w-full rounded-2xl bg-stone-100 px-4 py-3 flex items-center gap-2">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="편하게 적어주세요."
                        className="flex-1 bg-transparent text-sm text-stone-700 placeholder:text-stone-400 outline-none"
                    />
                    <button
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-400 hover:bg-stone-500 transition-colors"
                        onClick={onNext}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-white"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SkippableTextInput;
