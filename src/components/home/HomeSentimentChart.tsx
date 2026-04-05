import { homeSentimentItems } from "./home.data";

function HomeSentimentChart() {
    return (
        <div className="space-y-5">
            {homeSentimentItems.map((item) => (
                <div key={item.label} className="space-y-1">
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
    );
}

export default HomeSentimentChart;
