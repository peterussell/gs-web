import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subject } from '../core/models/subject.model';
import { Course } from '../core/models/course.model';
import { Topic } from '../core/models/topic.model';
import { ApiService } from '../core/services/api.service';
import { QuestionService } from '../core/services/question.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  public allCourses: Array<Course>;
  public selectedSubject: Subject;
  public title: string;

  private coursePath: string;
  private subjectPath: string;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.updatePathsForNewRoute();
    this.subscribeToRouteChanges();
  }

  updatePathsForNewRoute() {
    this.coursePath = this.route.snapshot.params.course;
    this.subjectPath = this.route.snapshot.params.subject;
  }

  subscribeToRouteChanges() {
    this.route.params.subscribe((data) => {
      this.coursePath = data.course;
      this.subjectPath = data.subject;
    });

    this.route.data.subscribe((data: Data) => {
      this.allCourses = data.course.courses;
      this.loadSubjectForCurrentPath();
    });
  }

  loadSubjectForCurrentPath() {
    const course = this.allCourses.find(c => c.Path === this.coursePath);
    if (course === undefined) { this.router.navigate(['/']); }

    const subject = course.Subjects.find(s => s.Path === this.subjectPath);
    if (subject === undefined) { this.router.navigate(['/']); }

    this.selectedSubject = subject;
    this.updateTitle(course.Title, subject.Title);
  }

  updateTitle(courseTitle: string, subjectTitle: string) {
    this.title = `${courseTitle} ${subjectTitle}`;
  }
}
