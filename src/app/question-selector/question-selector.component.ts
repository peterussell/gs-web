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
      // todo: extract these to a helper function (sortByTitle(...))
      this.topics = this.course.topics.sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      });
      this.selectTopic(this.topics[0]);

      this.questionService.onTopicUpdated.subscribe((res: {course: Course, topic: Topic}) => {
        this.selectTopic(res.topic);
      })
    }
  }

  selectTopic(topic: Topic) {
    if (topic !== undefined && topic.questionSets.length > 0) {
      this.selectedTopic = topic;
      this.questionSets = topic.questionSets.sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      });
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
