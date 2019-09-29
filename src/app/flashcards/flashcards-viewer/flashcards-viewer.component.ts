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
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-flashcards-viewer',
  templateUrl: './flashcards-viewer.component.html',
  styleUrls: ['./flashcards-viewer.component.scss']
})
export class FlashcardsViewerComponent implements OnInit {
  @Input() subject: Subject;
  @Input() reviewSet: QuestionSet;
  @Input() viewerMode: FlashcardsViewerMode; // TODO: validate premium against cognito/dynamodb credentials
  
  @Output() complete: EventEmitter<any> = new EventEmitter<any>();

  // Premium
  public questions: Array<FlashcardsViewerQuestion>;
  public currentQuestionIndex: number;
  public currentTopicId: string;

  // Free
  private QUESTIONS_PER_SET: number = 20;
  public topicIdsSeen: Array<string> = new Array<string>();
  public questionIdsSeen: Array<string> = new Array<string>();

  public currentUser: User;
  public currentState: FlashcardsViewerState;
  public isQuestionLoading: boolean;

  private _reviewSetUpdatePending = false;
  
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
    private userService: UserService,
    private snackBar: MatSnackBar,
    private domSanitizer: DomSanitizer) {
    this.questions = new Array<FlashcardsViewerQuestion>();
  }

  ngOnInit() {
    // Load user profile & stored review set
    // May have already been loaded by another component, so check first.
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser && this.currentUser.ReviewSet) {
      this.reviewSet = this.currentUser.ReviewSet;
    } else {
      this.userService.currentUser$.subscribe((user: User) => {
        this.currentUser = user;
        if (user) {
          this.userService.getProfile(user.getCognitoUsername()).subscribe((data) => {
            user.setProfileData(data);
          });
        }
        this.currentUser = user;
      });
    }
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
  }

  isFreeMode(): boolean {
    return this.viewerMode === FlashcardsViewerMode.Free;
  }

  getReviewSet() {
    return this.currentUser.getReviewSet();
  }

  getReviewSetForCurrentTopic() {
    if (!this.currentUser) { return; }
    let rs = this.currentUser.getReviewSet();
    if (rs === undefined) { return; }

    // find any questions in the review set that are in the current topic
    let reviewSetForTopic = new QuestionSet();
    rs.Questions.forEach((rsq) => {
      if (this.questions.find((fvq) => { return fvq.Question.QuestionId === rsq.QuestionId;})) {
        reviewSetForTopic.Questions.push(rsq)
      }
    });
    return reviewSetForTopic;
  }

  currentTopicReviewSetHasQuestions() {
    const rs = this.getReviewSetForCurrentTopic();
    if (!rs.Questions) { return false; }
    return rs.Questions.length > 0;
  }

  getRandomQuestion() {
    this.isQuestionLoading = true;

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
          fvQuestion.SubTopic = res['body'].SubTopic;

          this.questions.push(fvQuestion);
          this.questionIdsSeen.push(question.QuestionId);
          this.topicIdsSeen.push(question.TopicId);

          this.currentQuestionIndex++;
        }
      },
      (error) => {
        console.log(error); // TODO: log this properly
      },
      () => {
        this.isQuestionLoading = false;
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

  isFree() {
    return this.viewerMode === FlashcardsViewerMode.Free;
  }

  isPremiumAndTopicHasQuestions() {
    return this.viewerMode === FlashcardsViewerMode.Premium
      && this.hasQuestions();
  }

  hasReviewQuestions() {
    const rs = this.getReviewSet();
    return rs !== undefined
      && rs.Questions !== undefined 
      && rs.Questions.length > 0;
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
    if (!this.currentUser) { return false; }
    const q = this.questions[this.currentQuestionIndex];
    const rs = this.currentUser.getReviewSet();
    if (q === undefined || rs === undefined) {
      return false;
    }
    return rs.containsQuestion(q.Question.QuestionId);
  }

  checkCurrentUserCanAccessReviewSet(): boolean {
    // User not logged in - show snackbar error and return
    if (!this.currentUser) {
      this.snackBar.openFromComponent(
        GsSnackbarComponent,
        {
          duration: 5000,
          data: { message: 'You must be logged in to save questions to your Review Set.' },
          panelClass: 'gs-snackbar'
        }
      );
      return false;
    }
    return true;
  }

  addToReviewSet() {
    if (!this.checkCurrentUserCanAccessReviewSet()) { return; }

    // Checks passed, trigger HTTP request to update user's review set
    this._reviewSetUpdatePending = true;
    const q = this.questions[this.currentQuestionIndex].Question;
    this.apiService.addToReviewSet(this.currentUser.getCognitoUsername(), q.QuestionId)
      .subscribe(
        (res: any) => {
          if (res['status'] === 200) {
            // sync the local review set
            this.currentUser.addToReviewSet(q);
          }
        },
        (error) => {
          if (error['status'] === 403) {
            // Review set full
            this.snackBar.openFromComponent(
              GsSnackbarComponent,
              {
                duration: 5000,
                data: {
                  // TODO: if member has a free account, display message about premium limit
                  message: 'Negative Ghostrider, your review set is full.'
                },
                panelClass: 'gs-snackbar'
              }
            );
          } else {
            console.log(error);
          }
          this._reviewSetUpdatePending = false;
        },
        () => {
          this._reviewSetUpdatePending = false;
        }
      );
  }

  removeFromReviewSet() {
    if (!this.checkCurrentUserCanAccessReviewSet()) { return; }

    // Checks passed, fire HTTP request to update user's review set
    this._reviewSetUpdatePending = true;
    const q = this.questions[this.currentQuestionIndex].Question;
    this.apiService.removeFromReviewSet(this.currentUser.getCognitoUsername(), q.QuestionId)
      .subscribe(
        (res: any) => {
          if (res['status'] === 200) {
            // sync the local review set
            this.currentUser.removeFromReviewSet(q);
          }
        },
        (error) => {
          console.log(error); // TODO: log this properly
        },
        () => {
          this._reviewSetUpdatePending = false;
        }
      );
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
    // If we already have a 'Next' question, show the question instead of
    // fetching a new one (eg. user clicked Previous then Next)
    if (this.currentQuestionIndex+1 < this.questions.length) {
      this.currentQuestionIndex++;
      return;
    }

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
  public SubTopic: string;

  hasSubTopic(): boolean {
    return this.SubTopic !== undefined && this.SubTopic !== '';
  }
}

enum FlashcardsViewerState {
  InProgress,
  ShowResults
}