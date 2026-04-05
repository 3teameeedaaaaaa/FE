import HomeSectionCard from "@/components/home/HomeSectionCard";
import { useRecordStore } from "@/store/record/RecordStore";

import { buildRecordEntries } from "./record.data";
import RecordEntryCard from "./RecordEntryCard";

function RecordEntriesCard() {
    const records = useRecordStore((state) => state.records);
    const entries = buildRecordEntries(records);

    return (
        <HomeSectionCard
            title="최근 마음이 남았던 순간"
            description="그날 어떤 마음이 올라 왔는지 다시 봅니다."
            className="pt-5 pb-7"
        >
            <div className="space-y-3">
                {entries.map((entry) => (
                    <RecordEntryCard key={entry.id} entry={entry} />
                ))}
            </div>
        </HomeSectionCard>
    );
}

export default RecordEntriesCard;
