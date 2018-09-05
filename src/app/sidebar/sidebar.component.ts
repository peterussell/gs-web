import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Course } from '../core/models/course.model';
import { Topic } from '../core/models/topic.model';
import { QuestionService } from '../core/services/question.service';
import { QuizCourse } from '../core/models/quizzes/quiz-course.model';
import { QuizTopic } from '../core/models/quizzes/quiz-topic.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public courses: { [id: number]: Course };
  public courseQuizzes: { [id: number]: QuizCourse };

  constructor(private apiService: ApiService,
    private questionService: QuestionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getCourses();
    this.getQuizzes();
  }

  topicSelected(course: Course, topic: Topic) {
    // TODO: this should use router.navigate, or quizzes should use the service...
    this.questionService.updateTopic(course, topic);
  }

  quizTopicSelected(course: QuizCourse, topic: QuizTopic) {
    this.router.navigate(['quizzes', topic.quizTopicId]);
  }

  sortCourses(courses: Array<Course>): Array<Course> {
    return courses.sort((a, b) => {
      if (a.order > b.order) return 1;
      if (a.order < b.order) return -1;
      return 0;
    });
  }

  sortTopics(topics: Array<Topic>): Array<Topic> {
    return topics.sort((a, b) => {
      if (a.title > b.title) return 1;
      if (a.title < b.title) return -1;
      return 0;
    });
  }

  sortQuizCourses(quizzes: Array<QuizCourse>): Array<QuizCourse> {
    return quizzes.sort((a, b) => {
      if (a.order > b.order) return 1;
      if (a.order < b.order) return -1;
      return 0;
    })
  }

  private getCourses() {
    this.apiService.getCourses().subscribe(res => {
      this.courses = this.sortCourses(res.courses as Array<Course>);
      this.questionService.updateTopic(
        this.sortCourses(res.courses)[0],
        this.sortTopics(res.courses[0].topics)[0]
      );
    },
    (error: any) => {
      console.log(error.message);
    });
  }

  private getQuizzes() {
    this.apiService.getQuizCourses().subscribe(res => {
      this.courseQuizzes = this.sortQuizCourses(res.quizzes as Array<QuizCourse>);
    },
    (error: any) => {
      console.log(error.message);
    });
  }
}
