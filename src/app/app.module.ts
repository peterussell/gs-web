import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { PageTitleComponent } from './page-title/page-title.component';
import { SubjectComponent } from './subject/subject.component';
import { QuestionComponent } from './subject/question/question.component';
import { ApiService } from './core/services/api.service';
import { QuestionService } from './core/services/question.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { ReviewDashboardComponent } from './review/review-dashboard/review-dashboard.component';
import { GroundSchoolAppComponent } from './ground-school-app/ground-school-app.component';
import { CourseComponent } from './review/course.component';
import { AppRoutingModule } from './app-routing.module';
import { CourseResolver } from './core/services/resolvers/course-resolver.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';

import { UIEventsService } from './core/services/ui-events.service';
import { ResponsiveService } from './core/services/responsive.service';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserService } from './core/services/user.service';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ReportQuestionDialogComponent } from './subject/report-question-dialog/report-question-dialog.component';
import { QuestionEditorComponent } from './question-editor/question-editor.component';
import { AccountDialogComponent } from './account-dialog/account-dialog.component';
import { FlashcardsComponent } from './flashcards/flashcards.component';
import { FlashcardsBuilderComponent } from './flashcards/flashcards-builder/flashcards-builder.component';
import { FlashcardsViewerComponent } from './flashcards/flashcards-viewer/flashcards-viewer.component';
import { FlashcardComponent } from './flashcards/flashcards-viewer/flashcard/flashcard.component';
import { GroundschoolComponent } from './groundschool/groundschool.component';
import { NavbarComponent } from './navbar/navbar.component';
import { StoreService } from './core/services/store.service';
import { ActivateComponent } from './activate/activate.component';
import { ActivateFullPageComponent } from './activate-full-page/activate-full-page.component';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    PageTitleComponent,
    SubjectComponent,
    QuestionComponent,
    LoginComponent,
    ReviewDashboardComponent,
    GroundSchoolAppComponent,
    CourseComponent,
    RegisterComponent,
    ResetPasswordComponent,
    LandingPageComponent,
    ReportQuestionDialogComponent,
    AccountDialogComponent,
    QuestionEditorComponent,
    FlashcardsComponent,
    FlashcardsBuilderComponent,
    FlashcardsViewerComponent,
    FlashcardComponent,
    GroundschoolComponent,
    NavbarComponent,
    ActivateComponent,
    ActivateFullPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    LayoutModule,
    FlexLayoutModule
  ],
  providers: [
    ApiService,
    UserService,
    StoreService,
    QuestionService,
    UIEventsService,
    ResponsiveService,
    CourseResolver,
    FlexLayoutModule
  ],
  entryComponents: [
    ReportQuestionDialogComponent,
    AccountDialogComponent,
    ActivateComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
