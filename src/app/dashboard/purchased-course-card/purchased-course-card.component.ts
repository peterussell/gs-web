import { Component, OnInit, Input } from '@angular/core';
import { Subject } from '../../core/models/subject.model';

import * as moment from 'moment';

@Component({
  selector: 'app-purchased-course-card',
  templateUrl: './purchased-course-card.component.html',
  styleUrls: ['./purchased-course-card.component.scss']
})
export class PurchasedCourseCardComponent implements OnInit {
  @Input() subject: Subject;
  @Input() parentPath: string;
  @Input() expiryDate: Date;
  
  constructor() { }

  ngOnInit() {
  }

  getExpiryDate(): string {
    if (!this.expiryDate) {
      return '';
    }
    return moment(this.expiryDate).format('DD MMM YY');
  }
}
