import { Component, OnInit } from '@angular/core';
import { RegisterInterestResponse } from '../core/services/interfaces/register-interest-response';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/finally';
import { ApiService } from '../core/services/api.service';
import { Course } from '../core/models/course.model';
import { StoreService } from '../core/services/store.service';
import { FlashcardsBuilderRequest } from '../flashcards/flashcards-builder/flashcards-builder.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  public allCourses: Array<Course>;

  constructor(private apiService: ApiService,
              private storeService: StoreService,
              private router: Router) {}

  ngOnInit() {
    this.apiService.getCourses().subscribe(
      (data) => {
        this.allCourses = data.courses.sort((a, b) => {
          if (a.order > b.order) return 1;
          if (a.order < b.order) return -1;
          return 0;
        })
      },
      (error) => {
        console.log(error); // TODO: log this properly
      }
    )
  }

  onBuilderSubmit(builderRequest: FlashcardsBuilderRequest) {
    this.storeService.pushPendingFlashcardsBuilderRequest(builderRequest);
    this.router.navigate(['/flashcards/']);
  }
}