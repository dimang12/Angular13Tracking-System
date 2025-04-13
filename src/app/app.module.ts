import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";
import { AngularFirestoreModule} from "@angular/fire/compat/firestore";

// Material
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from "@angular/material/tabs";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from "@angular/common/http";
import { UiModule } from './components/uis/ui.module';
import { SharedModule } from './shared/shared.module';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

// pipes
import { TruncatePipe } from './pipes/truncate.pipe';
import {StatusColorPipe, StatusPipe} from "./pipes/status.pipe";
import { PercentagePipe } from "./pipes/percentage.pipe";

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
import { BlanketComponent } from './components/uis/blanket/blanket.component';
import { NewProjectComponent } from './project/new-project/new-project.component';
import { EditProjectComponent } from './project/edit-project/edit-project.component';
import { ConfirmDialogComponent } from './components/uis/confirm-dialog/confirm-dialog.component';
import { NewTaskComponent } from './task/new-task/new-task.component';
import { EditTaskComponent } from './task/edit-task/edit-task.component';
import { RichTextEditorComponent } from './components/uis/rich-text-editor/rich-text-editor.component';
import { DailyReportComponent } from  './daily-report/daily-report.component';
import { GroupProjectComponent } from "./project/project-group/group-project.component";
import { AddGroupProjectDialogComponent } from "./project/add-group-project-dialog/add-group-project-dialog.component";
import { EditGroupProjectDialogModule } from "./project/edit-group-project-dialog/edit-group-project-dialog.module";
import { SubNavigationComponent } from './components/sub-navigation/sub-navigation.component';

@NgModule({
  declarations: [
    TruncatePipe, StatusPipe, StatusColorPipe, PercentagePipe,

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
    EditProjectComponent,
    ConfirmDialogComponent,
    NewTaskComponent,
    EditTaskComponent,
    RichTextEditorComponent,
    DailyReportComponent,
    GroupProjectComponent,
    AddGroupProjectDialogComponent,
    SubNavigationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,

    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    EditGroupProjectDialogModule,

    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatInputModule,
    MatCheckboxModule,
    MatDividerModule,
    MatListModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSidenavModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTabsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    UiModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
