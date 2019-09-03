import { Question } from "./question.model";

export class QuestionSet {
    public QuestionSetId: string;
    public AddedDate: string;
    public Type: string;
    public Title: string;
    public Description: string;
    public Questions: Array<Question>;

    constructor() {
        this.Questions = new Array<Question>();
    }

    public setQuestions(questions: Array<Question>) {
        this.Questions = questions;
    }

    public containsQuestion(questionId: string): boolean {
        let found = false;
        if (this.Questions) {
            this.Questions.forEach((question: Question) => {
                if (question.QuestionId === questionId) {
                    found = true;
                    return;
                }
            });
        }
        return found;
    }
}