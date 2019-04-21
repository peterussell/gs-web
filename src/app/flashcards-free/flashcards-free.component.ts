import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { Course } from '../core/models/course.model';
import { Subject } from '../core/models/subject.model';

@Component({
  selector: 'app-flashcards-free',
  templateUrl: './flashcards-free.component.html',
  styleUrls: ['./flashcards-free.component.scss']
})
export class FlashcardsFreeComponent implements OnInit {
  private currentState: FlashcardsFreeState;
  private currentCourse: Course;
  private currentSubject: Subject;

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit() {
    const coursePath: string = this.route.snapshot.params["course"];
    const subjectPath: string = this.route.snapshot.params["subject"];

    this.currentState = FlashcardsFreeState.Loading;

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