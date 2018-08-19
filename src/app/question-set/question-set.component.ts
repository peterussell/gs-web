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
      this.currentStartIndex = 0;
      this.currentEndIndex = this.currentStartIndex + this.questionSetSize;
      this.totalQuestionCount = Object.keys(this.questionSet.questions).length;
      this.updateCurrentPage();
    });
  }

  goToPreviousPage() {
    if (!this.canGoPrevious()) return;
    this.currentStartIndex -= this.questionSetSize;
    this.currentEndIndex = this.currentStartIndex + this.questionSetSize;
    this.updateCurrentPage();
  }

  goToNextPage() {
    if (!this.canGoNext()) return;
    this.currentStartIndex = this.currentStartIndex + this.questionSetSize;
    const newEndIndex = this.currentEndIndex + this.questionSetSize;
    this.currentEndIndex = newEndIndex > this.totalQuestionCount ?
      this.totalQuestionCount :
      newEndIndex;
    this.updateCurrentPage();
  }

  updateCurrentPage() {
    let result: { [id: number] : Question } = [];
    for (let i=0; i<this.currentEndIndex-this.currentStartIndex; i++) {
      result[i] = this.questionSet.questions[i+this.currentStartIndex];
    }
    this.currentPage = result;
  }

  canGoPrevious(): boolean {
    return this.currentStartIndex > 1;
  }

  canGoNext(): boolean {
    return this.currentEndIndex < this.totalQuestionCount;
  }
}
