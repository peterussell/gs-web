import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../core/models/course.model';
import { Topic } from '../core/models/topic.model';
import { QuestionSet } from '../core/models/question-set.model';
import { QuestionService } from '../core/services/question.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-question-selector',
  templateUrl: './question-selector.component.html',
  styleUrls: ['./question-selector.component.scss']
})
export class QuestionSelectorComponent implements OnInit {
  @Input() course: Course;
  public topics: Array<Topic>;
  public questionSets: Array<QuestionSet>;

  public selectedTopic: Topic;
  public selectedQuestionSet: QuestionSet;
  
  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    if (this.course !== undefined && this.course.topics.length > 0) {
      this.topics = this.course.topics;
      this.selectTopic(this.topics[0]);
    }
  }

  selectTopic(topic: Topic) {
    if (topic !== undefined && topic.questionSets.length > 0) {
      this.selectedTopic = topic;
      this.questionSets = topic.questionSets;
      this.selectQuestionSet(this.questionSets[0]);
    }
  }

  selectQuestionSet(questionSet: QuestionSet) {
    this.selectedQuestionSet = questionSet;
    this.questionService.updateQuestionSet(questionSet.questionSetId);
  }

  // Material event handlers
  matSelectTopic(event: MatSelectChange) {
    this.selectTopic(event.value);
  }

  matSelectQuestionSet(event: MatSelectChange) {
    this.selectQuestionSet(event.value);
  }
}
