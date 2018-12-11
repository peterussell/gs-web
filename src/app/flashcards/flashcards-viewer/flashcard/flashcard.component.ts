import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FlashcardsViewerQuestion } from '../flashcards-viewer.component';
import { Question } from '../../../core/models/question.model';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss']
})
export class FlashcardComponent implements OnInit, OnChanges {
  @Input() flashcardViewerQuestion: FlashcardsViewerQuestion;
  
  private currentState: FlashcardViewerState;

  constructor() { }

  ngOnInit() { }

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
}

enum FlashcardViewerState {
  Question,
  Answer
}
