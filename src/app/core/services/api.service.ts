import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { RegisterInterestResponse } from "./interfaces/register-interest-response";
import { Reference } from "../models/reference.model";

@Injectable()
export class ApiService {
    private readonly basePath = 'http://localhost:4200/assets';
    private readonly awsBasePath = 'https://wbr0qbew2b.execute-api.us-west-2.amazonaws.com/prod/v1';
    private httpOptions;

    private readonly coursesRelPath = 'courses';
    private readonly topicsRelPath = 'topics';
    private readonly registerInterestRelPath = 'register-interest';
    private readonly addQuestionRelPath = 'question';
    private readonly reportQuestionRelPath = 'report-question';

    constructor(private http: HttpClient) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=utf-8'
            }),
            observe: 'response'
        };
    }

    public getCourses(): Observable<any> {
        return this.http.get(`${this.awsBasePath}/${this.coursesRelPath}`);
    }

    public getQuestions(topicId: string): Observable<any> {
        return this.http.get(`${this.awsBasePath}/${this.topicsRelPath}/${topicId}`);
    }

    public registerInterest(email: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json;' });

        var body = { 'email': email };
        return this.http.post<RegisterInterestResponse>(
            `${this.awsBasePath}/${this.registerInterestRelPath}`, body, this.httpOptions
        );
    }

    public addQuestion(topicId: string, question: string, answer: string,
        references: Array<Reference>): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json;' });

        var body = {
            'question_set_id': topicId,
            'question': question,
            'answer': answer,
            'references': []
        };
        references.forEach(r => {
            if (r.text === null) { return; }
            body['references'].push({ 'text': r.text, 'url': r.url });
        });

        return this.http.post<any>(
            `${this.awsBasePath}/${this.addQuestionRelPath}`, body, this.httpOptions
        );
    }

    public reportQuestion(questionId: string, reason: string, description: string,
        email: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json;' });

        var body = {
            'questionId': questionId,
            'reason': reason,
            'description': description,
            'email': email
        };

        return this.http.post<any>(
            `${this.awsBasePath}/${this.reportQuestionRelPath}`, body, this.httpOptions
        );
    }
}