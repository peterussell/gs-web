import { Component, OnInit, Input } from '@angular/core';
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
  @Input() title: string;

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

    if (this.title === undefined || this.title === '') {
      // tmp - TODO: the question set (?) component should compile the title and pass it in as an Input
      this.questionService.onTopicUpdated.subscribe((res: { course: Course, topic: Topic }) => {
        this.title = `${res.course.title} - ${res.topic.title}`;
      });
    }
  }

  toggleSidenav() {
    this.userEventsService.toggleSidenav();
  }
}
