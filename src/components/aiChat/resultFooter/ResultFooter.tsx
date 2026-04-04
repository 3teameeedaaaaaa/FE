interface ResultFooterProps {
    description?: string;
    buttonLabel?: string;
    onClickResult?: () => void;
}

function ResultFooter({
    description = "기록을 저장하고 나면 결과를 바로 확인할 수 있어요.",
    buttonLabel = "결과보기",
    onClickResult,
}: ResultFooterProps) {
    return (
        <div className="px-4 pt-3 pb-8 bg-white border-t border-stone-100 flex flex-col gap-3">
            {/* 안내 문구 */}
            <p className="text-center text-xs text-stone-400">{description}</p>

            {/* 결과보기 버튼 */}
            <button
                onClick={onClickResult}
                className="w-full py-4 rounded-2xl bg-stone-800 text-white text-sm font-semibold hover:bg-stone-700 active:bg-stone-900 transition-colors"
            >
                {buttonLabel}
            </button>
        </div>
    );
}

export default ResultFooter;
