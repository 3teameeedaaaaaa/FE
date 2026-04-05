import AppTopBar from "@/components/common/AppTopBar";
import RecordEntriesCard from "@/components/record/RecordEntriesCard";
import RecordHeatmapCard from "@/components/record/RecordHeatmapCard";
import RecordThoughtStatsCard from "@/components/record/RecordThoughtStatsCard";
import BottomGradientBackdrop from "@/components/ui/BottomGradientBackdrop";

function Records() {
    return (
        <div className="flex min-h-full flex-1 flex-col bg-white">
            <AppTopBar />

            <div className="relative flex-1 overflow-hidden bg-stone-50 pb-[112px]">
                <BottomGradientBackdrop className="pointer-events-none fixed left-1/2 top-[154px] z-0 h-[980px] w-[390px] -translate-x-1/2 overflow-hidden opacity-36" />

                <main className="relative z-10 px-5">
                    <section className="-mx-5 bg-white px-5 pb-7 pt-5">
                        <div className="space-y-1">
                            <h1 className="text-left text-2xl leading-9 font-bold text-stone-950">
                                어떤 종목이 걸리나요?
                            </h1>
                            <p className="text-left font-serif text-sm leading-6 text-stone-500">
                                언제 다시 돌아보게 됐는지 날짜 흐름으로 봅니다.
                            </p>
                        </div>
                    </section>

                    <div className="mt-6 space-y-5">
                        <RecordHeatmapCard />
                        <RecordThoughtStatsCard />
                        <RecordEntriesCard />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Records;
