interface ChatResultSummaryCardProps {
    tag: string;
    ticker?: string | null;
    title: string;
    summary: string;
}

function ChatResultSummaryCard({
    tag,
    ticker,
    title,
    summary,
}: ChatResultSummaryCardProps) {
    return (
        <section className="rounded-[28px] border border-stone-200 bg-white px-5 py-[26px] text-left">
            <div className="inline-flex h-7 items-center rounded-full bg-slate-100 px-3">
                <p className="text-sm leading-4 font-medium text-slate-700">{tag}</p>
            </div>

            <div className="mt-3 space-y-[7px]">
                {ticker ? (
                    <p className="text-sm leading-5 font-semibold text-stone-500">
                        종목 · {ticker}
                    </p>
                ) : null}
                <h2 className="text-lg leading-7 font-bold text-stone-950">{title}</h2>
                <p className="text-base leading-6 font-medium text-stone-600">{summary}</p>
            </div>
        </section>
    );
}

export default ChatResultSummaryCard;
