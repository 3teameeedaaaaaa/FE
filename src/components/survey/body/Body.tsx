import { cn } from "@/lib/utils";

import type { Question, SurveyAnswers } from "../Question";
import QuestionField from "../questionField/QuestionField";

type AnswerValue = string | { id: number; name: string };

interface BodyProps {
    questions: Question[];
    answers: SurveyAnswers;
    onChangeAnswer: (questionId: string, value: AnswerValue) => void;
    className?: string;
}

function Body({ questions, answers, onChangeAnswer, className }: BodyProps) {
    return (
        <div className={cn("mt-6 space-y-6", className)}>
            {questions.map((question) => (
                <QuestionField
                    key={question.id}
                    question={question}
                    value={answers[question.id] ?? ""}
                    answers={answers}
                    onChangeAnswer={onChangeAnswer}
                />
            ))}
        </div>
    );
}

export default Body;
