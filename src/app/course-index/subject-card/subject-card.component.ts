import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from '../../core/models/subject.model';

@Component({
  selector: 'app-subject-card',
  templateUrl: './subject-card.component.html',
  styleUrls: ['./subject-card.component.scss']
})
export class SubjectCardComponent implements OnInit {
  @Input() subject: Subject;
  @Input() parentPath: string;

  constructor(private router: Router) { }

  ngOnInit() {
  }
}
