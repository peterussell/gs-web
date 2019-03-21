import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Course } from '../core/models/course.model';

@Component({
  selector: 'app-course-index',
  templateUrl: './course-index.component.html',
  styleUrls: ['./course-index.component.scss']
})
export class CourseIndexComponent implements OnInit {
  public allCourses: Array<Course>;

  constructor(private apiService: ApiService) {
  }

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
