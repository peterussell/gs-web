import { Subject } from "./subject.model";

export class Course {
    public subjects: Array<Subject>;

    constructor(
        public courseId: string,
        public title: string,
        public order: number,
        public path: string,
        subjects: Array<Subject>) {
            this.subjects = subjects.sort();
        }
}