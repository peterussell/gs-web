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
  accountSectionVisible: boolean;
  course: string;
  topic: string;

  constructor(
    public userEventsService: UserEventsService,
    public responsiveService: ResponsiveService,
    public questionService: QuestionService) { }

  ngOnInit() {
    // set up initial viewport size related things
    this.menuButtonVisible = this.responsiveService.getViewportSize() === ViewportSize.Small;
    this.accountSectionVisible = !this.menuButtonVisible;

    // subscribe to viewport size changes
    this.responsiveService.onViewportChange.subscribe((newViewportSize: ViewportSize) => {
      this.menuButtonVisible = newViewportSize === ViewportSize.Small;
      this.accountSectionVisible = !this.menuButtonVisible;
    });

    this.questionService.onTopicUpdated.subscribe((res: { course: Course, topic: Topic }) => {
      this.course = res.course.title;
      this.topic = res.topic.title;
    });
  }

  toggleSidenav() {
    this.userEventsService.toggleSidenav();
  }

  onLoginClicked() {
    console.log('login clicked');
  }
  
  onSignUpClicked() {
    console.log('signup clicked');
  }
}
