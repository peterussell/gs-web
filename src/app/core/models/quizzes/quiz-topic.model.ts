import { QuizQuestion } from "./quiz-question.model";

export class QuizTopic {
    quizTopicId: string;
    quizCourseId: string;
    title: string;
    quizQuestions: { [quizQuestionid: number]: QuizQuestion };
}