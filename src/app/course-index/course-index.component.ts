import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Course } from '../core/models/course.model';
import { Subject } from '../core/models/subject.model';

@Component({
  selector: 'app-course-index',
  templateUrl: './course-index.component.html',
  styleUrls: ['./course-index.component.scss']
})
export class CourseIndexComponent implements OnInit {
  public allCourses: Array<Course>;

  constructor(private apiService: ApiService) {
    this.allCourses = new Array<Course>();
  }

  ngOnInit() {
    this.apiService.getCourses().subscribe(
      (data) => {
        let allCourses = data.Courses;
        allCourses.forEach(c => {
          this.allCourses.push(new Course(c));
        });

        if (this.allCourses) {
          this.allCourses = this.allCourses.sort((a: Course, b: Course) => {
            if (a.Order > b.Order) return 1;
            if (a.Order < b.Order) return -1;
            return 0;
          });
        }
      },
      (error) => {
        console.log(error); // TODO: log this properly
      }
    )
  }

  hasCourses() {
    return this.allCourses && this.allCourses.length > 0;
  }

  getCoursesWithPremiumSubjects(courses: Array<Course>) {
    let activeCourses = new Array<Course>();

    courses.forEach((c) => {
      if (c.Subjects.findIndex((s) => { return s.PremiumVersionAvailable; }) > -1) {
        activeCourses.push(c);
      }
    });
    return activeCourses;
  }

  getActiveSubjects(subjects: Array<Subject>) {
    let activeSubjects = new Array<Subject>();

    subjects.forEach((s) => {
      if (s.PremiumVersionAvailable) {
        activeSubjects.push(s);
      }
    });
    return activeSubjects;
  }

}
