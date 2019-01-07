import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileEditComponent } from './components/profile/profile-edit/profile-edit.component';
import { GoalCreateComponent } from './components/profile/goal-create/goal-create.component';
import { GoalEditComponent } from './components/profile/goal-edit/goal-edit.component';
import { TestComponent } from './components/profile/test/test.component';

import { EntryComponent } from './components/track/entries.component';
import { EntryCreateComponent } from './components/track/entry-create/entry-create.component';

import { StarRatingModule } from 'angular-star-rating';

import { NavComponent } from './components/nav/nav.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    NavComponent,
    RegisterComponent,
    ProfileEditComponent,
    GoalCreateComponent,
    GoalEditComponent,
    TestComponent,
    EntryComponent,
    EntryCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    StarRatingModule.forRoot()
      ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
