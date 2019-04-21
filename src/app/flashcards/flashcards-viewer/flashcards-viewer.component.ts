import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { Question } from '../../core/models/question.model';
import { ApiService } from '../../core/services/api.service';
import { ConsoleLogger } from '@aws-amplify/core';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { QuestionSet } from '../../core/models/question-set.model';
import { Subject } from '../../core/models/subject.model';
import { Topic } from '../../core/models/topic.model';
import { Router } from '@angular/router';
import { FlashcardsViewerMode } from '../flashcards-shared';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GsSnackbarComponent } from '../../gs-snackbar/gs-snackbar.component';

@Component({
  selector: 'app-flashcards-viewer',
  templateUrl: './flashcards-viewer.component.html',
  styleUrls: ['./flashcards-viewer.component.scss']
})
export class FlashcardsViewerComponent implements OnInit, OnChanges {
  @Input() subject: Subject;
  @Input() reviewSet: QuestionSet;
  @Input() viewerMode: FlashcardsViewerMode; // TODO: validate premium against cognito/dynamodb credentials

  @Output() complete: EventEmitter<any> = new EventEmitter<any>();

  // Premium
  public questions: Array<FlashcardsViewerQuestion>;
  public forReview: { [topicId: string]: Set<FlashcardsViewerQuestion> };
  public currentQuestionIndex: number;
  public currentTopicId: string;

  // Free
  public topicIdsSeen: Array<string> = new Array<string>();
  public questionIdsSeen: Array<string> = new Array<string>();
  public currentQuestion: Question;

  public currentState: FlashcardsViewerState;
  
  get progress(): number {
    if (this.questions === undefined || this.questions.length === 0) {
      return 0;
    }
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  };

  constructor(
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar) {
    this.questions = new Array<FlashcardsViewerQuestion>();
  }

  ngOnInit() {
    this.doModeDependentInit();
  }
  
  doModeDependentInit() {
    if (this.viewerMode === FlashcardsViewerMode.Free) {
      this.initFreeMode();
    } else if (this.viewerMode === FlashcardsViewerMode.Premium) {
      this.initPremiumMode();
    }
    this.currentQuestionIndex = 0;
    this.currentState = FlashcardsViewerState.InProgress;
  }

  initFreeMode() {
    // free tier - get a random question, include all topics in this subject
    const topicIdsToInclude: Array<string> = new Array<string>();
    this.subject.topics.forEach((t: Topic) => {
      topicIdsToInclude.push(t.topicId);
    });

    this.apiService.getRandomQuestion(
      topicIdsToInclude,
      this.topicIdsSeen,
      this.questionIdsSeen).subscribe((res: any) => {
        this.currentQuestion = res.body.Question;
        console.log(this.currentQuestion);
    });
  }

  initPremiumMode() {
    this.loadQuestions();
    this.initialiseReviewSets();
  }

  ngOnChanges() {
  }

  isFreeMode(): boolean {
    return this.viewerMode === FlashcardsViewerMode.Free;
  }

  initialiseReviewSets() {
    this.forReview = {};
    this.subject.topics.forEach((t: Topic) => {
      this.forReview[t.topicId] = new Set<FlashcardsViewerQuestion>();
    });
  }

  getReviewSet(topicId: string) {
    if (topicId in this.forReview) {
      return this.forReview[topicId];
    }
  }

  getCurrentReviewSet() {
    return this.getReviewSet(this.currentTopicId);
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
    const crs = this.getCurrentReviewSet();
    return crs !== undefined && crs.size > 0;
  }

  canGoToNextQuestion(): boolean {
    return this.questions.length > 0 &&
      this.currentQuestionIndex < (this.questions.length -1);
  }

  isCurrentQuestionInReviewSet() {
    const q = this.questions[this.currentQuestionIndex];
    if (q === undefined) { return false; }

    for (let reviewQuestion of Array.from(this.getCurrentReviewSet())) {
      if (reviewQuestion.question.questionId === q.question.questionId) {
        return true;
      }
    }
  }

  saveForReview() {
    if (this.isFreeMode()) {
      this.snackBar.openFromComponent(
        GsSnackbarComponent,
        {
          duration: 5000,
          data: {
            message: 'Become a GroundSchool member to access Review Sets',
            linkText: 'Learn more',
            linkUrl: '/membership'
          },
          panelClass: 'gs-snackbar'
        }
      );
      return;
    }
    this.getCurrentReviewSet().add(this.questions[this.currentQuestionIndex]);
  }

  removeFromForReview() {
    const q = this.questions[this.currentQuestionIndex];
    this.getCurrentReviewSet().forEach((reviewQuestion: FlashcardsViewerQuestion) => {
      if (reviewQuestion.question.questionId === q.question.questionId) {
        this.getCurrentReviewSet().delete(reviewQuestion);
      }
    });
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
    this.setCurrentTopic(this.subject.topics[this.getCurrentTopicIndex()+1].topicId);
    this.loadQuestions(this.currentTopicId);
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