import { Injectable, Output, EventEmitter } from "@angular/core";

import { Question } from "../models/question.model";
import { QuestionSet } from "../models/question-set.model";
import { JsonService } from "./json.service";

@Injectable()
export class QuestionService {
    questionSet: QuestionSet;

    @Output() onQuestionsUpdated: EventEmitter<any> = new EventEmitter<any>();

    constructor(private jsonService: JsonService) {}

    updateQuestionSet(questionSetId: string) {

        this.jsonService.getQuestions(questionSetId)
            .subscribe((res) => {
                if (res == {}) {
                    // TODO: should go to a logger (does S3 have something we can use?)
                    console.log(`Error fetching questionSet ${questionSetId}, status code ${res.statusCode}.`);
                } else {
                    this.questionSet = res
                    this.onQuestionsUpdated.emit(this.questionSet);
                }
            });
    }
}