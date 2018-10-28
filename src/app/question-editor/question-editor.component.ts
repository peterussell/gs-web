import { Component, OnInit } from '@angular/core';
import { QuestionSet } from '../core/models/question-set.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Course } from '../core/models/course.model';
import { Topic } from '../core/models/topic.model';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-question-editor',
  templateUrl: './question-editor.component.html',
  styleUrls: ['./question-editor.component.scss']
})
export class QuestionEditorComponent implements OnInit {
  addQuestionForm: FormGroup;
  courses: Array<Course>;
  topics: Array<Topic>;
  questionSets: Array<QuestionSet>;
  selectedCourse: Course;
  selectedTopic: Topic;
  selectedQuestionSet: QuestionSet;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.addQuestionForm = new FormGroup({
      'questionSet': new FormControl(null, Validators.required),
      'questionText': new FormControl(null, Validators.required),
      'answerText': new FormControl(null, Validators.required)
    });

    this.apiService.getCourses().subscribe((response: any) => {
      let courses: Array<Course> = response.courses;

      // TODO: extract this to a utility class, eg. sortCoursesByOrdering(..)
      this.courses = courses.sort((a, b) => {
        if (a.order < b.order) return -1;
        if (a.order > b.order) return 1;
        return 0;
      });

      if (this.courses !== undefined && this.courses.length > 0) {
        this.selectCourse(this.courses[0]);
      }
    });
  }

  onSubmit() {
    console.log('submitted!');
  }

  onReset() {
    this.addQuestionForm.reset();
    console.log('resetting');
  }

  // Material event handlers
  matSelectCourse(event: MatSelectChange) {
    this.selectCourse(event.value);
  }
  
  matSelectTopic(event: MatSelectChange) {
    this.selectTopic(event.value);
  }

  matSelectQuestionSet(event: MatSelectChange) {
    this.selectQuestionSet(event.value);
  }

  selectCourse(course: Course) {
    if (course === null) { return; }
    this.selectedCourse = course;
    // TODO: extract to utility class
    this.topics = this.selectedCourse.topics.sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
    if (this.selectedCourse.topics !== null && this.selectedCourse.topics.length > 0) {
      this.selectTopic(this.selectedCourse.topics[0]);
    }
  }

  selectTopic(topic: Topic) {
    if (topic === null) { return; }
    this.selectedTopic = topic;
    // TODO: extract to utility class
    this.questionSets = this.selectedTopic.questionSets.sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
    if (this.selectedTopic.questionSets !== null && this.selectedTopic.questionSets.length > 0) {
      this.selectQuestionSet(this.selectedTopic.questionSets[0]);
    }
  }

  selectQuestionSet(questionSet: QuestionSet) {
    if (questionSet === null) { return; }
    this.selectedQuestionSet = questionSet;
  }
}
