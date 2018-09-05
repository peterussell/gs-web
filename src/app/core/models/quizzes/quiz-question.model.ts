import { QuizAnswer } from "./quiz-answer.model";
import { QuizReference } from "./quiz-reference.model";

export class QuizQuestion {
    constructor(
        public questionId: string,
        public question: string,
        public answers: Array<QuizAnswer>,
        public references: Array<QuizReference>) {}
}