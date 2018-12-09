import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { ReviewDashboardComponent } from './review/review-dashboard/review-dashboard.component';
import { GroundSchoolAppComponent } from './ground-school-app/ground-school-app.component';
import { CourseComponent } from './review/course.component';
import { CourseResolver } from './core/services/resolvers/course-resolver.service';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { QuestionEditorComponent } from './question-editor/question-editor.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FlashcardsComponent } from './flashcards/flashcards.component';

const appRoutes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'flashcards', component: GroundSchoolAppComponent, children: [
        { path: '', component: FlashcardsComponent, resolve: {course: CourseResolver} }
    ]},
    { path: 'review', component: GroundSchoolAppComponent, children: [
        { path: ':course/:subject', component: CourseComponent, resolve: {course: CourseResolver} }
    ]},
    { path: 'admin', component: GroundSchoolAppComponent, children: [
        { path: 'question-editor', component: QuestionEditorComponent },
    ]},
    { path: '**', redirectTo: '/review/ppl/air-law' } // tmp - need a dashboard
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
    
}