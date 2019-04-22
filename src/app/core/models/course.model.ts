import { Subject } from "./subject.model";

export class Course {
    public subjects: Array<Subject>;

    constructor(
        public CourseId: string,
        public Title: string,
        public Order: number,
        public Path: string,
        public Subjects: Array<Subject>) {
            this.subjects = Subjects.sort();
        }
}