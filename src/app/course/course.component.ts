import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Course } from '../core/models/course.model';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  public selectedCourse: Course;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe((data: Data) => {
      const courses = data.course.courses;
      
      // Find any courses where the title matches the route path
      courses.forEach((course: Course) => {
        if (course.title.toUpperCase() === this.route.snapshot.params['title'].toUpperCase()) {
          this.selectedCourse = course;
        }
      });
    });
  }

}
