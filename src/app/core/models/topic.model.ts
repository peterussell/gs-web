import { QuestionSet } from "./question-set.model";

export class Topic {
    constructor(
        public courseId: string,
        public topicId: string,
        public title: string,
        public questionSets: Array<QuestionSet>) { }
}