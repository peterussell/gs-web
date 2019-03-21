import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'aws-sdk/clients/support';
import { Router } from '@angular/router';

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
