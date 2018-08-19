import { Question } from "./question.model";

export class QuestionSet {
    QuestionSetId: string;
    TopicId: string;
    Title: string;
    Questions: { [id: number] : Question };
}