import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Course } from '../core/models/course.model';
import { ApiService } from '../core/services/api.service';
import { FlashcardsBuilderRequest } from './flashcards-builder/flashcards-builder.component';
import { Question } from '../core/models/question.model';

@Component({
  selector: 'app-flashcards',
  templateUrl: './flashcards.component.html',
  styleUrls: ['./flashcards.component.scss']
})
export class FlashcardsComponent implements OnInit {
  private currentState: FlashcardsState = FlashcardsState.ShowBuilder;
  private allCourses: Array<Course>;

  private numberOfQuestions: number;
  private topicIdsToInclude: Array<string>;

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit() {
    this.route.data.subscribe((data: Data) => {
      this.allCourses = data.course.courses.sort((a, b) => {
        if (a.order > b.order) return 1;
        if (a.order < b.order) return -1;
        return 0;
      })
    });
  }

  onBuilderSubmit(request: FlashcardsBuilderRequest) {
    if (request === undefined ||
        request.topicIdsToInclude === undefined ||
        request.topicIdsToInclude.length === 0) {
      return; // Prevent switching to the viewer
    }
    this.numberOfQuestions = request.numberOfQuestions;
    this.topicIdsToInclude = request.topicIdsToInclude;
    this.currentState = FlashcardsState.ShowViewer;
  }

  showBuilder() {
    return this.currentState === FlashcardsState.ShowBuilder;
  }

  showViewer() {
    return this.currentState === FlashcardsState.ShowViewer;
  }
}

enum FlashcardsState {
  ShowBuilder,
  ShowViewer
}