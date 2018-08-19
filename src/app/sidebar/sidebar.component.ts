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
      this.questionService.updateTopic(
        res.courses[0],
        this.sortTopics(res.courses[0].topics)[0]
      );
    },
    (error: any) => {
      console.log(error.message);
    });
  }

  topicSelected(course: Course, topic: Topic) {
    this.questionService.updateTopic(course, topic);
  }

  sortTopics(topics: Array<Topic>): Array<Topic> {
    return topics.sort((a, b) => {
      if (a.title > b.title) return 1;
      if (a.title < b.title) return -1;
      return 0;
    })
  }
}
