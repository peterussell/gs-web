import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FlashcardsViewerQuestion } from '../flashcards-viewer.component';
import { Reference } from '../../../core/models/reference.model';
import { ApiService } from '../../../core/services/api.service';
import { UserService } from '../../../core/services/user.service';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { QuestionSet } from '../../../core/models/question-set.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-flashcards-card',
  templateUrl: './flashcards-card.component.html',
  styleUrls: ['./flashcards-card.component.scss']
})
export class FlashcardsCardComponent implements OnInit, OnChanges {
  @Input() flashcardViewerQuestion: FlashcardsViewerQuestion;
  @Input() questionNumber: number;
  @Input() numberOfQuestions: number;
  @Input() isInReviewSet: boolean;
  @Input() isQuestionLoading: boolean;
  
  private currentState: FlashcardViewerState;
  private currentUser: User;
  private reviewSet: QuestionSet;

  constructor(
    private snackBar: MatSnackBar,
    public apiService: ApiService,
    public userService: UserService) { }

  ngOnInit() {
    this.userService.currentUser$.subscribe(
      (newUser: User) => {
        this.currentUser = newUser;

        // TODO: needs to be updated with the new User model, deferring since this isn't in use yet
        // (should just be user.CognitoUser['username'])
        // if (newUser) {
        //   this.apiService.getReviewSetForUser(this.currentUser['username']).subscribe(
        //     (reviewSet: QuestionSet) => {
        //     this.reviewSet = reviewSet;
        //   });
        // }
      }
    );
  }

  ngOnChanges() {
    if (this.flashcardViewerQuestion !== undefined) {
      this.flashcardViewerQuestion.Question.Question =
        this.insertDegreeSymbols(this.flashcardViewerQuestion.Question.Question);

      this.flashcardViewerQuestion.Question.Answer = 
        this.insertDegreeSymbols(this.flashcardViewerQuestion.Question.Answer);
    }
    this.currentState = FlashcardViewerState.Question;
  }

  // TODO: move this to a util class
  insertDegreeSymbols(input: string): string {
    return input.replace(/&deg;/g, '°');
  }

  sortReferences(references: Array<Reference>): Array<Reference> {
    return references.sort((a, b) => {
      // Waypoints references should always come first
      if (a.Text.toLowerCase().startsWith('waypoints')) {
        return -1;
      }
      return 1;
    });
  }

  toggleState() {
    if (this.isQuestionState()) {
      this.currentState = FlashcardViewerState.Answer;
    } else if (this.isAnswerState()) {
      this.currentState = FlashcardViewerState.Question;
    }
  }

  isQuestionState(): boolean {
    return this.currentState === FlashcardViewerState.Question;
  }

  isAnswerState(): boolean {
    return this.currentState === FlashcardViewerState.Answer;
  }

  // isInReviewSet() {
  //   if (this.reviewSet === undefined || this.reviewSet.QuestionIds === undefined) {
  //     return false;
  //   }

  //   return this.reviewSet.QuestionIds.indexOf(
  //     this.flashcardViewerQuestion.question.questionId) > -1;
  // }

  addToReviewSet() {
    if (this.currentUser === null) {
      // TODO: working here - show snackbar with 'login required'
      this.snackBar.open(
        'Please sign in to add questions to a review list.',
        null,
        {
          duration: 3000,
          panelClass: 'gs-snackbar-warning'
        }
      );
      return;
    }
    this.apiService.addToReviewSet(
      this.currentUser['username'],
      this.reviewSet.QuestionSetId,
      this.flashcardViewerQuestion.Question.QuestionId
    );
  }

  removeFromReviewSet() {
    if (this.currentUser === null) {
      return;
    }
    this.apiService.removeFromReviewSet(
      this.currentUser['username'],
      this.reviewSet.QuestionSetId,
      this.flashcardViewerQuestion.Question.QuestionId
    );
  }

  showAccountDialog() {
    
  }
}

enum FlashcardViewerState {
  Question,
  Answer,
  Loading
}
