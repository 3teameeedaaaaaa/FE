interface ActionButtonsProps {
    canGoBack: boolean;
    isLastStep: boolean;
    disabled?: boolean;
    submitLabel?: string;
    onBack: () => void;
    onNext: () => void;
}

function ActionButtons({
    canGoBack,
    isLastStep,
    disabled = false,
    submitLabel,
    onBack,
    onNext,
}: ActionButtonsProps) {
    return (
        <div className="flex gap-3">
            {canGoBack ? (
                <button
                    type="button"
                    onClick={onBack}
                    className="h-14 flex-1 rounded-2xl border border-stone-200 bg-white text-base font-semibold text-stone-700 transition-colors hover:bg-stone-50"
                >
                    이전
                </button>
            ) : null}

            <button
                type="button"
                onClick={onNext}
                disabled={disabled}
                className="h-14 flex-1 rounded-2xl bg-stone-900 text-base font-bold text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
                {isLastStep ? submitLabel ?? "완료" : "다음"}
            </button>
        </div>
    );
}

export default ActionButtons;
