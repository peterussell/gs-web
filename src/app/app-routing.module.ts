import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { CoursesDashboardComponent } from './courses-dashboard/courses-dashboard.component';
import { GroundSchoolAppComponent } from './ground-school-app/ground-school-app.component';
import { CourseComponent } from './course/course.component';
import { CourseResolver } from './course/course-resolver.service';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'courses', component: GroundSchoolAppComponent, children: [
        { path: '', component: CoursesDashboardComponent },
        { path: ':title', component: CourseComponent, resolve: {course: CourseResolver} }
    ]}
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