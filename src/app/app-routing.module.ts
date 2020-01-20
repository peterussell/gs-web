import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './account/login/login.component';
import { GroundSchoolAppComponent } from './ground-school-app/ground-school-app.component';
import { CourseComponent } from './review/course.component';
import { CourseResolver } from './core/services/resolvers/course-resolver.service';
import { RegisterComponent } from './account/register/register.component';
import { ResetPasswordComponent } from './account/reset-password/reset-password.component';
import { QuestionEditorComponent } from './question-editor/question-editor.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FlashcardsComponent } from './flashcards/flashcards.component';
import { GroundschoolComponent } from './groundschool/groundschool.component';
import { ContactComponent } from './contact/contact.component';
import { SubjectResolver } from './core/services/resolvers/subject-resolver.service';
import { FlashcardsViewerComponent } from './flashcards/flashcards-viewer/flashcards-viewer.component';
import { ChecklistTrainerComponent } from './checklist-trainer/checklist-trainer.component';
import { FlashcardsFreeComponent } from './flashcards-free/flashcards-free.component';
import { PaymentSuccessComponent } from './payments/payment-success/payment-success.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReviewDashboardComponent } from './review/review-dashboard/review-dashboard.component';
import { SignedOutComponent } from './account/signed-out/signed-out.component';
import { ActivateComponent } from './account/activate/activate.component';
import { ResourcesComponent } from './resources/resources.component';
import { ArticlesComponent } from './articles/articles.component';
import { SoFlyingWhereDoIStartComponent } from './articles/articles/so-flying-where-do-i-start/so-flying-where-do-i-start.component';
import { SelfStudyTipsComponent } from './articles/articles/self-study-tips/self-study-tips.component';
import { SelfStudyTipsPartTwoComponent } from './articles/articles/self-study-tips-part-two/self-study-tips-part-two.component';

const appRoutes: Routes = [
    { path: '', component: GroundschoolComponent, children: [
        { path: '', component: LandingPageComponent },
        // admin
        { path: 'admin', children: [
            { path: 'question-editor', component: QuestionEditorComponent }
        ]},
        { path: 'articles', component: ArticlesComponent },

        // ugh - for now
        { path: 'articles/so-flying-where-do-i-start', component: SoFlyingWhereDoIStartComponent },
        { path: 'articles/self-study-tips', component: SelfStudyTipsComponent },
        { path: 'articles/self-study-tips-part-two', component: SelfStudyTipsPartTwoComponent },

        { path: 'checklists', component: ChecklistTrainerComponent },
        { path: 'contact', component: ContactComponent },
        { path: ':course/:subject', component: FlashcardsComponent },
        { path: ':course/:subject/free', component: FlashcardsFreeComponent },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'flashcards', component: FlashcardsComponent, resolve: { course: CourseResolver } },
        { path: 'payment-success', component: PaymentSuccessComponent },
        { path: 'resources', component: ResourcesComponent },
        { path: 'review-set', component: ReviewDashboardComponent },
        // account
        { path: 'register', component: RegisterComponent },
        { path: 'login', component: LoginComponent },
        { path: 'activate', component: ActivateComponent },
        { path: 'reset-password', component: ResetPasswordComponent },
        { path: 'signed-out', component: SignedOutComponent }
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