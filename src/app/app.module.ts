import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { AppRoutingModule } from './app-routing.module';

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




@NgModule({
  declarations: [
    AppComponent,
    TopNavigationComponent,
    LeftNavigationComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    FlexLayoutModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
