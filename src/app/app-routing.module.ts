import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { GroundSchoolAppComponent } from './ground-school-app/ground-school-app.component';
import { CourseComponent } from './review/course.component';
import { CourseResolver } from './core/services/resolvers/course-resolver.service';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { QuestionEditorComponent } from './question-editor/question-editor.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FlashcardsComponent } from './flashcards/flashcards.component';
import { GroundschoolComponent } from './groundschool/groundschool.component';
import { ActivateFullPageComponent } from './activate-full-page/activate-full-page.component';
import { ContactComponent } from './contact/contact.component';
import { SubjectResolver } from './core/services/resolvers/subject-resolver.service';
import { FlashcardsViewerComponent } from './flashcards/flashcards-viewer/flashcards-viewer.component';
import { ChecklistTrainerComponent } from './checklist-trainer/checklist-trainer.component';
import { FlashcardsFreeComponent } from './flashcards-free/flashcards-free.component';
import { PaymentSuccessComponent } from './payments/payment-success/payment-success.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReviewDashboardComponent } from './review/review-dashboard/review-dashboard.component';

const appRoutes: Routes = [
    
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'admin', component: GroundSchoolAppComponent, children: [
        { path: 'question-editor', component: QuestionEditorComponent },
    ]},
    { path: '', component: GroundschoolComponent, children: [
        { path: '', component: LandingPageComponent },
        { path: 'activate', component: ActivateFullPageComponent },
        { path: 'checklists', component: ChecklistTrainerComponent },
        { path: 'contact', component: ContactComponent },
        { path: ':course/:subject', component: FlashcardsComponent },
        { path: ':course/:subject/free', component: FlashcardsFreeComponent },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'flashcards', component: FlashcardsComponent, resolve: { course: CourseResolver } },
        { path: 'payment-success', component: PaymentSuccessComponent },
        { path: 'review-set', component: ReviewDashboardComponent }
    ]},
    { path: '**', redirectTo: '' }
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