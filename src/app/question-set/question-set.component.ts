import { Component, OnInit } from '@angular/core';

import { QuestionSet } from '../core/models/question-set.model';
import { QuestionService } from '../core/services/question.service';
import { Question } from '../core/models/question.model';

@Component({
  selector: 'app-question-set',
  templateUrl: './question-set.component.html',
  styleUrls: ['./question-set.component.scss']
})
export class QuestionSetComponent implements OnInit {
  public questionSet: QuestionSet;
  public currentPage: { [id: number] : Question };

  // Pagination
  public totalQuestionCount: number;
  public currentStartIndex: number = 0;
  public currentEndIndex: number = 0;
  public questionSetSize: number = 10;

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    this.currentPage = [];
    this.questionService.onQuestionsUpdated.subscribe((questionSet: QuestionSet) => {
      this.questionSet = questionSet;
      this.totalQuestionCount = Object.keys(this.questionSet.questions).length;
      this.currentStartIndex = 0;
      this.currentEndIndex = Math.min(this.currentStartIndex + this.questionSetSize, this.totalQuestionCount);
      this.updateCurrentPage();
    });
  }

  goToPreviousPage() {
    if (!this.canGoPrevious()) return;
    this.currentStartIndex -= this.questionSetSize;
    this.currentEndIndex = Math.min(this.currentStartIndex + this.questionSetSize, this.totalQuestionCount);
    this.updateCurrentPage();
  }

  goToNextPage() {
    if (!this.canGoNext()) return;
    this.currentStartIndex = this.currentStartIndex + this.questionSetSize;
    const newEndIndex = Math.min(this.currentEndIndex + this.questionSetSize, this.totalQuestionCount);
    this.currentEndIndex = newEndIndex > this.totalQuestionCount ?
      this.totalQuestionCount :
      newEndIndex;
    this.updateCurrentPage();
  }

  updateCurrentPage() {
    let result: { [id: number] : Question } = [];

    for (let i=0; i<this.currentEndIndex-this.currentStartIndex; i++) {
      if (this.questionSet.questions[i+this.currentStartIndex] === undefined) {
        // return if there are less questions than the page size
        break;
      }
      result[i] = this.questionSet.questions[i+this.currentStartIndex];
    }
    this.currentPage = result;
  }

  currentPageHasQuestions(): boolean {
    return this.currentPage !== null && Object.keys(this.currentPage).length > 0;
  }

  canGoPrevious(): boolean {
    return this.currentStartIndex > 1;
  }

  canGoNext(): boolean {
    return this.currentEndIndex < this.totalQuestionCount;
  }
}
