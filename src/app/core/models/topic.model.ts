import { Question } from "./question.model";

export class Topic {
    topicId: string;
    subjectId: string;
    title: string;
    questions: { [id: number] : Question };
}