// import { Question } from "../core/models/question.model";
// import { Topic } from "../core/models/topic.model";
// import { Reference } from "../core/models/reference.model";
// import { Subject } from "../core/models/subject.model";
// import { Course } from "../core/models/course.model";
// import { Injectable } from "@angular/core";

// @Injectable()
// export class CourseMocker {
//     getCourses(count: number): Array<Course> {
//         var courses = new Array<Course>();
//         for (let i=1; i<=count; i++) {
//             courses.push(new Course(
//                 `${i}`,
//                 `This is course ${i}`,
//                 this.getSubjects(`${i}`, 4)
//             ));
//         }
//         return courses;
//     }

//     getSubjects(courseId: string, count: number): Array<Subject> {
//         var subjects = new Array<Subject>();
//         for (let i=1; i<=count; i++) {
//             subjects.push(new Subject(
//                 courseId,
//                 `${i}`,
//                 `This is subject ${i}`,
//                 this.getTopics(10)
//             ));
//         }
//         return subjects;
//     }

//     // getTopics(count: number): Array<Topic> {
//     //     var topics = new Array<Topic>();
//     //     for (let i=1; i<=count; i++) {
//     //         var qs = new Topic();
//     //         this.getQuestions(8).forEach(q => qs.questions.push(q));
//     //         topics.push(qs);
//     //     }
//     //     return topics;
//     // }

//     getQuestions(count: number): Array<Question> {
//         var questions = new Array<Question>();
//         for (let i=1; i<=count; i++) {
//             questions.push(new Question(
//                 `${i}`,
//                 `This is question ${i}`,
//                 `This is the answer to question ${i}`,
//                 this.getReferences(2)
//             ));
//         }
//         return questions;
//     }
    
//     getReferences(count: number): Array<Reference> {
//         var references = new Array<Reference>();
//         for (let i=1; i<=count; i++) {
//             references.push(new Reference(
//                 `This is reference ${i}`,
//                 `https://referenceurl${i}.com`
//             ));
//         }
//         return references;
//     }
// }