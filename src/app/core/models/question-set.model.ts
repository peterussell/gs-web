import { Question } from "./question.model";

export class QuestionSet {
    questionSetId: string;
    subjectId: string;
    title: string;
    questions: { [id: number] : Question };
}