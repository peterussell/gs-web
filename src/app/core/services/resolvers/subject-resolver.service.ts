import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";

import { Course } from "../../models/course.model";
import { ApiService } from "../api.service";
import { Subject } from "../../models/subject.model";
import { Question } from "../../models/question.model";
import { Topic } from "../../models/topic.model";


@Injectable()
export class SubjectResolver implements Resolve<Subject> {
    
    constructor(private router: Router, private apiService: ApiService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<Subject> | Promise<Subject> | Subject {
            
        const coursePath = route.params.course;
        const subjectPath = route.params.subject;

        let matchingSubject: Subject;

        return null;
    }
}