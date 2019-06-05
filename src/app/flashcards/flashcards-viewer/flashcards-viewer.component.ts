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
import { DomSanitizer } from '@angular/platform-browser';

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
  private QUESTIONS_PER_SET: number = 20;
  public topicIdsSeen: Array<string> = new Array<string>();
  public questionIdsSeen: Array<string> = new Array<string>();

  public currentState: FlashcardsViewerState;
  
  get progress() : number {
    if (this.questions === undefined || this.questions.length === 0) { return 0; }

    if (this.viewerMode === FlashcardsViewerMode.Free) {
      return this.getProgressForFreeMode();
    } else if (this.viewerMode === FlashcardsViewerMode.Premium) {
      return this.getProgressForPremiumMode();
    }
  };

  private getProgressForFreeMode() : number {
    return ((this.currentQuestionIndex + 1) / this.QUESTIONS_PER_SET) * 100;
  }

  private getProgressForPremiumMode() : number {
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

  constructor(
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private domSanitizer: DomSanitizer) {
    this.questions = new Array<FlashcardsViewerQuestion>();
  }

  ngOnInit() {
    this.initialise();
  }
  
  initialise() {
    this.currentQuestionIndex = -1;
    if (this.viewerMode === FlashcardsViewerMode.Free) {
      this.initFreeMode();
    } else if (this.viewerMode === FlashcardsViewerMode.Premium) {
      this.initPremiumMode();
    }
    this.currentState = FlashcardsViewerState.InProgress;
  }

  initFreeMode() {
    this.getRandomQuestion();
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
    this.subject.Topics.forEach((t: Topic) => {
      this.forReview[t.TopicId] = new Set<FlashcardsViewerQuestion>();
    });
  }

  getReviewSet(topicId: string) {
    if (this.forReview === undefined) return undefined;
    if (topicId in this.forReview) {
      return this.forReview[topicId];
    }
  }

  getCurrentReviewSet() {
    return this.getReviewSet(this.currentTopicId);
  }

  getRandomQuestion() {
    const topicIdsToInclude: Array<string> = new Array<string>();
    this.subject.Topics.forEach((t: Topic) => {
      topicIdsToInclude.push(t.TopicId);
    });

    this.apiService.getRandomQuestion(
      topicIdsToInclude,
      this.topicIdsSeen,
      this.questionIdsSeen,
      this.subject.Version).subscribe((res: any) => {
        if (res['status'] === 200) {
          const question = res['body'].Question;
          if (question === undefined)
          {
            return;
          }

          let fvQuestion = new FlashcardsViewerQuestion();
          fvQuestion.Question = question;
          fvQuestion.SubjectTitle = res['body'].SubjectTitle;
          fvQuestion.TopicTitle = res['body'].TopicTitle;

          this.questions.push(fvQuestion);
          this.questionIdsSeen.push(question.QuestionId);
          this.topicIdsSeen.push(question.TopicId);

          this.currentQuestionIndex++;
        }
      },
      (error) => {
        console.log(error); // TODO: log this properly
      }
    );
  }

  loadQuestions(selectedTopicId?: string) {
    if (!this.subject || this.subject.Topics.length === 0) return;

    if (selectedTopicId === undefined || selectedTopicId === '') {
      // default to the first topic
      selectedTopicId = this.subject.Topics[0].TopicId;
    }

    const selectedTopic = this.subject.Topics.find((t) => {
      return t.TopicId === selectedTopicId;
    });

    // no topic found matching the specified topic id
    if (selectedTopic === undefined) { return; }
    
    this.setCurrentTopic(selectedTopic.TopicId);
    this.questions = new Array<FlashcardsViewerQuestion>();

    for (let questionId in selectedTopic.Questions) {
      let q = selectedTopic.Questions[questionId];
      let fvq = new FlashcardsViewerQuestion();
      fvq.Question = q;
      fvq.SubjectTitle = this.subject.Title;
      fvq.TopicTitle = selectedTopic.Title;
      this.questions.push(fvq);
    }
    this.currentQuestionIndex++;
  }

  getNumberOfQuestions() {
    if (this.viewerMode === FlashcardsViewerMode.Free) {
      return this.QUESTIONS_PER_SET;
    } else if (this.viewerMode === FlashcardsViewerMode.Premium) {
      return this.questions.length;
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
    if (this.viewerMode === FlashcardsViewerMode.Free) {
      return this.canGoToNextQuestionFreeMode();
    } else if (this.viewerMode === FlashcardsViewerMode.Premium) {
      return this.canGoToNextQuestionPremiumMode();
    }
  }

  canGoToNextQuestionFreeMode(): boolean {
    return this.questions.length > 0 &&
      this.currentQuestionIndex < (this.QUESTIONS_PER_SET - 1);
  }

  canGoToNextQuestionPremiumMode(): boolean {
    return this.questions.length > 0 &&
      this.currentQuestionIndex < (this.questions.length -1);
  }

  isCurrentQuestionInReviewSet() {
    const q = this.questions[this.currentQuestionIndex];
    if (q === undefined) { return false; }

    let crs = this.getCurrentReviewSet();
    if (crs === undefined) return false;

    for (let reviewQuestion of Array.from(this.getCurrentReviewSet())) {
      if (reviewQuestion.Question.QuestionId === q.Question.QuestionId) {
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
            message: 'Become a GroundSchool NZ premium member to access Review Sets',
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
      if (reviewQuestion.Question.QuestionId === q.Question.QuestionId) {
        this.getCurrentReviewSet().delete(reviewQuestion);
      }
    });
  }

  goToFinish() {
    this.showResults();
  }

  goToNextQuestion() {
    if (!this.canGoToNextQuestion()) {
      this.showResults();
      return;
    }

    if (this.viewerMode === FlashcardsViewerMode.Free) {
      return this.goToNextQuestionFreeMode();
    } else if (this.viewerMode === FlashcardsViewerMode.Premium) {
      return this.goToNextQuestionPremiumMode();
    }
  }

  goToNextQuestionFreeMode() {
    this.getRandomQuestion();
  }

  goToNextQuestionPremiumMode() {
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

  getCurrentTopic() {
    if (this.subject === undefined || this.subject.Topics.length === 0) {
      return null;
    }
    return this.subject.Topics[this.getCurrentTopicIndex()];
  }

  getCurrentTopicIndex() {
    return this.subject.Topics.indexOf(
      this.subject.Topics.find(t => { return t.TopicId === this.currentTopicId })
    );
  }

  canGoToNextTopic() {
    return this.getCurrentTopicIndex() < this.subject.Topics.length-1;
  }

  goToNextTopic() {
    this.setCurrentTopic(this.subject.Topics[this.getCurrentTopicIndex()+1].TopicId);
    this.loadQuestions(this.currentTopicId);
    this.currentQuestionIndex = 0;
    this.currentState = FlashcardsViewerState.InProgress;
  }

  goToCourseIndex() {
    this.router.navigate(['']);
  }

  restartFree() {
    this.router.navigate([this.router.url]);
  }

  public getRandomVideoUrl() {
    const youtubeUrl = 'https://www.youtube.com/embed?v=kLzXLW0XDRU&list=PL0C290BA5F9B3FEC3&index=';
    const min = Math.ceil(32);
    const max = Math.floor(1);
    const videoIndex = Math.floor(Math.random() * (max - min + 1)) + min;

    return this.domSanitizer.bypassSecurityTrustResourceUrl(youtubeUrl + videoIndex);
  }
}

export class FlashcardsViewerQuestion {
  public Question: Question;
  public SubjectTitle: string;
  public TopicTitle: string;
}

enum FlashcardsViewerState {
  InProgress,
  ShowResults
}