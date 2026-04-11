import type { RecordEntry } from "./record.data";

interface RecordEntryCardProps {
    entry: RecordEntry;
}

function RecordEntryCard({ entry }: RecordEntryCardProps) {
    return (
        <article className="rounded-2xl border border-[rgba(123,157,242,0.14)] bg-[rgba(248,250,252,0.88)] p-5 shadow-[0_8px_24px_rgba(123,157,242,0.06)] backdrop-blur-sm">
            <div className="space-y-3">
                {entry.ticker ? (
                    <p className="text-xs leading-4 font-semibold text-[#314158]">
                        종목 · {entry.ticker}
                    </p>
                ) : null}

                <div className="flex items-center justify-between gap-4">
                    <p className="truncate text-base leading-6 font-extrabold text-[#4a4a4a]">
                        {entry.emotion}
                    </p>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-6 items-center rounded-full bg-white/80 px-3 text-xs leading-4 font-extrabold text-stone-800">
                            {entry.phase}
                        </span>
                        <span className="text-xs leading-4 font-bold text-stone-600">
                            {entry.date}
                        </span>
                    </div>
                </div>

                <p className="inline-flex h-7 items-center rounded-full bg-[rgba(123,157,242,0.12)] px-3 text-xs leading-4 font-medium text-[#314158]">
                    {entry.thought}
                </p>
            </div>

            <p className="pt-3 text-sm leading-6 font-medium text-[#4a4a4a]">
                {entry.summary}
            </p>
        </article>
    );
}

export default RecordEntryCard;
