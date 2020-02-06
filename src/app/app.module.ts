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
import { LoginComponent } from './account/login/login.component';
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
import { RegisterComponent } from './account/register/register.component';
import { ResetPasswordComponent } from './account/reset-password/reset-password.component';
import { UserService } from './core/services/user.service';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ReportQuestionDialogComponent } from './subject/report-question-dialog/report-question-dialog.component';
import { QuestionEditorComponent } from './question-editor/question-editor.component';
import { FlashcardsComponent } from './flashcards/flashcards.component';
import { FlashcardsBuilderComponent } from './flashcards/flashcards-builder/flashcards-builder.component';
import { FlashcardsViewerComponent } from './flashcards/flashcards-viewer/flashcards-viewer.component';
import { FlashcardsCardComponent } from './flashcards/flashcards-viewer/flashcards-card/flashcards-card.component';
import { GroundschoolComponent } from './groundschool/groundschool.component';
import { NavbarComponent } from './navbar/navbar.component';
import { StoreService } from './core/services/store.service';
import { ActivateComponent } from './account/activate/activate.component';
import { ContactComponent } from './contact/contact.component';
import { CourseIndexComponent } from './course-index/course-index.component';
import { SubjectCardComponent } from './course-index/subject-card/subject-card.component';
import { SubjectResolver } from './core/services/resolvers/subject-resolver.service';
import { FlashcardsMenuComponent } from './flashcards/flashcards-menu/flashcards-menu.component';
import { ChecklistTrainerComponent } from './checklist-trainer/checklist-trainer.component';
import { FlashcardsFreeComponent } from './flashcards-free/flashcards-free.component';
import { GsSnackbarComponent } from './gs-snackbar/gs-snackbar.component';
import { PiperWarriorIiAvidyneComponent } from './checklist-trainer/aircraft/piper-warrior-ii-avidyne/piper-warrior-ii-avidyne.component';
import { Pa38Component } from './checklist-trainer/aircraft/pa38/pa38.component';
import { PaymentSuccessComponent } from './payments/payment-success/payment-success.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PurchasedCourseCardComponent } from './dashboard/purchased-course-card/purchased-course-card.component';
import { ReviewQuestionsComponent } from './review-questions/review-questions.component';
import { ConfirmDialogComponent } from './review-questions/confirm-dialog/confirm-dialog.component';
import { SignedOutComponent } from './account/signed-out/signed-out.component';
import { MatDialogModule } from '@angular/material';
import { ResourcesComponent } from './resources/resources.component';
import { ArticlesComponent } from './articles/articles.component';
import { SoFlyingWhereDoIStartComponent } from './articles/articles/so-flying-where-do-i-start/so-flying-where-do-i-start.component';
import { SelfStudyTipsComponent } from './articles/articles/self-study-tips/self-study-tips.component';
import { SelfStudyTipsPartTwoComponent } from './articles/articles/self-study-tips-part-two/self-study-tips-part-two.component';
import { TipsForNewAerodromesComponent } from './articles/articles/tips-for-new-aerodromes/tips-for-new-aerodromes.component';


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
    QuestionEditorComponent,
    FlashcardsComponent,
    FlashcardsBuilderComponent,
    FlashcardsViewerComponent,
    FlashcardsCardComponent,
    GroundschoolComponent,
    NavbarComponent,
    ActivateComponent,
    ContactComponent,
    CourseIndexComponent,
    SubjectCardComponent,
    FlashcardsMenuComponent,
    ChecklistTrainerComponent,
    FlashcardsFreeComponent,
    GsSnackbarComponent,
    PiperWarriorIiAvidyneComponent,
    Pa38Component,
    PaymentSuccessComponent,
    DashboardComponent,
    PurchasedCourseCardComponent,
    ReviewQuestionsComponent,
    ConfirmDialogComponent,
    SignedOutComponent,
    ResourcesComponent,
    ArticlesComponent,
    SoFlyingWhereDoIStartComponent,
    SelfStudyTipsComponent,
    SelfStudyTipsPartTwoComponent,
    TipsForNewAerodromesComponent,
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
    FlexLayoutModule,
    MatDialogModule
  ],
  providers: [
    ApiService,
    UserService,
    StoreService,
    QuestionService,
    UIEventsService,
    ResponsiveService,
    CourseResolver,
    SubjectResolver,
    FlexLayoutModule,
    MatDialogModule
  ],
  entryComponents: [
    ReportQuestionDialogComponent,
    ConfirmDialogComponent,
    ActivateComponent,
    GsSnackbarComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
