import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../core/models/course.model';
import { Subject } from '../core/models/subject.model';
import { Topic } from '../core/models/topic.model';
import { QuestionService } from '../core/services/question.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-question-selector',
  templateUrl: './question-selector.component.html',
  styleUrls: ['./question-selector.component.scss']
})
export class QuestionSelectorComponent implements OnInit {
  @Input() course: Course;
  public subjects: Array<Subject>;
  public topics: Array<Topic>;

  public selectedSubject: Subject;
  public selectedTopic: Topic;
  
  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    if (this.course !== undefined && this.course.subjects.length > 0) {
      // todo: extract these to a helper function (sortByTitle(...))
      this.subjects = this.course.subjects.sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      });
      this.selectSubject(this.subjects[0]);

      this.questionService.onSubjectUpdated.subscribe((res: {course: Course, subject: Subject}) => {
        this.selectSubject(res.subject);
      })
    }
  }

  selectSubject(subject: Subject) {
    if (subject !== undefined && subject.topics.length > 0) {
      this.selectedSubject = subject;
      this.topics = subject.topics.sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      });
      this.selectTopic(this.topics[0]);
    }
  }

  selectTopic(topic: Topic) {
    this.selectedTopic = topic;
    this.questionService.updateTopic(topic.topicId);
  }

  // Material event handlers
  matSelectSubject(event: MatSelectChange) {
    this.selectSubject(event.value);
  }

  matSelectTopic(event: MatSelectChange) {
    this.selectTopic(event.value);
  }
}
