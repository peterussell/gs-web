import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { RegisterInterestResponse } from "./interfaces/register-interest-response";
import { Reference } from "../models/reference.model";
import { QuestionSet } from "../models/question-set.model";

@Injectable()
export class ApiService {
    private readonly basePath = 'http://localhost:4200/assets';
    private readonly awsBasePath = 'https://wbr0qbew2b.execute-api.us-west-2.amazonaws.com/prod';
    private httpOptions;

    private readonly coursesRelPath = 'courses';
    private readonly topicsRelPath = 'topics';
    private readonly topicRelPath = 'topic';
    private readonly flashcardsRelPath = 'flashcards'
    private readonly registerInterestRelPath = 'register-interest';
    private readonly addQuestionRelPath = 'question';
    private readonly getQuestionsByIdRelPath = 'questions';
    private readonly reportQuestionRelPath = 'report-question';
    private readonly memberInfoRelPath = 'member';
    private readonly memberProfileRelPath = 'profile'; // member/{id}/profile
    private readonly randomQuestionRelPath_v1 = 'flashcards';
    private readonly randomQuestionRelPath_v2 = 'question/random';

    getAwsBasePathVersioned(version: number): string {
        return `${this.awsBasePath}/v${version}`
    }

    getRandomQuestionPathVersioned(version: number): string {
        switch (version) {
            case 1:
                return this.randomQuestionRelPath_v1;
            case 2:
                return this.randomQuestionRelPath_v2;
            default:
                return undefined;
        }
    }

    constructor(private http: HttpClient) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=utf-8'
            }),
            observe: 'response'
        };
    }

    public getCourses(): Observable<any> {
        return this.http.get(`${this.getAwsBasePathVersioned(2)}/${this.coursesRelPath}`);
    }

    /* ---- Questions ---- */
    public getQuestionsForTopic(topicId: string): Observable<any> {
        return this.http.get(`${this.getAwsBasePathVersioned(2)}/${this.topicRelPath}/${topicId}`);
    }

    public getRandomQuestion(topicIdsToInclude: Array<string>,
                             topicIdsSeen: Array<string>,
                             questionIdsSeen: Array<string>,
                             apiVersion: number) {
        const body = {
            'topicsToInclude': topicIdsToInclude,
            'topicsAlreadySeen': topicIdsSeen,
            'questionsAlreadySeen': questionIdsSeen
        };

        return this.http.post(
            `${this.getAwsBasePathVersioned(apiVersion)}/${this.getRandomQuestionPathVersioned(apiVersion)}`,
            body,
            this.httpOptions
        );
    }

    public addQuestion(topicId: string, syllabusRef: string, question: string, answer: string,
        references: Array<Reference>): Observable<any> {

        var body = {
            'TopicId': topicId,
            'SyllabusRef': syllabusRef,
            'Question': question,
            'Answer': answer,
            'References': []
        };
        references.forEach(r => {
            if (r.Text === null) { return; }
            body['References'].push({ 'Text': r.Text, 'Url': r.Url });
        });

        return this.http.post<any>(
            `${this.getAwsBasePathVersioned(1)}/${this.addQuestionRelPath}`, body, this.httpOptions
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
            `${this.getAwsBasePathVersioned(1)}/${this.reportQuestionRelPath}`, body, this.httpOptions
        );
    }

    /* ---- Member ---- */
    public registerInterest(email: string): Observable<any> {
        const body = { 'email': email };
        return this.http.post<RegisterInterestResponse>(
            `${this.getAwsBasePathVersioned(1)}/${this.registerInterestRelPath}`, body, this.httpOptions
        );
    }

    public getUserProfile(userId: string): Observable<any> {
        return this.http.get<any>(`${this.getAwsBasePathVersioned(2)}/${this.memberInfoRelPath}/${userId}/profile`)
    }

    /* ---- Review sets ---- */
    public addToReviewSet(userId: string, questionId: string): Observable<any> {
        const body = {
            'memberId': userId,
            'questionIds': [questionId]
        };
        return this.http.put(
            `${this.getAwsBasePathVersioned(2)}/${this.memberInfoRelPath}/${userId}/review-set`,
            body,
            this.httpOptions
        );
    }

    public removeFromReviewSet(userId: string, questionId: string): Observable<any> {
        return this.http.delete(
            `${this.getAwsBasePathVersioned(2)}/${this.memberInfoRelPath}/${userId}/review-set/${questionId}`,
            this.httpOptions
        );
    }
}