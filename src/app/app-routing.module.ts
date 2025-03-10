import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { CommonModule } from '@angular/common';
import { AppComponent} from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component'
import { TaskComponent } from './task/task.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'project', component: ProjectComponent},
  {path: 'project-detail/:id', component: ProjectDetailComponent},
  {path: 'task', component: TaskComponent},
  {path: 'task/:id', component: TaskComponent},
  {path: 'home', component: DashboardComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
      RouterModule,
  ]
})
export class AppRoutingModule { }
