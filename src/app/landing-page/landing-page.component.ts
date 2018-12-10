import { Component, OnInit } from '@angular/core';
import { GlobalVariables } from '../../globals';
import { RegisterInterestResponse } from '../core/services/interfaces/register-interest-response';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/finally';
import { ApiService } from '../core/services/api.service';
import { Course } from '../core/models/course.model';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  public facebookUrl: string = GlobalVariables.FACEBOOK_URL;
  public allCourses: Array<Course>;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getCourses().subscribe(
      (data) => {
        this.allCourses = data.courses.sort((a, b) => {
          if (a.order > b.order) return 1;
          if (a.order < b.order) return -1;
          return 0;
        })
      },
      (error) => {
        console.log(error); // TODO: log this properly
      }
    )
  }
}