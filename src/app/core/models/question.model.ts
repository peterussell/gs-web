import { Reference } from "./reference.model";


export class Question {
    
    constructor(
        public questionId: string,
        public question: string,
        public answer: string,
        public references: Array<Reference>,
        public topicId?: string) {}
}