import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Course } from '../core/models/course.model';
import { ApiService } from '../core/services/api.service';
import { Question } from '../core/models/question.model';
import { StoreService } from '../core/services/store.service';
import { Subject } from '../core/models/subject.model';
import { Topic } from '../core/models/topic.model';
import { GSUtils } from '../core/utils/utils';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { FlashcardsViewerMode } from './flashcards-shared';

@Component({
  selector: 'app-flashcards',
  templateUrl: './flashcards.component.html',
  styleUrls: ['./flashcards.component.scss']
})
export class FlashcardsComponent implements OnInit {
  @Input() initialState: FlashcardsState;
  private currentState: FlashcardsState = FlashcardsState.ShowViewer; // TODO: possibly deprecate
  private viewerMode: FlashcardsViewerMode = FlashcardsViewerMode.Premium;

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

      // sort topics by syllabus number
      this.currentSubject.topics.sort((a, b) => {
        return GSUtils.sortMultiPartNumbers(a.subTopic, b.subTopic);
      });

      // load the topics for this subject
      let questions: Array<Question> = new Array<Question>();

      let loadQuestionTasks$ = [];
      this.currentSubject.topics.forEach((t: Topic) => {
          loadQuestionTasks$.push(this.apiService.getQuestions(t.topicId));
      });

      // wait for all observables to finish then save the questions to currentSubject
      Observable.forkJoin(loadQuestionTasks$).subscribe((topicsWithQuestions: Array<Topic>) => {
        topicsWithQuestions.forEach((t: Topic) => {
          this.currentSubject.topics
            .find(existingTopic => existingTopic.topicId === t.topicId) // find the topic to save to
            .questions = t.questions.sort((a, b) => { // order questions by syllabus reference
              return GSUtils.sortMultiPartNumbers(a.syllabusRef, b.syllabusRef);
            });
        });
        // all done, ready to show flashcards
        this.currentState = FlashcardsState.ShowViewer;
      })
    });
  }

  onViewerComplete() {
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
  ShowViewer
}