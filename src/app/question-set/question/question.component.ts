import { Component, OnInit, Input } from '@angular/core';

import { Question } from '../../core/models/question.model';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  @Input() question: Question;

  public questionText: string;
  public answerText: string;

  constructor() { }

  ngOnInit() {
    this.questionText = this.insertDegreeSymbols(this.question.question);
    this.answerText = this.insertDegreeSymbols(this.question.answer);
  }

  // TODO: move this to a util class
  insertDegreeSymbols(input: string): string {
    return input.replace(/&deg;/g, '°');
  }
}
