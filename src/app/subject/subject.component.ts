import { Component, OnInit, Input } from '@angular/core';

import { Question } from '../core/models/question.model';
import { Subject } from '../core/models/subject.model';
import { Topic } from '../core/models/topic.model';
import { MatSelectChange } from '@angular/material/select';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {
  @Input() subject: Subject;
  public selectedTopic: Topic;
  public isLoading: boolean;
  
  // Pagination
  public currentPage: { [id: number] : Question };
  public totalQuestionCount: number;
  public currentStartIndex: number = 0;
  public currentEndIndex: number = 0;
  public topicSize: number = 10;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.currentPage = [];
    if (this.subject !== undefined && this.subject.topics.length > 0) {
      this.selectTopic(this.subject.topics[0]);
    }
    // this.questionService.onQuestionsUpdated.subscribe((topic: Topic) => {
    //   this.topic = topic;
    //   this.totalQuestionCount = Object.keys(this.topic.questions).length;
    //   this.currentStartIndex = 0;
    //   this.currentEndIndex = Math.min(this.currentStartIndex + this.topicSize, this.totalQuestionCount);
    //   this.updateCurrentPage();
    // });
  }

  selectTopic(topic: Topic) {
    this.isLoading = true;

    this.apiService.getQuestions(topic.topicId).subscribe(
      (topicWithQuestions: Topic) => {
        this.selectedTopic = topicWithQuestions;
        this.totalQuestionCount = Object.keys(this.selectedTopic.questions).length;
        this.currentStartIndex = 0;
        this.currentEndIndex = Math.min(this.currentStartIndex + this.topicSize, this.totalQuestionCount);
        this.updateCurrentPage();
        this.isLoading = false;
      });
  }

  // Material event handlers
  matSelectTopic(event: MatSelectChange) {
    this.selectTopic(event.value);
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
      if (this.selectedTopic.questions[i+this.currentStartIndex] === undefined) {
        // return if there are less questions than the page size
        break;
      }
      result[i] = this.selectedTopic.questions[i+this.currentStartIndex];
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
