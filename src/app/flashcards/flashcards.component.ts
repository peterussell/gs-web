import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Course } from '../core/models/course.model';
import { ApiService } from '../core/services/api.service';
import { FlashcardsBuilderRequest } from './flashcards-builder/flashcards-builder.component';
import { Question } from '../core/models/question.model';
import { StoreService } from '../core/services/store.service';
import { Subject } from '../core/models/subject.model';
import { Topic } from '../core/models/topic.model';

@Component({
  selector: 'app-flashcards',
  templateUrl: './flashcards.component.html',
  styleUrls: ['./flashcards.component.scss']
})
export class FlashcardsComponent implements OnInit {
  @Input() initialState: FlashcardsState;
  private currentState: FlashcardsState = FlashcardsState.ShowViewer; // TODO: possibly deprecate

  public currentCourse: Course;
  public currentSubject: Subject;

  constructor(private route: ActivatedRoute,
              private apiService: ApiService,
              private storeService: StoreService) { }

  ngOnInit() {
    const coursePath: string = this.route.snapshot.params["course"];
    const subjectPath: string = this.route.snapshot.params["subject"];

    this.currentState = FlashcardsState.Loading;

    this.apiService.getCourses().subscribe((res) => {
      // find the matching course
      res.courses.forEach((c: Course) => {
          if (c.path === coursePath) {
              this.currentCourse = c;
              return;
          }
      });

      // find the matching subject
      this.currentCourse.subjects.forEach((s: Subject) => {
          if (s.path === subjectPath) {
              this.currentSubject = s;
              return;
          }
      });

      // load the topics for this subject
      let questions: Array<Question> = new Array<Question>()
      this.currentSubject.topics.forEach((t: Topic) => {
          this.apiService.getQuestions(t.topicId).subscribe((topic) => {
              t.questions = topic.questions;
              this.currentState = FlashcardsState.ShowViewer;
          });
      });
    });
  }

  onViewerComplete() {
    this.currentState = FlashcardsState.ShowBuilder;
  }

  isLoadingState() {
    return this.currentState === FlashcardsState.Loading;
  }

  isViewerState() {
    return this.currentState === FlashcardsState.ShowViewer;
  }
}

enum FlashcardsState {
  Loading,
  ShowBuilder,
  ShowViewer
}