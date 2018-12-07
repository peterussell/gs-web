import { Component, OnInit, Input } from '@angular/core';
import { UserEventsService } from '../core/services/user-events.service';
import { ResponsiveService, ViewportSize } from '../core/services/responsive.service';
import { QuestionService } from '../core/services/question.service';
import { Subject } from '../core/models/subject.model';
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
  subject: string;

  constructor(
    public userEventsService: UserEventsService,
    public responsiveService: ResponsiveService,
    public questionService: QuestionService) { }

  ngOnInit() {
    this.setupMenuButton();
  }

  setupMenuButton() {
    this.menuButtonVisible = this.responsiveService.getViewportSize() === ViewportSize.Small;
    this.responsiveService.onViewportChange.subscribe((newViewportSize: ViewportSize) => {
      this.menuButtonVisible = newViewportSize === ViewportSize.Small;
    });
  }

  toggleSidenav() {
    this.userEventsService.toggleSidenav();
  }
}
