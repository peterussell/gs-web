import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { Course } from '../core/models/course.model';
import { Subject } from '../core/models/subject.model';
import { FlashcardsViewerMode } from '../flashcards/flashcards-shared';

@Component({
  selector: 'app-flashcards-free',
  templateUrl: './flashcards-free.component.html',
  styleUrls: ['./flashcards-free.component.scss']
})
export class FlashcardsFreeComponent implements OnInit {
  private currentState: FlashcardsFreeState;
  private viewerMode: FlashcardsViewerMode = FlashcardsViewerMode.Free;

  private currentCourse: Course;
  private currentSubject: Subject;

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit() {
    const coursePath: string = this.route.snapshot.params["course"];
    const subjectPath: string = this.route.snapshot.params["subject"];

    this.currentState = FlashcardsFreeState.Loading;

    this.apiService.getCourses().subscribe((res) => {
      // find the matching course
      res.Courses.forEach((c: Course) => {
          if (c.Path === coursePath) {
              this.currentCourse = c;
              return;
          }
      });

      // find the matching subject
      this.currentCourse.Subjects.forEach((s: Subject) => {
          if (s.Path === subjectPath) {
              this.currentSubject = s;
              return;
          }
      });
      this.currentState = FlashcardsFreeState.ShowViewer;
    });
  }

  isLoadingState() {
    return this.currentState === FlashcardsFreeState.Loading;
  }

  isViewerState() {
    return this.currentState === FlashcardsFreeState.ShowViewer;
  }
}

enum FlashcardsFreeState {
  Loading,
  ShowViewer
}