import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Course } from '../core/models/course.model';
import { Subject } from '../core/models/subject.model';
import { Topic } from '../core/models/topic.model';
import { QuestionService } from '../core/services/question.service';
import { MatSelectChange } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-question-selector',
  templateUrl: './question-selector.component.html',
  styleUrls: ['./question-selector.component.scss']
})
export class QuestionSelectorComponent implements OnInit {
  @Input() subject: Subject;
  @Output() topicSelected: EventEmitter<Topic> = new EventEmitter<Topic>();

  private allTopics: Array<Topic>;
  public selectedTopic: Topic;
  
  constructor(private router: Router) { }

  ngOnInit() {
    if (this.subject !== undefined && this.subject.topics.length > 0) {
      // todo: extract these to a helper function (sortByTitle(...))
      this.allTopics = this.subject.topics.sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      });
      this.selectTopic(this.allTopics[0]);
    }
  }

  selectTopic(topic: Topic) {
    this.selectedTopic = topic;
    this.topicSelected.emit(this.selectedTopic);
  }

  // Material event handlers
  matSelectTopic(event: MatSelectChange) {
    this.selectTopic(event.value);
  }
}
