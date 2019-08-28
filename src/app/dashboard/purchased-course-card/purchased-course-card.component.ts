import { Component, OnInit, Input } from '@angular/core';
import { Subject } from '../../core/models/subject.model';

@Component({
  selector: 'app-purchased-course-card',
  templateUrl: './purchased-course-card.component.html',
  styleUrls: ['./purchased-course-card.component.scss']
})
export class PurchasedCourseCardComponent implements OnInit {
  @Input() subject: Subject;
  @Input() parentPath: string;
  
  constructor() { }

  ngOnInit() {
  }

}
