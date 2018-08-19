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
  public QuestionSet: QuestionSet;
  public CurrentPage: { [id: number] : Question };

  // Pagination
  public TotalQuestionCount: number;
  public CurrentStartIndex: number = 0;
  public CurrentEndIndex: number = 0;
  public QuestionSetSize: number = 10;

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    this.CurrentPage = [];
    this.questionService.onQuestionsUpdated.subscribe((questionSet: QuestionSet) => {
      this.QuestionSet = questionSet;
      this.CurrentStartIndex = 0;
      this.CurrentEndIndex = this.CurrentStartIndex + this.QuestionSetSize;
      this.TotalQuestionCount = Object.keys(this.QuestionSet.Questions).length;
      this.updateCurrentPage();
    });
  }

  goToPreviousPage() {
    if (!this.canGoPrevious()) return;
    this.CurrentStartIndex -= this.QuestionSetSize;
    this.CurrentEndIndex = this.CurrentStartIndex + this.QuestionSetSize;
    this.updateCurrentPage();
  }

  goToNextPage() {
    if (!this.canGoNext()) return;
    this.CurrentStartIndex = this.CurrentStartIndex + this.QuestionSetSize;
    const newEndIndex = this.CurrentEndIndex + this.QuestionSetSize;
    this.CurrentEndIndex = newEndIndex > this.TotalQuestionCount ?
      this.TotalQuestionCount :
      newEndIndex;
    this.updateCurrentPage();
  }

  updateCurrentPage() {
    let result: { [id: number] : Question } = [];
    for (let i=0; i<this.CurrentEndIndex-this.CurrentStartIndex; i++) {
      result[i] = this.QuestionSet.Questions[i+this.CurrentStartIndex];
    }
    this.CurrentPage = result;
  }

  canGoPrevious(): boolean {
    return this.CurrentStartIndex > 1;
  }

  canGoNext(): boolean {
    return this.CurrentEndIndex < this.TotalQuestionCount;
  }
}
