import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { Question } from '../../core/models/question.model';
import { ApiService } from '../../core/services/api.service';
import { ConsoleLogger } from '@aws-amplify/core';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { QuestionSet } from '../../core/models/question-set.model';
import { Subject } from '../../core/models/subject.model';
import { Topic } from '../../core/models/topic.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flashcards-viewer',
  templateUrl: './flashcards-viewer.component.html',
  styleUrls: ['./flashcards-viewer.component.scss']
})
export class FlashcardsViewerComponent implements OnInit, OnChanges {
  @Input() subject: Subject;
  @Input() reviewSet: QuestionSet;

  @Output() complete: EventEmitter<any> = new EventEmitter<any>();

  public questions: Array<FlashcardsViewerQuestion>;
  public forReview: Set<FlashcardsViewerQuestion>;
  public currentQuestionIndex: number;
  public currentTopicId: string;
  public currentState: FlashcardsViewerState;
  
  get progress(): number {
    if (this.questions === undefined || this.questions.length === 0) {
      return 0;
    }
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  };

  constructor(private router: Router, private apiService: ApiService) {
    this.questions = new Array<FlashcardsViewerQuestion>();
    this.forReview = new Set<FlashcardsViewerQuestion>();
  }

  ngOnInit() {
    this.loadQuestions();
    this.currentQuestionIndex = 0;
    this.currentState = FlashcardsViewerState.InProgress;
  }

  ngOnChanges() {
  }

  loadQuestions(selectedTopicId?: string) {
    if (!this.subject || this.subject.topics.length === 0) return;

    if (selectedTopicId === undefined || selectedTopicId === '') {
      // default to the first topic
      selectedTopicId = this.subject.topics[0].topicId;
    }

    const selectedTopic = this.subject.topics.find((t) => {
      return t.topicId === selectedTopicId;
    });

    // no topic found matching the specified topic id
    if (selectedTopic === undefined) { return; }
    
    this.setCurrentTopic(selectedTopic.topicId);
    this.questions = new Array<FlashcardsViewerQuestion>();

    for (let questionId in selectedTopic.questions) {
      let q = selectedTopic.questions[questionId];
      let fvq = new FlashcardsViewerQuestion();
      fvq.question = q;
      fvq.subjectTitle = this.subject.title;
      fvq.topicTitle = selectedTopic.title;
      this.questions.push(fvq);
    }
  }

  onMenuTopicSelected(topicId: string) {
    this.loadQuestions(topicId);
    this.currentQuestionIndex = 0;
    this.currentState = FlashcardsViewerState.InProgress;
  }

  setCurrentTopic(topicId: string) {
    if (topicId === undefined || topicId === '') { return; }
    this.currentTopicId = topicId;
  }

  hasQuestions() {
    return this.questions.length > 0;
  }

  hasReviewQuestions() {
    return this.forReview.size > 0;
  }

  canGoToNextQuestion(): boolean {
    return this.questions.length > 0 &&
      this.currentQuestionIndex < (this.questions.length -1);
  }

  isInReviewSet(question: FlashcardsViewerQuestion) {
    if (question === undefined) { return false; }
    return this.forReview.has(question);
  }

  saveForReview() {
    this.forReview.add(this.questions[this.currentQuestionIndex]);
    this.goToNextQuestion();
  }

  gotIt() {
    // remove from questions for review if it's there
    const q = this.questions[this.currentQuestionIndex];
    if (this.forReview.has(q)) {
      this.forReview.delete(q);
    }
    this.goToNextQuestion();
  }

  goToFinish() {
    this.showResults();
  }

  goToNextQuestion() {
    if (this.canGoToNextQuestion()) {
      this.currentQuestionIndex++;
    } else {
      this.showResults();
    }
  }

  canGoToPreviousQuestion() {
    return this.currentQuestionIndex > 0;
  }

  goToPreviousQuestion() {
    if (this.canGoToPreviousQuestion()) {
      this.currentQuestionIndex--;
    }
  }

  showResults() {
    this.currentState = FlashcardsViewerState.ShowResults;
  }

  isInProgress() {
    return this.currentState === FlashcardsViewerState.InProgress;
  }

  allDone() {
    this.complete.emit();
  }

  reloadTopic() {
    this.currentQuestionIndex = 0;
    this.currentState = FlashcardsViewerState.InProgress;
  }

  getCurrentTopicIndex() {
    return this.subject.topics.indexOf(
      this.subject.topics.find(t => { return t.topicId === this.currentTopicId })
    );
  }

  canGoToNextTopic() {
    return this.getCurrentTopicIndex() < this.subject.topics.length-1;
  }

  goToNextTopic() {
    this.loadQuestions(this.subject.topics[this.getCurrentTopicIndex()+1].topicId);
    this.currentQuestionIndex = 0;
    this.currentState = FlashcardsViewerState.InProgress;
  }

  goToCourseIndex() {
    this.router.navigate(['']);
  }
}

export class FlashcardsViewerQuestion {
  public question: Question;
  public subjectTitle: string;
  public topicTitle: string;
}

enum FlashcardsViewerState {
  InProgress,
  ShowResults
}