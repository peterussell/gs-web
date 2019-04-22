import { Component, OnInit, Input } from '@angular/core';

import { Question } from '../core/models/question.model';
import { Subject } from '../core/models/subject.model';
import { Topic } from '../core/models/topic.model';
import { MatSelectChange } from '@angular/material/select';
import { ApiService } from '../core/services/api.service';
import { ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {
  // We need to subscribe to changes on the Subject Input value so we can
  // automatically load the first topic when a routerlink is clicked.
  private _subject: Subject;
  @Input()
    set subject(subject: Subject) {
      this._subject = subject;
      if (this._subject !== undefined && this._subject.topics.length > 0) {
        this._subject.topics = this._subject.topics.sort((a, b) => {
          if (a.Title < b.Title) return -1;
          if (a.Title > b.Title) return 1;
          return 0;
        });
        this.selectTopic(this._subject.topics[0]);
      }
    }
    get subject() { return this._subject; }

  public selectedTopic: Topic;
  public isLoading: boolean;
  
  // Pagination
  public currentPage: { [id: number] : Question };
  public totalQuestionCount: number;
  public currentStartIndex: number = 0;
  public currentEndIndex: number = 0;
  public topicSize: number = 10;

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.currentPage = [];
  }

  selectTopic(topic: Topic) {
    this.isLoading = true;

    this.apiService.getQuestions(topic.TopicId).subscribe(
      (topicWithQuestions: Topic) => {

        // TODO: ideally we'd just get just the questions from the API
        this.selectedTopic = topic;
        this.selectedTopic.Questions = topicWithQuestions.Questions;

        this.totalQuestionCount = Object.keys(this.selectedTopic.Questions).length;
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
      if (this.selectedTopic.Questions[i+this.currentStartIndex] === undefined) {
        // return if there are less questions than the page size
        break;
      }
      result[i] = this.selectedTopic.Questions[i+this.currentStartIndex];
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
