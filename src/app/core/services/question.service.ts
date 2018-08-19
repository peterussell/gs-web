import { Injectable, Output, EventEmitter } from "@angular/core";
import { Topic } from "../models/topic.model";
import { QuestionSet } from "../models/question-set.model";
import { Question } from "../models/question.model";
import { ApiService } from "./api.service";
import { Course } from "../models/course.model";



@Injectable()
export class QuestionService {
    questionSet: QuestionSet;

    @Output() onTopicUpdated: EventEmitter<{course: Course, topic: Topic}>
        = new EventEmitter<{course: Course, topic: Topic}>();
    @Output() onQuestionsUpdated: EventEmitter<QuestionSet> = new EventEmitter<QuestionSet>();

    constructor(private apiService: ApiService) {}

    updateTopic(course: Course, topic: Topic) {
        this.onTopicUpdated.emit({ course: course, topic: topic });
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