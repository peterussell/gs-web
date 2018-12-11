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

  public questions: Array<FlashcardsViewerQuestion>;
  public currentQuestionIndex: number;

  constructor(private apiService: ApiService) {
    this.questions = new Array<FlashcardsViewerQuestion>();
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
}

export class FlashcardsViewerQuestion {
  public question: Question;
  public subjectTitle: string;
  public topicTitle: string;
}