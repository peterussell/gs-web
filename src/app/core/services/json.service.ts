import { Injectable } from "@angular/core";
import { HttpClient} from "@angular/common/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class JsonService {
    private basePath = 'http://localhost:4200/assets';
    private awsBasePath = 'https://wbr0qbew2b.execute-api.us-west-2.amazonaws.com/prod/v1';
    
    private coursesRelPath = 'courses';
    private questionSetsRelPath = 'question-sets'

    constructor(private http: HttpClient) { }

    public getCourses(): Observable<any> {
        return this.http.get(`${this.awsBasePath}/${this.coursesRelPath}`);
    }

    public getQuestions(questionSetId: string): Observable<any> {
        return this.http.get(`${this.awsBasePath}/${this.questionSetsRelPath}/${questionSetId}`);
    }
}