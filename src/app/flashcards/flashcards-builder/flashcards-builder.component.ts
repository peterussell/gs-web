import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

import { Course } from '../../core/models/course.model';
import { Subject } from '../../core/models/subject.model';
import { Topic } from '../../core/models/topic.model';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-flashcards-builder',
  templateUrl: './flashcards-builder.component.html',
  styleUrls: ['./flashcards-builder.component.scss']
})
export class FlashcardsBuilderComponent implements OnInit {
  @Input() courses: Array<Course>;
  @Output() submitted: EventEmitter<FlashcardsBuilderRequest> =
    new EventEmitter<FlashcardsBuilderRequest>();

  public selectedCourse: Course;

  public numberOfQuestionsOptions: number[] = [5, 10, 20];
  public numberOfQuestions: number = 5;

  public subjectsState = [];

  constructor() { }

  ngOnInit() {
    if (this.courses !== undefined && this.courses.length > 0) {
      this.selectCourse(this.courses[0]);
    }
  }

  selectCourse(course: Course) {
    this.selectedCourse = course;
    this.subjectsState = [];
    
    // Populate the checkbox states for Subjects and Topics
    if (this.selectedCourse.subjects !== null && this.selectedCourse.subjects.length > 0) {
      this.selectedCourse.subjects.sort((a, b) => {
        if (a.title > b.title) { return 1; }
        if (a.title < b.title) { return -1; }
        return 0;
      }).forEach((subject: Subject) => {
        // Subject
        let s = { id: subject.subjectId, title: subject.title, selected: true, topics: [] };

        // Topics for this subject
        subject.topics.forEach((topic: Topic) => {
          s.topics.push({ id: topic.topicId, title: topic.title, selected: true });
        });

        this.subjectsState.push(s);
      });
    }
  }

  // Material event handlers
  matSelectCourse(event: MatSelectChange) {
    this.selectCourse(event.value);
  }

  toggleSubject(event: MatCheckboxChange, subjectId: string) {
    // Toggle the topics for the subject that was selected/deselected
    let s = this.subjectsState.find(s => s.id === subjectId);
    s.topics.forEach(t => t.selected = event.checked);
  }

  hasSelectedCourse() {
    // TODO: should check 1+ topics are selected, this will do for now
    return this.selectedCourse !== undefined;
  }

  hasSubjects() {
    return this.subjectsState.length > 0;
  }

  onSubmit() {
    let selectedTopicIds: Array<string> = new Array<string>();

    // Add any selected topics to the array
    this.subjectsState.forEach((s => {
      s.topics.forEach(t => {
        if (t.selected) {
          selectedTopicIds.push(t.id);
        }
      });
    }));

    if (selectedTopicIds === undefined || selectedTopicIds.length === 0) {
      // TODO: show an error
      return;
    }

    let req = new FlashcardsBuilderRequest();
    req.numberOfQuestions = this.numberOfQuestions;
    req.topicIdsToInclude = selectedTopicIds;

    // Notify any listeners with a list of the topic IDs the user selected
    this.submitted.emit(req);
  }
}

export class FlashcardsBuilderRequest {
  public numberOfQuestions: number;
  public topicIdsToInclude: Array<string>;
}