import { Component, OnInit } from '@angular/core';

import { Topic } from '../core/models/topic.model';
import { QuestionService } from '../core/services/question.service';
import { Question } from '../core/models/question.model';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {
  public topic: Topic;
  public currentPage: { [id: number] : Question };

  // Pagination
  public totalQuestionCount: number;
  public currentStartIndex: number = 0;
  public currentEndIndex: number = 0;
  public topicSize: number = 10;

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    this.currentPage = [];
    this.questionService.onQuestionsUpdated.subscribe((topic: Topic) => {
      this.topic = topic;
      this.totalQuestionCount = Object.keys(this.topic.questions).length;
      this.currentStartIndex = 0;
      this.currentEndIndex = Math.min(this.currentStartIndex + this.topicSize, this.totalQuestionCount);
      this.updateCurrentPage();
    });
  }

  goToPreviousPage() {
    if (!this.canGoPrevious()) return;
    this.currentStartIndex -= this.topicSize;
    this.currentEndIndex = Math.min(this.currentStartIndex + this.topicSize, this.totalQuestionCount);
    this.updateCurrentPage();
  }

  goToNextPage() {
    if (!this.canGoNext()) return;
    this.currentStartIndex = this.currentStartIndex + this.topicSize;
    const newEndIndex = Math.min(this.currentEndIndex + this.topicSize, this.totalQuestionCount);
    this.currentEndIndex = newEndIndex > this.totalQuestionCount ?
      this.totalQuestionCount :
      newEndIndex;
    this.updateCurrentPage();
  }

  updateCurrentPage() {
    let result: { [id: number] : Question } = [];

    for (let i=0; i<this.currentEndIndex-this.currentStartIndex; i++) {
      if (this.topic.questions[i+this.currentStartIndex] === undefined) {
        // return if there are less questions than the page size
        break;
      }
      result[i] = this.topic.questions[i+this.currentStartIndex];
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
