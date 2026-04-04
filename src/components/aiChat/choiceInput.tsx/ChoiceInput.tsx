interface Choice {
    label: string;
    isPrimary?: boolean;
}

interface ChoiceInputProps {
    title?: string;
    subtitle?: string;
    choices: Choice[];
    onSelect: (label: string) => void;
}

function ChoiceInput({
    title = "지금 필요한 선택",
    subtitle = "솔직하게 골라주세요. 틀린 답은 없어요.",
    choices,
    onSelect,
}: ChoiceInputProps) {
    return (
        <div className="px-4 pt-4 pb-8 bg-white border-t border-stone-100">
            {/* 안내 텍스트 */}
            <div className="mb-3">
                <p className="text-sm font-semibold text-stone-800">{title}</p>
                <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>
            </div>

            {/* 선택지 버튼 목록 */}
            <div className="flex flex-col gap-2">
                {choices.map((choice) => (
                    <button
                        key={choice.label}
                        onClick={() => onSelect(choice.label)}
                        className={`w-full py-4 rounded-2xl text-sm font-medium transition-colors
              ${
                  choice.isPrimary
                      ? "bg-stone-800 text-white hover:bg-stone-700"
                      : "bg-stone-100 text-stone-400 hover:bg-stone-200"
              }`}
                    >
                        {choice.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ChoiceInput;
