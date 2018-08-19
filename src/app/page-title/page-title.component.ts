import { Component, OnInit } from '@angular/core';
import { UserEventsService } from '../core/services/user-events.service';
import { ResponsiveService, ViewportSize } from '../core/services/responsive.service';
import { QuestionService } from '../core/services/question.service';
import { Topic } from '../core/models/topic.model';
import { Course } from '../core/models/course.model';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent implements OnInit {
  menuButtonVisible: boolean;
  course: string;
  topic: string;

  constructor(
    public userEventsService: UserEventsService,
    public responsiveService: ResponsiveService,
    public questionService: QuestionService) { }

  ngOnInit() {
    this.menuButtonVisible = this.responsiveService.getViewportSize() === ViewportSize.Small;
    this.responsiveService.onViewportChange.subscribe((newViewportSize: ViewportSize) => {
      this.menuButtonVisible = newViewportSize === ViewportSize.Small;
    });

    this.questionService.onTopicUpdated.subscribe((res: { course: Course, topic: Topic }) => {
      this.course = res.course.title;
      this.topic = res.topic.title;
    });
  }

  toggleSidenav() {
    this.userEventsService.toggleSidenav();
  }
}
