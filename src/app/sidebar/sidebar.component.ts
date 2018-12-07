import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Course } from '../core/models/course.model';
import { Subject } from '../core/models/subject.model';
import { QuestionService } from '../core/services/question.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public courses: { [id: number]: Course };

  constructor(private apiService: ApiService,
    private questionService: QuestionService) { }

  ngOnInit() {
    this.apiService.getCourses().subscribe(res => {
      this.courses = this.sortCourses(res.courses);
    },
    (error: any) => {
      console.log(error.message);
    });
  }

  sortCourses(courses: Array<Course>): Array<Course> {
    return courses.sort((a, b) => {
      if (a.order > b.order) return 1;
      if (a.order < b.order) return -1;
      return 0;
    });
  }

  sortSubjects(subjects: Array<Subject>): Array<Subject> {
    return subjects.sort((a, b) => {
      if (a.title > b.title) return 1;
      if (a.title < b.title) return -1;
      return 0;
    });
  }
}
