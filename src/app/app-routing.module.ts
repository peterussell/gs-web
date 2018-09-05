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
import { QuizzesComponent } from './quizzes/quizzes.component';

const appRoutes: Routes = [
    // { path: '', component: LandingPageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: '', component: GroundSchoolAppComponent, children: [
        { path: 'courses', component: CourseComponent, resolve: {course: CourseResolver} },
        { path: 'quizzes/:quiz-topic-id', component: QuizzesComponent }
        // { path: '', component: CoursesDashboardComponent }, // TODO: dashboard
        // { path: ':title', component: CourseComponent, resolve: {course: CourseResolver} } // TODO: direct routes to courses?
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