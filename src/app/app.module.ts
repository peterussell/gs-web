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
import { ApiService } from './core/services/api.service';
import { QuestionService } from './core/services/question.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { CoursesDashboardComponent } from './courses-dashboard/courses-dashboard.component';
import { GroundSchoolAppComponent } from './ground-school-app/ground-school-app.component';
import { CourseComponent } from './course/course.component';
import { AppRoutingModule } from './app-routing.module';
import { CourseResolver } from './course/course-resolver.service';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

import { UIEventsService } from './core/services/ui-events.service';
import { ResponsiveService } from './core/services/responsive.service';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserService } from './core/services/user.service';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ReportQuestionDialogComponent } from './question-set/report-question-dialog/report-question-dialog.component';
import { QuestionEditorComponent } from './question-editor/question-editor.component';
import { AccountDialogComponent } from './account-dialog/account-dialog.component';
import { ActivateComponent } from './activate/activate.component';
import { ActivateFullPageComponent } from './activate-full-page/activate-full-page.component';


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
    CourseComponent,
    RegisterComponent,
    ResetPasswordComponent,
    LandingPageComponent,
    ReportQuestionDialogComponent,
    AccountDialogComponent,
    QuestionEditorComponent,
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
    LayoutModule
  ],
  providers: [
    ApiService,
    UserService,
    QuestionService,
    UIEventsService,
    ResponsiveService,
    CourseResolver
  ],
  entryComponents: [
    ReportQuestionDialogComponent,
    AccountDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
