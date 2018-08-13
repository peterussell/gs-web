import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { RegisterInterestResponse } from "./interfaces/register-interest-response";

@Injectable()
export class ApiService {
    private readonly basePath = 'http://localhost:4200/assets';
    private readonly awsBasePath = 'https://wbr0qbew2b.execute-api.us-west-2.amazonaws.com/prod/v1';
    private httpOptions;

    private readonly coursesRelPath = 'courses';
    private readonly questionSetsRelPath = 'question-sets';
    private readonly registerInterestRelPath = 'register-interest';

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

    public getQuestions(questionSetId: string): Observable<any> {
        return this.http.get(`${this.awsBasePath}/${this.questionSetsRelPath}/${questionSetId}`);
    }

    public registerInterest(email: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json;' });

        var body = { 'email': email };
        return this.http.post<RegisterInterestResponse>(
            `${this.awsBasePath}/${this.registerInterestRelPath}`, body, this.httpOptions
        );
    }
}