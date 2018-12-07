import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { ReviseDashboardComponent } from './revise-dashboard/revise-dashboard.component';
import { GroundSchoolAppComponent } from './ground-school-app/ground-school-app.component';
import { CourseComponent } from './revise/course.component';
import { CourseResolver } from './revise/course-resolver.service';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { QuestionEditorComponent } from './question-editor/question-editor.component';

const appRoutes: Routes = [
    // { path: '', component: LandingPageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'revise', component: GroundSchoolAppComponent, children: [
        { path: '', component: ReviseDashboardComponent },
        { path: ':course/:subject', component: CourseComponent, resolve: {course: CourseResolver} }
    ]},
    { path: 'admin', component: GroundSchoolAppComponent, children: [
        { path: 'question-editor', component: QuestionEditorComponent },
    ]},
    { path: '**', redirectTo: '/revise' }
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