import { Injectable, Output, EventEmitter } from "@angular/core";

import { Question } from "../models/question.model";
import { QuestionSet } from "../models/question-set.model";
import { ApiService } from "./api.service";

@Injectable()
export class QuestionService {
    questionSet: QuestionSet;

    @Output() onQuestionsUpdated: EventEmitter<any> = new EventEmitter<any>();

    constructor(private apiService: ApiService) {}

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