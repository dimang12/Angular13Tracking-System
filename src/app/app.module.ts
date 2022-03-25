import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider'
import { MatListModule } from '@angular/material/list'
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// Material
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatChipsModule} from '@angular/material/chips';
// import {MatDatepicker} from '@angular/material/datepicker';
// import {MatFormField} from '@angular/material/form-field';

import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { AppComponent } from './app.component';


import { FlexLayoutModule } from '@angular/flex-layout';
import { environment } from '../environments/environment';
import { TopNavigationComponent } from './layout/top-navigation/top-navigation.component';
import { LeftNavigationComponent } from './layout/left-navigation/left-navigation.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
import { TaskComponent } from './task/task.component';
import { BreadcrumbComponent } from './layout/breadcrumb/breadcrumb.component';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';




@NgModule({
  declarations: [
    AppComponent,
    TopNavigationComponent,
    LeftNavigationComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    DashboardComponent,
    ProjectComponent,
    TaskComponent,
    BreadcrumbComponent,
    ProjectDetailComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    FlexLayoutModule,
    AppRoutingModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatDividerModule,
    MatListModule,
    MatProgressBarModule,
    MatChipsModule,
    // MatDatepicker,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
