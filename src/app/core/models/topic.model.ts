import { QuestionSet } from "./question-set.model";

export class Topic {
    public questionSets: Array<QuestionSet>;
    
    constructor(
        public courseId: string,
        public topicId: string,
        public title: string,
        questionSets: Array<QuestionSet>) {
            this.questionSets = questionSets.sort();
            console.log(questionSets.sort());
        }
}