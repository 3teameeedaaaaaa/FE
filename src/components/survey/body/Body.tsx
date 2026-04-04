import type { Question, SurveyAnswers } from "../Question";
import QuestionField from "../questionField/QuestionField";

type AnswerValue = string | { id: number; name: string };

interface BodyProps {
    questions: Question[];
    answers: SurveyAnswers;
    onChangeAnswer: (questionId: string, value: AnswerValue) => void;
}

function Body({ questions, answers, onChangeAnswer }: BodyProps) {
    return (
        <div className="mt-6 space-y-6">
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
