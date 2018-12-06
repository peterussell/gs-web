import { Topic } from "./topic.model";

export class Subject {
    public topics: Array<Topic>;
    
    constructor(
        public courseId: string,
        public subjectId: string,
        public title: string,
        topics: Array<Topic>) {
            this.topics = topics.sort();
        }
}