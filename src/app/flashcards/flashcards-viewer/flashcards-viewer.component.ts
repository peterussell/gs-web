import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Question } from '../../core/models/question.model';
import { ApiService } from '../../core/services/api.service';
import { ConsoleLogger } from '@aws-amplify/core';

@Component({
  selector: 'app-flashcards-viewer',
  templateUrl: './flashcards-viewer.component.html',
  styleUrls: ['./flashcards-viewer.component.scss']
})
export class FlashcardsViewerComponent implements OnChanges {
  @Input() numberOfQuestions: number;
  @Input() topicIdsToInclude: Array<string>;

  public questionIdsSeen: Array<string>;
  public topicIdsSeen: Array<string>;

  public questions: Array<Question>;
  public currentQuestionIndex: number;

  constructor(private apiService: ApiService) {
    this.questions = new Array<Question>();
    this.questionIdsSeen = new Array<string>();
    this.topicIdsSeen = new Array<string>();
    this.currentQuestionIndex = 0;
  }

  ngOnChanges() {
    this.getNextQuestion(false); // Don't progress for the first question
  }

  canGoToNextQuestion() {
    // TODO: check the index against the number of questions. Redirect
    // to the final page if the set is finished.
    return true;
  }

  goToNextQuestion() {
    if (this.canGoToNextQuestion()) {
      this.getNextQuestion(true);
    }
  }

  canGoToPreviousQuestion() {
    return this.currentQuestionIndex > 0;
  }

  goToPreviousQuestion() {
    if (this.canGoToPreviousQuestion()) {
      this.currentQuestionIndex--;
    }
    console.log(this.currentQuestionIndex);
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
          
          this.questions.push(new Question(
            question.QuestionId,
            question.Question,
            question.Answer,
            question.References,
            question.TopicId
          ));

          this.questionIdsSeen.push(question.QuestionId);
          this.topicIdsSeen.push(question.TopicId);

          if (shouldProgress) {
            this.currentQuestionIndex++;
          }
          console.log(this.currentQuestionIndex);
        }
      },
      (error) => {
        console.log(error); // TODO: log this properly
      }
    );
  }
}
