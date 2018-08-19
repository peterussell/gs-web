import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Course } from '../core/models/course.model';
import { Topic } from '../core/models/topic.model';
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
      this.courses = res.courses;
    },
    (error: any) => {
      console.log(error.message);
    });
  }

  topicSelected(course: Course, topic: Topic) {
    this.questionService.updateTopic(course, topic);
  }
}
