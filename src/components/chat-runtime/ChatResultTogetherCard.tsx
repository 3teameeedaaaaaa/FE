interface ChatResultLegendItem {
    label: string;
    value: number;
    dotClassName: string;
}

interface ChatResultTogetherCardProps {
    percent: number;
    centerLabel: string;
    legends: ChatResultLegendItem[];
    examples: string[];
}

function ResultDonut({
    percent,
    label,
}: {
    percent: number;
    label: string;
}) {
    const angle = `${percent * 3.6}deg`;

    return (
        <div className="relative h-[180px] w-[180px]">
            <div
                className="absolute inset-0 rounded-full"
                style={{
                    background: `conic-gradient(#1c1917 0deg ${angle}, #e7e5e4 ${angle} 360deg)`,
                }}
            />
            <div className="absolute inset-[20px] rounded-full bg-white" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
                <p className="text-[30px] leading-10 font-bold text-[#1A1A1A]">
                    {percent}%
                </p>
                <p className="text-xs leading-4 font-medium text-stone-500">{label}</p>
            </div>
        </div>
    );
}

function ChatResultTogetherCard({
    percent,
    centerLabel,
    legends,
    examples,
}: ChatResultTogetherCardProps) {
    return (
        <section className="rounded-[28px] border border-stone-200 bg-white px-5 py-6 text-left">
            <p className="text-base leading-6 font-bold text-slate-900">TOGETHER 데이터</p>

            <div className="mt-6 flex flex-col items-center gap-8">
                <div className="flex flex-col items-center gap-3">
                    <ResultDonut percent={percent} label={centerLabel} />

                    <div className="flex items-center justify-center gap-[51px]">
                        {legends.map((legend) => (
                            <div key={legend.label} className="min-w-[56px] space-y-[3px]">
                                <div className="flex items-center gap-1.5">
                                    <div
                                        className={`h-2.5 w-2.5 rounded-full ${legend.dotClassName}`}
                                    />
                                    <p className="text-sm leading-5 font-bold text-stone-950">
                                        {legend.value}%
                                    </p>
                                </div>
                                <p className="text-xs leading-4 font-medium text-stone-500">
                                    {legend.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full space-y-3">
                    <p className="text-sm leading-5 font-bold text-stone-950">
                        비슷한 상황에서의 선택들
                    </p>

                    <div className="space-y-2.5">
                        {examples.map((example) => (
                            <div
                                key={example}
                                className="rounded-3xl bg-slate-50 px-4 py-4"
                            >
                                <p className="font-serif text-sm leading-6 text-stone-600">
                                    {example}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ChatResultTogetherCard;
