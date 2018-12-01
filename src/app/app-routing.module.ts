import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { CoursesDashboardComponent } from './courses-dashboard/courses-dashboard.component';
import { GroundSchoolAppComponent } from './ground-school-app/ground-school-app.component';
import { CourseComponent } from './course/course.component';
import { CourseResolver } from './course/course-resolver.service';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { QuestionEditorComponent } from './question-editor/question-editor.component';
import { ChecklistTrainerComponent } from './checklist-trainer/checklist-trainer.component';

const appRoutes: Routes = [
    // { path: '', component: LandingPageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'courses', component: GroundSchoolAppComponent, children: [
        { path: '', component: CourseComponent, resolve: {course: CourseResolver} }
    ]},
    { path: 'checklist-trainer', component: GroundSchoolAppComponent, children: [
        { path: '', component: ChecklistTrainerComponent }
    ]},
    { path: 'admin', component: GroundSchoolAppComponent, children: [
        { path: 'question-editor', component: QuestionEditorComponent },
    ]},
    { path: '**', redirectTo: '/courses' }
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