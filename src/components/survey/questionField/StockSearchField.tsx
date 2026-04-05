import { Check, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { searchStocks } from "@/service/survey/searchStocks";
import type { Stock } from "@/type/stock";

import type { Question } from "../Question";

type FieldValue = string | { id: number; name: string };

const featuredStocks: Stock[] = [
    {
        id: -1,
        name: "삼성전자",
        tickerCode: "005930",
        marketType: "KOSPI",
    },
    {
        id: -2,
        name: "삼성SDI",
        tickerCode: "006400",
        marketType: "KOSPI",
    },
];

interface StockSearchFieldProps {
    question: Question;
    value: FieldValue;
    onChangeAnswer: (questionId: string, value: FieldValue) => void;
}

function StockSearchField({
    question,
    value,
    onChangeAnswer,
}: StockSearchFieldProps) {
    const [query, setQuery] = useState(typeof value === "string" ? value : "");
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const selectedStock =
        typeof value === "object" && value !== null ? value : null;
    const keyword = query.trim();
    const showFeaturedStocks = !keyword && !selectedStock;
    const showSearchResults = keyword.length > 0 && !selectedStock;
    const visibleStocks = showFeaturedStocks ? featuredStocks : stocks;

    useEffect(() => {
        if (typeof value === "string") {
            setQuery(value);
            return;
        }

        setQuery("");
    }, [value]);

    useEffect(() => {
        if (!keyword || selectedStock) {
            setStocks([]);
            setHasSearched(false);
            setLoading(false);
            return;
        }

        let cancelled = false;

        // 입력 중 과도한 요청을 줄이기 위해 짧은 지연 후 검색한다.
        const timer = window.setTimeout(async () => {
            setLoading(true);

            try {
                const results = await searchStocks(keyword);

                if (!cancelled) {
                    setStocks(results);
                    setHasSearched(true);
                }
            } catch (error) {
                console.error(error);

                if (!cancelled) {
                    setStocks([]);
                    setHasSearched(true);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }, 250);

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [keyword, query, selectedStock]);

    const handleSelectStock = (stock: Stock) => {
        setStocks([]);
        setHasSearched(false);
        onChangeAnswer(question.id, {
            id: stock.id,
            name: stock.name,
        });
    };

    const handleUseTypedStock = () => {
        const keyword = query.trim();

        if (!keyword) {
            return;
        }

        setStocks([]);
        setHasSearched(false);
        onChangeAnswer(question.id, {
            id: 0,
            name: keyword,
        });
    };

    const handleClearSelection = () => {
        setQuery("");
        setStocks([]);
        setHasSearched(false);
        onChangeAnswer(question.id, "");
    };

    return (
        <div
            className={cn(
                "relative z-10",
                selectedStock ? "space-y-3" : "pt-[164px]",
            )}
        >
            {selectedStock ? (
                <div className="mb-3 rounded-2xl border border-stone-900 bg-white px-4 py-3.5">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <Check className="h-4 w-4 shrink-0 text-stone-900" />
                            <div>
                                <p className="text-sm font-semibold text-stone-900">
                                    {selectedStock.name}
                                </p>
                                <p className="text-xs text-stone-400">
                                    {selectedStock.id === 0
                                        ? "직접 입력한 종목"
                                        : "선택된 종목"}
                                </p>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="link"
                            onClick={handleClearSelection}
                            className="h-auto p-0 text-xs text-stone-400 no-underline hover:text-stone-700"
                        >
                            지우기
                        </Button>
                    </div>
                </div>
            ) : null}

            {!selectedStock ? (
                <div className="absolute inset-x-0 bottom-[58px] z-10 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_6px_20px_rgba(28,25,23,0.04)]">
                    {showSearchResults && loading ? (
                        <div className="px-4 py-4 text-left font-serif text-sm leading-6 text-stone-500">
                            종목을 찾고 있어요.
                        </div>
                    ) : visibleStocks.length > 0 ? (
                        <div className="py-1">
                            {visibleStocks.map((stock, index) => (
                                <button
                                    key={`${stock.id}-${stock.tickerCode}`}
                                    type="button"
                                    onClick={() => handleSelectStock(stock)}
                                    className={cn(
                                        "flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-stone-50",
                                        index > 0 && "border-t border-stone-100",
                                    )}
                                >
                                    <span className="text-sm font-semibold text-stone-900">
                                        {stock.name}
                                    </span>
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-xs font-medium text-stone-400">
                                            {stock.tickerCode}
                                        </span>
                                        <span className="rounded-md bg-stone-200 px-1.5 py-0.5 text-[10px] font-semibold tracking-[-0.4px] text-stone-500">
                                            {stock.marketType}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : hasSearched ? (
                        <div className="space-y-3 px-4 py-4 text-left">
                            <p className="font-serif text-sm leading-6 text-stone-500">
                                목록에 없는 종목이어도 괜찮아요. 지금 적은
                                이름 그대로 다음으로 이어갈 수 있어요.
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleUseTypedStock}
                                className="h-10 rounded-xl border-stone-200 px-4 text-sm font-medium text-stone-800"
                            >
                                "{keyword}"로 계속하기
                            </Button>
                        </div>
                    ) : null}
                </div>
            ) : null}

            <div className="relative z-20 rounded-2xl border border-stone-200 bg-white">
                <div className="flex h-12 items-center gap-3 px-4">
                    <Search className="h-4 w-4 shrink-0 text-stone-400" />
                    <input
                        value={query}
                        onChange={(event) => {
                            const nextValue = event.target.value;

                            setQuery(nextValue);
                            onChangeAnswer(question.id, nextValue);
                        }}
                        placeholder={question.placeholder}
                        className="h-full w-full bg-transparent text-base text-stone-900 outline-none placeholder:text-stone-400"
                    />
                </div>
            </div>
        </div>
    );
}

export default StockSearchField;
