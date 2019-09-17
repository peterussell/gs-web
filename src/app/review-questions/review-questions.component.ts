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
  @Input() enablePagination: boolean = true;
  @Input() pageSize: number;
  @Input() showMoreLink: string = '';
  @Input() userId: string;

  private _reviewSetUpdatePending = false;
  private currentPage: Question[];
  private startIndex: number;
  private endIndex: number;

  constructor(private dialog: MatDialog, private apiService: ApiService) { }

  ngOnInit() {
    this.startIndex = 0;
    if (this.enablePagination && this.pageSize) {
      this.endIndex = this.getPageEndIndex();
    } else {
      if (this.reviewSet && this.reviewSet.Questions) {
        this.endIndex = this.reviewSet.Questions.length;
      } else {
        this.endIndex = 0;
      }
    }
    this.updateCurrentPage();
  }

  hasReviewQuestions() {
    return this.reviewSet !== undefined
      && this.reviewSet.Questions !== undefined 
      && this.reviewSet.Questions.length > 0;
  }

  updateCurrentPage() {
    this.currentPage = this.reviewSet.Questions
      .slice(this.startIndex, this.endIndex);
  }

  canGoToPreviousPage(): boolean {
    return this.startIndex > 0;
  }

  canGoToNextPage(): boolean {
    return this.endIndex <= this.reviewSet.Questions.length-1;
  }

  goToPreviousPage() {
    if (!this.canGoToPreviousPage()) {
      return;
    }
    this.startIndex = Math.max(0, this.startIndex-this.pageSize);
    this.endIndex = this.getPageEndIndex();
    this.updateCurrentPage();
  }

  goToNextPage() {
    if (!this.canGoToNextPage()) {
      return;
    }
    this.startIndex = this.startIndex+this.pageSize;
    this.endIndex = this.getPageEndIndex();
    this.updateCurrentPage();
  }

  // WORKING HERE
  getPageEndIndex(): number {
    let end = (this.startIndex + this.pageSize);
    if (end <= this.reviewSet.Questions.length-1) {
      return end;
    } else {
      return this.reviewSet.Questions.length;
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

                // If we're at the end of the review set and this was the only question
                // on the page, go to the previous page
                if (this.currentPage.length === 1) {
                  this.goToPreviousPage();
                }
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
            this.pageSize > 0 &&
            this.pageSize < this.reviewSet.Questions.length;
  }
}
