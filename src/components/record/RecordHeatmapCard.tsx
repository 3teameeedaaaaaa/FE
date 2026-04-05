import "./record-heatmap.css";

import HomeSectionCard from "@/components/home/HomeSectionCard";
import {
    buildRecordHeatmap,
    type RecordHeatmapLevel,
} from "@/components/record/record.data";
import { useRecordStore } from "@/store/record/RecordStore";

const heatmapTone: Record<RecordHeatmapLevel, string> = {
    none: "bg-[var(--record-heatmap-none)]",
    once: "bg-[var(--record-heatmap-once)]",
    several: "bg-[var(--record-heatmap-several)]",
};

const legendItems: {
    label: string;
    tone: RecordHeatmapLevel;
}[] = [
    { label: "없음", tone: "none" },
    { label: "한 번", tone: "once" },
    { label: "여러 번", tone: "several" },
];

function RecordHeatmapCard() {
    const records = useRecordStore((state) => state.records);
    const recordHeatmap = buildRecordHeatmap(records);

    return (
        <HomeSectionCard
            title="다시 돌아본 날"
            description="마음이 걸려 다시 들여다 본 날을 모아 봅니다."
            className="pt-5 pb-7"
        >
            <div className="record-heatmap-palette space-y-7">
                <div className="space-y-2.5">
                    {recordHeatmap.map((week, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="grid grid-cols-7 gap-2"
                        >
                            {week.map((day, dayIndex) => (
                                <div
                                    key={`${rowIndex}-${dayIndex}`}
                                    className={`aspect-square rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] ${heatmapTone[day]}`}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                <div className="flex gap-7 text-xs leading-4 text-stone-500">
                    {legendItems.map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center gap-1"
                        >
                            <span
                                className={`h-2.5 w-2.5 rounded-full ${heatmapTone[item.tone]}`}
                            />
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>
        </HomeSectionCard>
    );
}

export default RecordHeatmapCard;
