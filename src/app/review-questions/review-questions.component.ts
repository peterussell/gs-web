import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { QuestionSet } from '../core/models/question-set.model';
import { Question } from '../core/models/question.model';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-review-questions',
  templateUrl: './review-questions.component.html',
  styleUrls: ['./review-questions.component.scss']
})
export class ReviewQuestionsComponent implements OnInit {
  @Input() reviewSet: QuestionSet;
  @Input() showActionButtons: boolean = false;
  @Input() maxQuestions: number;
  @Input() showMoreLink: string = '';
  @Input() userId: string;

  private _reviewSetUpdatePending = false;

  constructor(private dialog: MatDialog, private apiService: ApiService) { }

  ngOnInit() {
  }

  hasReviewQuestions() {
    return this.reviewSet !== undefined
      && this.reviewSet.Questions !== undefined 
      && this.reviewSet.Questions.length > 0;
  }

  getReviewQuestions() {
    if (!this.shouldDisplayShowMoreLink()) {
      return this.reviewSet.Questions;
    } else {
      return this.reviewSet.Questions.slice(0, this.maxQuestions);
    }
  }

  deleteReviewQuestion(question: Question) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      panelClass: '',
      position: { top: '30px' },
      autoFocus: false,
      data: { question: question }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this._reviewSetUpdatePending = true;
        this.apiService.removeFromReviewSet(this.userId, question.QuestionId)
          .subscribe(
            (res: any) => {
              if (res['status'] === 200) {
                // sync the local review set
                this.removeFromLocalReviewSet(question.QuestionId);
              }
            },
            (error) => {
              console.log(error); // TODO: log this properly
            },
            () => {
              this._reviewSetUpdatePending = false;
            }
          );
      }
    });
  }

  removeFromLocalReviewSet(questionId: string) {
    const rs = this.reviewSet;
    this.reviewSet.Questions = rs.Questions.filter((q: Question) => {
      return q.QuestionId !== questionId;
    });
  }

  shouldDisplayShowMoreLink() {
    return  this.showMoreLink &&
            this.maxQuestions > 0 &&
            this.maxQuestions < this.reviewSet.Questions.length;
  }
}
