import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SurveyHeaderProps {
    step: number;
    totalSteps: number;
    onBack: () => void;
}

function SurveyHeader({ step, totalSteps, onBack }: SurveyHeaderProps) {
    const progressSteps = Math.max(totalSteps - 1, 1);
    const currentProgressStep = Math.min(step, progressSteps);
    const currentIndex = Math.max(0, currentProgressStep - 1);
    const showStepCount = step <= progressSteps;

    return (
        <header className="sticky top-0 z-30 border-b border-stone-100 bg-white px-4 pb-5 pt-6">
            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={onBack}
                    className="size-8 shrink-0 rounded-full border border-stone-200 bg-white p-0 text-stone-800 transition-colors hover:bg-stone-100"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>

                <div className="flex flex-1 items-center gap-1.5">
                    {Array.from({ length: progressSteps }).map((_, index) => (
                        <div
                            key={index}
                            className={cn(
                                "h-[3px] flex-1 rounded-full transition-colors duration-300",
                                index <= currentIndex
                                    ? "bg-stone-800"
                                    : "bg-stone-300",
                            )}
                        />
                    ))}
                </div>

                {showStepCount ? (
                    <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-stone-950">
                        {currentProgressStep} / {progressSteps}
                    </span>
                ) : null}
            </div>
        </header>
    );
}

export default SurveyHeader;
