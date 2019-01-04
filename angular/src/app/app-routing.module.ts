import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileEditComponent } from './components/profile/profile-edit/profile-edit.component';
import { GoalCreateComponent } from './components/profile/goal-create/goal-create.component';
import { GoalEditComponent } from './components/profile/goal-edit/goal-edit.component';


const routes: Routes = [
  { path: '', redirectTo: '/profile', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent},

  { path: 'profile/edit/:id', component: ProfileEditComponent },
  { path: 'profile/goal/add/:id', component: GoalCreateComponent },
  { path: 'profile/goal/edit/:id', component: GoalEditComponent },


  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
