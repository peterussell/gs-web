import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { RegisterInterestResponse } from "./interfaces/register-interest-response";
import { Reference } from "../models/reference.model";
import { QuestionSet } from "../models/question-set.model";

@Injectable()
export class ApiService {
    private readonly basePath = 'http://localhost:4200/assets';
    private readonly awsBasePath_v1 = 'https://wbr0qbew2b.execute-api.us-west-2.amazonaws.com/prod/v1';
    private readonly awsBasePath_v2 = 'https://wbr0qbew2b.execute-api.us-west-2.amazonaws.com/prod/v2';
    private httpOptions;

    private readonly coursesRelPath = 'courses';
    private readonly topicsRelPath = 'topics';
    private readonly topicRelPath = 'topic';
    private readonly flashcardsRelPath = 'flashcards'
    private readonly registerInterestRelPath = 'register-interest';
    private readonly addQuestionRelPath = 'question';
    private readonly reportQuestionRelPath = 'report-question';
    private readonly memberInfoRelPath = 'member';
    private readonly randomQuestionRelPath = 'question/random';

    constructor(private http: HttpClient) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=utf-8'
            }),
            observe: 'response'
        };
    }

    public getCourses(): Observable<any> {
        return this.http.get(`${this.awsBasePath_v2}/${this.coursesRelPath}`);
    }

    public getQuestions(topicId: string): Observable<any> {
        return this.http.get(`${this.awsBasePath_v2}/${this.topicRelPath}/${topicId}`);
    }

    public getReviewSetForUser(userId: string): Observable<QuestionSet> {
        return this.http.get<QuestionSet>(`${this.awsBasePath_v2}/${this.memberInfoRelPath}/${userId}/review-sets`)
    }

    public addToReviewSet(userId: string, questionSetId: string, questionId: string): Observable<any> {
        // TODO: tmp
        console.log(`Adding to review set: ${userId}, ${questionSetId}, ${questionId}`);
        return null;
    }

    public removeFromReviewSet(userId: string, questionSetId: string, questionId: string): Observable<any> {
        // TODO: tmp
        console.log(`Removing from review set: ${userId}, ${questionSetId}, ${questionId}`);
        return null;
    }

    public getRandomQuestion(topicIdsToInclude: Array<string>,
                             topicIdsSeen: Array<string>,
                             questionIdsSeen: Array<string>) {
        const body = {
            'topicsToInclude': topicIdsToInclude,
            'topicsAlreadySeen': topicIdsSeen,
            'questionsAlreadySeen': questionIdsSeen
        };

        console.log(`${this.awsBasePath_v2}/${this.randomQuestionRelPath}`);

        return this.http.post(
            `${this.awsBasePath_v2}/${this.randomQuestionRelPath}`, body, this.httpOptions
        );
    }

    public registerInterest(email: string): Observable<any> {
        const body = { 'email': email };
        return this.http.post<RegisterInterestResponse>(
            `${this.awsBasePath_v1}/${this.registerInterestRelPath}`, body, this.httpOptions
        );
    }

    public addQuestion(topicId: string, question: string, answer: string,
        references: Array<Reference>): Observable<any> {
        var body = {
            'topic_id': topicId,
            'question': question,
            'answer': answer,
            'references': []
        };
        references.forEach(r => {
            if (r.text === null) { return; }
            body['references'].push({ 'text': r.text, 'url': r.url });
        });

        return this.http.post<any>(
            `${this.awsBasePath_v1}/${this.addQuestionRelPath}`, body, this.httpOptions
        );
    }

    public reportQuestion(questionId: string, reason: string, description: string,
        email: string): Observable<any> {
        var body = {
            'questionId': questionId,
            'reason': reason,
            'description': description,
            'email': email
        };

        return this.http.post<any>(
            `${this.awsBasePath_v1}/${this.reportQuestionRelPath}`, body, this.httpOptions
        );
    }
}