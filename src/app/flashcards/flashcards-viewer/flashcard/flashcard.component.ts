import { Component, OnInit, Input } from '@angular/core';
import { Question } from '../../../core/models/question.model';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss']
})
export class FlashcardComponent implements OnInit {
  @Input() question: Question;
  
  constructor() { }

  ngOnInit() {
  }
}
