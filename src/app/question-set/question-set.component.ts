import { Component, OnInit } from '@angular/core';

import { QuestionSet } from '../core/models/question-set.model';
import { QuestionService } from '../core/services/question.service';

@Component({
  selector: 'app-question-set',
  templateUrl: './question-set.component.html',
  styleUrls: ['./question-set.component.scss']
})
export class QuestionSetComponent implements OnInit {
  public QuestionSet: QuestionSet;

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    this.questionService.onQuestionsUpdated.subscribe((questionSet: QuestionSet) => {
      this.QuestionSet = questionSet;
    });
  }

}
