import { Component, OnInit, Input } from '@angular/core';
import { UIEventsService } from '../core/services/ui-events.service';
import { ResponsiveService, ViewportSize } from '../core/services/responsive.service';
import { QuestionService } from '../core/services/question.service';
import { Subject } from '../core/models/subject.model';
import { Course } from '../core/models/course.model';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../core/services/user.service';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent implements OnInit {
  ngOnInit() { }
}
