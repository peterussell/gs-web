import { Question } from "./question.model";

export class Topic {
    topicId: string;
    subjectId: string;
    title: string;
    path: string;
    subTopic: string;
    questions: Array<Question>;
}