import { Component, OnInit, Input } from '@angular/core';

import { Question } from '../../core/models/question.model';
import { Reference } from '../../core/models/reference.model';
import { MatDialog } from '@angular/material/dialog';
import { ReportQuestionDialogComponent } from '../report-question-dialog/report-question-dialog.component';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  @Input() question: Question;

  public questionText: string;
  public answerText: string;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.questionText = this.insertDegreeSymbols(this.question.question);
    this.answerText = this.insertDegreeSymbols(this.question.answer);
  }

  // TODO: move this to a util class
  insertDegreeSymbols(input: string): string {
    return input.replace(/&deg;/g, '°');
  }

  sortReferences(references: Array<Reference>): Array<Reference> {
    return references.sort((a, b) => {
      if (a.text.toLowerCase().startsWith('waypoints')) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  reportQuestion() {
    const dialogRef = this.dialog.open(ReportQuestionDialogComponent, {
      width: '400px',
      panelClass: 'container-no-padding',
      data: { question: this.question }
    });
  }
}
