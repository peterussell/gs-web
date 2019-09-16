import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Question } from '../../core/models/question.model';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { }

  getQuestionTruncated() {
    const q: string = this.data.question.Question;
    if (q.length <= 100) {
      return q;
    } else {
      return q.substring(0, 100) + '...';
    }
  }
}
