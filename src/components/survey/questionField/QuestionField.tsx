import { useState } from "react";

import { cn } from "@/lib/utils";
import { searchStocks } from "@/service/survey/searchStocks";
import type { Stock } from "@/type/stock";

import type { Question, SurveyAnswers } from "../Question";

interface QuestionFieldProps {
    question: Question;
    value: string;
    answers: SurveyAnswers;
    onChangeAnswer: (questionId: string, value: string) => void;
}

function QuestionField({
    question,
    value,
    answers,
    onChangeAnswer,
}: QuestionFieldProps) {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [searched, setSearched] = useState(false);
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

    return (
        <section className="space-y-3 rounded-[28px] border border-stone-200 bg-white p-5">
            <div>
                <h2 className="text-base font-semibold text-stone-950">
                    {question.title}
                </h2>
                {question.description ? (
                    <p className="mt-1 text-sm leading-6 text-stone-500">
                        {question.description}
                    </p>
                ) : null}
            </div>
            {/* 선택된 종목 표시 */}
            {selectedStock && (
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-stone-900 text-white text-xs">
                        {selectedStock.name} ({selectedStock.tickerCode})
                    </span>
                </div>
            )}

            {/* 검색 결과 */}
            {searched && !selectedStock && (
                <div className="flex flex-wrap gap-2">
                    {stocks.map((stock) => (
                        <button
                            key={stock.id}
                            type="button"
                            onClick={() => {
                                setSelectedStock(stock);
                                onChangeAnswer(question.id, {
                                    id: stock.id,
                                    name: stock.name,
                                });
                            }}
                            className="px-3 py-1 rounded-full bg-stone-200 text-xs"
                        >
                            {stock.name} ({stock.tickerCode})
                        </button>
                    ))}
                </div>
            )}
            {question.type === "stock-input"
                ? !searched && (
                      <input
                          value={typeof value === "string" ? value : ""}
                          onChange={(e) =>
                              onChangeAnswer(question.id, e.target.value)
                          }
                          onKeyDown={async (e) => {
                              if (e.key === "Enter") {
                                  e.preventDefault();
                                  if (!value.trim()) return;

                                  const res = await searchStocks(value);
                                  setStocks(res);
                                  setSearched(true); // ✅ input 제거 트리거
                              }
                          }}
                          placeholder={question.placeholder}
                      />
                  )
                : null}

            {question.type === "chip-select" ? (
                <div className="flex flex-wrap gap-2">
                    {question.options?.map((option) => {
                        const selected = value === option;
                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() =>
                                    onChangeAnswer(question.id, option)
                                }
                                className={cn(
                                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                                    selected
                                        ? "border-stone-900 bg-stone-900 text-white"
                                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100",
                                )}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            ) : null}

            {question.type === "radio-select" ? (
                <div className="space-y-2">
                    {question.options?.map((option) => {
                        const selected = value === option;
                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() =>
                                    onChangeAnswer(question.id, option)
                                }
                                className={cn(
                                    "flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-colors",
                                    selected
                                        ? "border-stone-900 bg-stone-900 text-white"
                                        : "border-stone-200 bg-white text-stone-800 hover:bg-stone-50",
                                )}
                            >
                                <span
                                    className={cn(
                                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                                        selected
                                            ? "border-white bg-white"
                                            : "border-stone-300 bg-transparent",
                                    )}
                                >
                                    {selected ? (
                                        <span className="h-2.5 w-2.5 rounded-full bg-stone-900" />
                                    ) : null}
                                </span>
                                <span className="text-sm font-medium">
                                    {option}
                                </span>
                            </button>
                        );
                    })}
                </div>
            ) : null}

            {question.type === "textarea" ? (
                <div className="space-y-3">
                    {answers.situationTag ||
                    answers.emotion ||
                    answers.thoughtTag ? (
                        <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-600">
                            {/* 이전 단계 선택값을 보여줘서 텍스트 입력이 막막하지 않게 연결한다. */}
                            {[
                                answers.situationTag,
                                answers.emotion,
                                answers.thoughtTag,
                            ]
                                .filter(Boolean)
                                .join(" · ")}
                        </div>
                    ) : null}

                    {question.starters?.length ? (
                        <div className="flex flex-wrap gap-2">
                            {question.starters.map((starter) => (
                                <button
                                    key={starter}
                                    type="button"
                                    onClick={() =>
                                        onChangeAnswer(
                                            question.id,
                                            value
                                                ? `${starter} ${value}`
                                                : starter,
                                        )
                                    }
                                    className="rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-100"
                                >
                                    {starter}
                                </button>
                            ))}
                        </div>
                    ) : null}

                    <textarea
                        value={value}
                        onChange={(event) =>
                            onChangeAnswer(question.id, event.target.value)
                        }
                        placeholder={question.placeholder}
                        className="min-h-32 w-full resize-none rounded-2xl border border-stone-200 bg-white px-4 py-4 text-sm leading-6 text-stone-950 outline-none transition focus:border-stone-400"
                    />

                    {question.helperText ? (
                        <p className="text-xs leading-5 text-stone-400">
                            {question.helperText}
                        </p>
                    ) : null}
                </div>
            ) : null}
        </section>
    );
}

export default QuestionField;
