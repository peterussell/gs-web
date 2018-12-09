import { Component, OnInit, Input } from '@angular/core';
import { Question } from '../../core/models/question.model';

@Component({
  selector: 'app-flashcards-viewer',
  templateUrl: './flashcards-viewer.component.html',
  styleUrls: ['./flashcards-viewer.component.scss']
})
export class FlashcardsViewerComponent implements OnInit {
  @Input() questions: Array<Question>;

  constructor() { }

  ngOnInit() {
  }
}
