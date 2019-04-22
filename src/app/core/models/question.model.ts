import { Reference } from "./reference.model";


export class Question {
    
    constructor(
        public QuestionId: string,
        public Question: string,
        public Answer: string,
        public References: Array<Reference>,
        public SyllabusRef: string,
        public TopicId?: string) {}
}