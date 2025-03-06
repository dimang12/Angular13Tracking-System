import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider'
import { MatListModule } from '@angular/material/list'
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// Material
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSidenavModule} from "@angular/material/sidenav";


import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
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
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";
import { BlanketComponent } from './components/uis/blanket/blanket.component';
import { NewProjectComponent } from './project/new-project/new-project.component';
import ButtonUiComponent from './components/uis/button/button-ui.component';


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
    BlanketComponent,
    NewProjectComponent,
    ButtonUiComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSidenavModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
