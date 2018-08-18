// import { Question } from "../core/models/question.model";
// import { QuestionSet } from "../core/models/question-set.model";
// import { Reference } from "../core/models/reference.model";
// import { Topic } from "../core/models/topic.model";
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
//                 this.getTopics(`${i}`, 4)
//             ));
//         }
//         return courses;
//     }

//     getTopics(courseId: string, count: number): Array<Topic> {
//         var topics = new Array<Topic>();
//         for (let i=1; i<=count; i++) {
//             topics.push(new Topic(
//                 courseId,
//                 `${i}`,
//                 `This is topic ${i}`,
//                 this.getQuestionSets(10)
//             ));
//         }
//         return topics;
//     }

//     // getQuestionSets(count: number): Array<QuestionSet> {
//     //     var questionSets = new Array<QuestionSet>();
//     //     for (let i=1; i<=count; i++) {
//     //         var qs = new QuestionSet();
//     //         this.getQuestions(8).forEach(q => qs.questions.push(q));
//     //         questionSets.push(qs);
//     //     }
//     //     return questionSets;
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