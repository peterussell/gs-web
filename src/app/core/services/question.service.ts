import { Injectable, Output, EventEmitter } from "@angular/core";
import { Subject } from "../models/subject.model";
import { Topic } from "../models/topic.model";
import { ApiService } from "./api.service";
import { Course } from "../models/course.model";



@Injectable()
export class QuestionService {
    topic: Topic;

    @Output() onSubjectUpdated: EventEmitter<{course: Course, subject: Subject}>
        = new EventEmitter<{course: Course, subject: Subject}>();
    @Output() onQuestionsUpdated: EventEmitter<Topic> = new EventEmitter<Topic>();

    constructor(private apiService: ApiService) {}

    // updateSubject(course: Course, subject: Subject) {
    //     this.onSubjectUpdated.emit({ course: course, subject: subject });
    // }

    updateTopic(topicId: string) {
        this.apiService.getQuestions(topicId).subscribe((res) => {
            this.topic = res;
            this.onQuestionsUpdated.emit(this.topic);
        },
        (error: any) => {
            console.log(`Error: ${error.message}`)
        });
    }
}