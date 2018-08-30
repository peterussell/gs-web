import { Topic } from "./topic.model";

export class Course {
    public topics: Array<Topic>;

    constructor(
        public courseId: string,
        public title: string,
        public order: number,
        topics: Array<Topic>) {
            this.topics = topics.sort();
        }
}