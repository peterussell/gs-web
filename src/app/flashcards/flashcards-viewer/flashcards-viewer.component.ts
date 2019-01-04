import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Question } from '../../core/models/question.model';
import { ApiService } from '../../core/services/api.service';
import { ConsoleLogger } from '@aws-amplify/core';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { QuestionSet } from '../../core/models/question-set.model';

@Component({
  selector: 'app-flashcards-viewer',
  templateUrl: './flashcards-viewer.component.html',
  styleUrls: ['./flashcards-viewer.component.scss']
})
export class FlashcardsViewerComponent implements OnChanges {
  @Input() numberOfQuestions: number;
  @Input() topicIdsToInclude: Array<string>;
  @Input() reviewSet: QuestionSet;

  @Output() complete: EventEmitter<any> = new EventEmitter<any>();

  public questions: Array<FlashcardsViewerQuestion>;
  public questionIdsSeen: Array<string>;
  public topicIdsSeen: Array<string>;

  public currentQuestionIndex: number;
  get progress(): number {
    if (this.questions.length === 0) {
      return 0;
    }
    return ((this.currentQuestionIndex + 1) / this.numberOfQuestions) * 100;
  };

  public currentState: FlashcardsViewerState;

  constructor(private apiService: ApiService) {
    this.questions = new Array<FlashcardsViewerQuestion>();
    this.questionIdsSeen = new Array<string>();
    this.topicIdsSeen = new Array<string>();
    this.currentQuestionIndex = 0;
    this.currentState = FlashcardsViewerState.InProgress;
  }

  ngOnChanges() {
    this.getNextQuestion(false); // Don't progress for the first question
  }

  canGoToNextQuestion(): boolean {
    return this.currentQuestionIndex < (this.numberOfQuestions - 1);
  }

  goToNextQuestion() {
    if (this.canGoToNextQuestion()) {

      // Don't fetch a new question if we already have it
      // eg. after clicking Previous then Next
      if (this.nextQuestionIsAlreadyInStore()) {
        this.currentQuestionIndex++;
        return;
      }
      this.getNextQuestion(true);
    } else {
      this.showResults();
    }
  }

  nextQuestionIsAlreadyInStore(): boolean {
    return this.currentQuestionIndex < this.questions.length - 1;
  }

  canGoToPreviousQuestion() {
    return this.currentQuestionIndex > 0;
  }

  goToPreviousQuestion() {
    if (this.canGoToPreviousQuestion()) {
      this.currentQuestionIndex--;
    }
  }

  private getNextQuestion(shouldProgress: boolean) {
    this.apiService.getRandomQuestion(
      this.topicIdsToInclude,
      this.topicIdsSeen,
      this.questionIdsSeen
    ).subscribe(
      (res) => {
        if (res['status'] === 200) {
          const question = res['body'].Question;
          if (question === undefined)
          {
            return;
          }
          
          const q = new Question(
            question.QuestionId,
            question.Question,
            question.Answer,
            question.References,
            question.TopicId
          );

          let fvQuestion = new FlashcardsViewerQuestion();
          fvQuestion.question = q;
          fvQuestion.subjectTitle = res['body'].SubjectTitle;
          fvQuestion.topicTitle = res['body'].TopicTitle;

          this.questions.push(fvQuestion);

          this.questionIdsSeen.push(question.QuestionId);
          this.topicIdsSeen.push(question.TopicId);

          if (shouldProgress) {
            this.currentQuestionIndex++;
          }
        }
      },
      (error) => {
        console.log(error); // TODO: log this properly
      }
    );
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