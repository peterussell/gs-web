import { Injectable, Output, EventEmitter } from "@angular/core";
import { Subject } from "../models/subject.model";
import { QuestionSet } from "../models/question-set.model";
import { ApiService } from "./api.service";
import { Course } from "../models/course.model";



@Injectable()
export class QuestionService {
    questionSet: QuestionSet;

    @Output() onSubjectUpdated: EventEmitter<{course: Course, subject: Subject}>
        = new EventEmitter<{course: Course, subject: Subject}>();
    @Output() onQuestionsUpdated: EventEmitter<QuestionSet> = new EventEmitter<QuestionSet>();

    constructor(private apiService: ApiService) {}

    updateSubject(course: Course, subject: Subject) {
        this.onSubjectUpdated.emit({ course: course, subject: subject });
    }

    updateQuestionSet(questionSetId: string) {
        this.apiService.getQuestions(questionSetId).subscribe((res) => {
            this.questionSet = res;
            this.onQuestionsUpdated.emit(this.questionSet);
        },
        (error: any) => {
            console.log(`Error: ${error.message}`)
        });
    }
}