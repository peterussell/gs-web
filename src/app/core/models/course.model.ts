import { Topic } from "./topic.model";

export class Course {
    public topics: Array<Topic>;

    constructor(
        public courseId: string,
        public title: string,
        topics: Array<Topic>) {
            this.topics = topics.sort();
        }
}