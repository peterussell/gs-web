import { Component, OnInit } from '@angular/core';
import { UserEventsService } from '../core/services/user-events.service';
import { ResponsiveService, ViewportSize } from '../core/services/responsive.service';
import { QuestionService } from '../core/services/question.service';
import { Topic } from '../core/models/topic.model';
import { Course } from '../core/models/course.model';
import { MatDialog } from '@angular/material/dialog';
import { AccountDialogState, AccountDialogComponent } from '../account-dialog/account-dialog.component';
import { UserService } from '../core/services/user.service';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { User } from '../core/models/user.model';

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
  currentUser: User;

  constructor(
    public dialog: MatDialog,
    public userService: UserService,
    public userEventsService: UserEventsService,
    public responsiveService: ResponsiveService,
    public questionService: QuestionService) {
      this.currentUser = this.userService.getCurrentUser();
    }

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
    const dialogRef = this.dialog.open(AccountDialogComponent, {
      width: '380px',
      panelClass: 'container-no-padding',
      position: { top: '30px' },
      data: { initialState: AccountDialogState.Login }
    });
  }

  onSignUpClicked() {
    const dialogRef = this.dialog.open(AccountDialogComponent, {
      width: '380px',
      panelClass: 'container-no-padding',
      position: { top: '30px' },
      data: { initialState: AccountDialogState.Register }
    });
  }
}
