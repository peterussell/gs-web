import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { PageTitleComponent } from './page-title/page-title.component';
import { QuestionSelectorComponent } from './question-selector/question-selector.component';
import { QuestionSetComponent } from './question-set/question-set.component';
import { QuestionComponent } from './question-set/question/question.component';
import { JsonService } from './core/services/json.service';
import { QuestionService } from './core/services/question.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { CoursesDashboardComponent } from './courses-dashboard/courses-dashboard.component';
import { GroundSchoolAppComponent } from './ground-school-app/ground-school-app.component';
import { CourseComponent } from './course/course.component';
import { AppRoutingModule } from './app-routing.module';
import { CourseResolver } from './course/course-resolver.service';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    PageTitleComponent,
    QuestionSelectorComponent,
    QuestionSetComponent,
    QuestionComponent,
    LoginComponent,
    CoursesDashboardComponent,
    GroundSchoolAppComponent,
    CourseComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    JsonService,
    QuestionService,
    CourseResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
