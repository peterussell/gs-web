import { Topic } from "./topic.model";

export class Course {
    constructor(
        public courseId: string,
        public title: string,
        public topics: Array<Topic>) { }
}