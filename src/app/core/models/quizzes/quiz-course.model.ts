import { QuizQuestion } from "./quiz-question.model";
import { QuizTopic } from "./quiz-topic.model";

export class QuizCourse {
    constructor(
        public quizCourseId: string,
        public title: string,
        public order: number,
        public topics: Array<QuizTopic>) {}
}