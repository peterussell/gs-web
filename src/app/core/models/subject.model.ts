import { Topic } from "./topic.model";

export class Subject {
    public topics: Array<Topic>;
    
    constructor(
        public SourseId: string,
        public SubjectId: string,
        public Title: string,
        public Path: string,
        public Topics: Array<Topic>) {
            this.topics = Topics.sort();
        }
}