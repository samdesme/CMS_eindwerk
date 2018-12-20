import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/auth/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileCreateComponent } from './components/profile/create/profile-create.component';

import { NavComponent } from './components/nav/nav.component';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    NavComponent,
    ProfileCreateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
