import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";

import { Course } from "../core/models/course.model";
import { ApiService } from "../core/services/api.service";
import { CourseMocker } from "../mocks/course-mocker";


@Injectable()
export class CourseResolver implements Resolve<Array<Course>> {
    
    constructor(private apiService: ApiService/*, private courseMocker: CourseMocker*/) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<Array<Course>> | Promise<Array<Course>> | Array<Course> {
            return this.apiService.getCourses();

        // tmp
        // return this.courseMocker.getCourses(2);
    }
}