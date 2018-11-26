import { QuestionSet } from "./question-set.model";

export class Subject {
    public questionSets: Array<QuestionSet>;
    
    constructor(
        public courseId: string,
        public subjectId: string,
        public title: string,
        questionSets: Array<QuestionSet>) {
            this.questionSets = questionSets.sort();
        }
}