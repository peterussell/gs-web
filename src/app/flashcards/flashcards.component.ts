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
  public builderError: string;

  private currentState: FlashcardsState = FlashcardsState.ShowBuilder;
  private allCourses: Array<Course>;
  private currentQuestions: Array<Question>;

  // tmp
  private topics: Array<string> = new Array<string>();

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
    this.apiService.getFlashcards(request.numberOfQuestions, request.topicIdsToInclude).subscribe(
      (response) => {
        if (response['status'] === 200) {
          this.loadQuestions(response['body']['questions']);
        }
      },
      (error) => {
        this.builderError = "There was a problem loading flashcards, please try again.";
        console.log(error); // TODO: log this properly
      }
    );
  }

  loadQuestions(questions: Array<Question>) {
    if (questions === undefined || questions.length === 0) {
      this.builderError = "No questions were found.";
      return;
    }
    this.currentQuestions = questions;
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