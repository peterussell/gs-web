import { Question } from "./question.model";

export class QuestionSet {
    questionSetId: string;
    topicId: string;
    title: string;
    questions: { [id: number] : Question };
}