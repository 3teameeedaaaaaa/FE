import HomeSectionCard from "@/components/home/HomeSectionCard";
import { useRecordStore } from "@/store/record/RecordStore";

import { buildRecordThoughtStats } from "./record.data";

function RecordThoughtStatsCard() {
    const records = useRecordStore((state) => state.records);
    const recordThoughtStats = buildRecordThoughtStats(records);

    return (
        <HomeSectionCard
            title="자주 걸리는 생각"
            description="비슷한 순간마다 어떤 생각이 반복됐는지 봅니다."
            className="pt-5 pb-7"
        >
            <div className="space-y-5">
                {recordThoughtStats.map((item) => (
                    <div key={item.label} className="space-y-2">
                        <div className="flex items-center justify-between gap-4">
                            <p
                                className={`text-base leading-6 ${
                                    item.emphasized
                                        ? "font-medium text-stone-950"
                                        : "font-medium text-[#4a4a4a]"
                                }`}
                            >
                                {item.label}
                            </p>
                            <span
                                className={`shrink-0 text-sm leading-5 ${
                                    item.emphasized
                                        ? "font-extrabold text-[#4a4a4a]"
                                        : "font-semibold text-stone-500"
                                }`}
                            >
                                {item.percent}%
                            </span>
                        </div>

                        <div className="h-2 rounded-full bg-stone-100">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${item.percent}%`,
                                    backgroundColor: item.tone,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </HomeSectionCard>
    );
}

export default RecordThoughtStatsCard;
