import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";

import { Course } from "../../models/course.model";
import { ApiService } from "../api.service";


@Injectable()
export class CourseResolver implements Resolve<Array<Course>> {
    
    constructor(private apiService: ApiService/*, private courseMocker: CourseMocker*/) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<Array<Course>> | Promise<Array<Course>> | Array<Course> {
            return this.apiService.getCourses();
    }
}