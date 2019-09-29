import { Subject } from "./subject.model";

export class Course {
    public CourseId: string;
    public Title: string;
    public Order: number;
    public Path: string;
    public Subjects: Array<Subject>;

    constructor(data: any) {
        this.CourseId = data['CourseId'];
        this.Title = data['Title'];
        this.Order = data['Order'];
        this.Path = data['Path'];

        this.Subjects = new Array<Subject>();
        let subjects = data['Subjects'];
        if (subjects) {
            subjects.sort().forEach(s => {
                this.Subjects.push(new Subject(s));
            })
        }
    }
}