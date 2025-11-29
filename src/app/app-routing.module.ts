import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';
import { TaskComponent } from './task/task.component';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { AuthGuard } from './auth/auth.guard';
import { DetailTaskComponent} from "./task/detail-task/detail-task.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'project', component: ProjectComponent, canActivate: [AuthGuard] },
  { path: 'project-detail/:id', component: ProjectDetailComponent, canActivate: [AuthGuard] },
  { path: 'task', component: TaskComponent, canActivate: [AuthGuard] },
  { path: 'task/detail/:taskId', component: DetailTaskComponent, canActivate: [AuthGuard]},
  { path: 'task/:projectId', component: TaskComponent, canActivate: [AuthGuard] },
  { path: 'daily-report', component: DailyReportComponent, canActivate: [AuthGuard] },
  { path: 'home', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
