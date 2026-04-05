import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
    buildInitialRecordHistory,
    type RecordHistoryItem,
} from "@/components/record/record.data";

interface RecordState {
    records: RecordHistoryItem[];
    addRecord: (record: RecordHistoryItem) => void;
}

export const useRecordStore = create<RecordState>()(
    persist(
        (set) => ({
            records: buildInitialRecordHistory(),
            addRecord: (record) =>
                set((state) => {
                    if (state.records.some((item) => item.id === record.id)) {
                        return state;
                    }

                    return {
                        records: [
                            record,
                            ...state.records,
                        ],
                    };
                }),
        }),
        {
            name: "trademind-records",
        },
    ),
);
