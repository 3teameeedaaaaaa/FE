import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import {
    type HomeStoryCategory,
    homeStoryFilters,
    homeStoryItems,
} from "./home.data";

function HomeStoryBoard() {
    const [activeFilter, setActiveFilter] = useState<HomeStoryCategory>("all");

    const visibleItems = useMemo(() => {
        if (activeFilter === "all") {
            return homeStoryItems;
        }

        return homeStoryItems.filter((item) => item.category === activeFilter);
    }, [activeFilter]);

    return (
        <div className="space-y-6">
            <div className="flex gap-2.5">
                {homeStoryFilters.map((filter) => {
                    const selected = filter.id === activeFilter;

                    return (
                        <button
                            key={filter.id}
                            type="button"
                            onClick={() => setActiveFilter(filter.id)}
                            className={cn(
                                "inline-flex h-9 items-center justify-center rounded-full border px-4 text-sm leading-5 transition-colors",
                                selected
                                    ? "border-stone-800 bg-stone-800 font-bold text-white"
                                    : "border-stone-200 bg-white font-medium text-[#4a4a4a] hover:bg-stone-50",
                            )}
                        >
                            {filter.label}
                        </button>
                    );
                })}
            </div>

            <div className="space-y-3">
                {visibleItems.map((item) => (
                    <article
                        key={item.id}
                        className="rounded-2xl bg-stone-100/70 px-5 py-4.5 border border-stone-200/30"
                    >
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-5.5 items-center rounded-lg bg-white/90 px-2 text-[10px] leading-3 font-extrabold text-[#45556c] tracking-tight">
                                {item.category === "pre" ? "사전" : "사후"}
                            </span>
                            <span
                                className="truncate text-xs leading-4 font-bold opacity-90"
                                style={{ color: item.emotionTone }}
                            >
                                {item.emotionLabel}
                            </span>
                        </div>

                        <p className="mt-3 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] leading-6 font-semibold text-stone-800">
                            {item.content}
                        </p>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default HomeStoryBoard;
