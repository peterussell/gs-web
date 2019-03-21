import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { Question } from '../../core/models/question.model';
import { ApiService } from '../../core/services/api.service';
import { ConsoleLogger } from '@aws-amplify/core';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { QuestionSet } from '../../core/models/question-set.model';
import { Subject } from '../../core/models/subject.model';
import { Topic } from '../../core/models/topic.model';

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
  public currentQuestionIndex: number;
  public currentState: FlashcardsViewerState;
  
  get progress(): number {
    if (this.questions === undefined || this.questions.length === 0) {
      return 0;
    }
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  };

  constructor(private apiService: ApiService) {
    this.questions = new Array<FlashcardsViewerQuestion>();
  }

  ngOnInit() {
    this.loadQuestions();
    this.currentQuestionIndex = 0;
    this.currentState = FlashcardsViewerState.InProgress;
  }

  ngOnChanges() {
  }

  loadQuestions() {
    if (!this.subject) return;
    this.subject.topics.forEach((t: Topic) => {
      for (let questionId in t.questions) {
        let q = t.questions[questionId];
        let fvq = new FlashcardsViewerQuestion();
        fvq.question = q;
        fvq.subjectTitle = this.subject.title;
        fvq.topicTitle = t.title;
        this.questions.push(fvq);
      }
    });
  }

  hasQuestions() {
    return this.questions.length > 0;
  }
  canGoToNextQuestion(): boolean {
    return this.questions.length > 0 &&
      this.currentQuestionIndex < (this.questions.length -1);
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