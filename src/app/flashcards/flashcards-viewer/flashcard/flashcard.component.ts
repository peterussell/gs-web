import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FlashcardsViewerQuestion } from '../flashcards-viewer.component';
import { Reference } from '../../../core/models/reference.model';
import { ApiService } from '../../../core/services/api.service';
import { UserService } from '../../../core/services/user.service';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { QuestionSet } from '../../../core/models/question-set.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss']
})
export class FlashcardComponent implements OnInit, OnChanges {
  @Input() flashcardViewerQuestion: FlashcardsViewerQuestion;
  @Input() questionNumber: number;
  @Input() numberOfQuestions: number;
  
  private currentState: FlashcardViewerState;
  private currentUser: CognitoUser;
  private reviewSet: QuestionSet;

  constructor(
    private snackBar: MatSnackBar,
    public apiService: ApiService,
    public userService: UserService) { }

  ngOnInit() {
    this.userService.currentUser$.subscribe(
      (newUser: CognitoUser) => {
        this.currentUser = newUser;

        if (newUser) {
          this.apiService.getReviewSetForUser(this.currentUser['username']).subscribe(
            (reviewSet: QuestionSet) => {
            this.reviewSet = reviewSet;
          });
        }
      }
    );
  }

  ngOnChanges() {
    if (this.flashcardViewerQuestion !== undefined) {
      this.flashcardViewerQuestion.question.question =
        this.insertDegreeSymbols(this.flashcardViewerQuestion.question.question);

      this.flashcardViewerQuestion.question.answer = 
        this.insertDegreeSymbols(this.flashcardViewerQuestion.question.answer);
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

  isInReviewSet() {
    if (this.reviewSet === undefined || this.reviewSet.QuestionIds === undefined) {
      return false;
    }

    return this.reviewSet.QuestionIds.indexOf(
      this.flashcardViewerQuestion.question.questionId) > -1;
  }

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
      this.flashcardViewerQuestion.question.questionId
    );
  }

  removeFromReviewSet() {
    if (this.currentUser === null) {
      return;
    }
    this.apiService.removeFromReviewSet(
      this.currentUser['username'],
      this.reviewSet.QuestionSetId,
      this.flashcardViewerQuestion.question.questionId
    );
  }

  showAccountDialog() {
    
  }
}

enum FlashcardViewerState {
  Question,
  Answer
}
