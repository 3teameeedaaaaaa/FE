import "./anxious-candle-chart.css";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

interface CandleData {
    b: string;
    h: string;
    wb: string;
    wh: string;
}

const candleData: CandleData[] = [
    { b: "7.1%", h: "18.93%", wb: "0%", wh: "31.95%" },
    { b: "26.04%", h: "2.37%", wb: "19.41%", wh: "14.91%" },
    { b: "28.64%", h: "4.5%", wb: "16.92%", wh: "21.66%" },
    { b: "31.42%", h: "3.43%", wb: "19.76%", wh: "27.93%" },
    { b: "31.42%", h: "15.44%", wb: "27.43%", wh: "28.07%" },
    { b: "46.54%", h: "0.28%", wb: "43.43%", wh: "24.38%" },
    { b: "35.86%", h: "8.7%", wb: "29.7%", wh: "24.5%" },
    { b: "11.67%", h: "24.19%", wb: "5.33%", wh: "31.83%" },
    { b: "11.83%", h: "15.1%", wb: "7.93%", wh: "24.97%" },
    { b: "27.81%", h: "12.04%", wb: "27.69%", wh: "28.17%" },
    { b: "39.85%", h: "28.25%", wb: "39.53%", wh: "28.58%" },
    { b: "70.8%", h: "6.27%", wb: "60.96%", wh: "24.84%" },
    { b: "75.8%", h: "2.71%", wb: "68.38%", wh: "31.62%" },
    { b: "67.23%", h: "8.71%", wb: "64.8%", wh: "24.97%" },
    { b: "67.81%", h: "7.85%", wb: "57.54%", wh: "27.55%" },
    { b: "70.08%", h: "6.14%", wb: "55.68%", wh: "21.83%" },
    { b: "66.39%", h: "3.69%", wb: "58.11%", wh: "26.11%" },
    { b: "64.8%", h: "9.78%", wb: "45.47%", wh: "29.61%" },
];

function parsePercent(value: string) {
    return Number.parseFloat(value.replace("%", ""));
}

function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}

function interpolateCandle(current: CandleData, next: CandleData): CandleData {
    return {
        b: formatPercent((parsePercent(current.b) + parsePercent(next.b)) / 2),
        h: formatPercent((parsePercent(current.h) + parsePercent(next.h)) / 2),
        wb: formatPercent(
            (parsePercent(current.wb) + parsePercent(next.wb)) / 2,
        ),
        wh: formatPercent(
            (parsePercent(current.wh) + parsePercent(next.wh)) / 2,
        ),
    };
}

const expandedCandleData = candleData.flatMap((candle, index) => {
    const next = candleData[index + 1];

    if (!next) {
        return [candle];
    }

    return [candle, interpolateCandle(candle, next)];
});

interface AnxiousCandleChartProps {
    variant?: "light" | "dark";
    size?: "xs" | "sm" | "md";
    className?: string;
}

function AnxiousCandleChart({
    variant = "light",
    size = "md",
    className,
}: AnxiousCandleChartProps) {
    return (
        <div
            className={cn(
                "anxious-candle-wrapper",
                variant === "dark" ? "variant-dark" : "variant-light",
                size === "xs"
                    ? "size-xs"
                    : size === "sm"
                      ? "size-sm"
                      : "size-md",
                className,
            )}
        >
            <div className="anxious-candle-chart">
                {expandedCandleData.map((candle, index) => {
                    const waveDelay = `${index * 0.15}s`;
                    const driftDelay = `${index * -0.8}s`;

                    return (
                        <div
                            key={index}
                            className="anxious-candle"
                            style={
                                {
                                    "--b": candle.b,
                                    "--h": candle.h,
                                    "--wb": candle.wb,
                                    "--wh": candle.wh,
                                    "--wave-delay": waveDelay,
                                    "--drift-delay": driftDelay,
                                    "--drift-dur": "18s",
                                } as CSSProperties
                            }
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default AnxiousCandleChart;
