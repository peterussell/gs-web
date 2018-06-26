import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";

import { Course } from "../core/models/course.model";
import { QuestionService } from "../core/services/question.service";


@Injectable()
export class CourseResolver implements Resolve<Course> {
    constructor(private questionService: QuestionService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<Course> | Promise<Course> | Course {
            // tmp
            console.log('resolving some bishes');
            // TODO: this is where we should actually fetch the course from the API
            return new Course('1234', "Pete's flying course", []);
    }
}