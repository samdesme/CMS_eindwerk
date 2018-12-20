import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { LoginComponent } from './components/auth/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileCreateComponent } from './components/profile/create/profile-create.component';


const routes: Routes = [
  { path: '', redirectTo: '/profile', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent},
  { path: 'profile/create/:id', component: ProfileCreateComponent },
  { path: 'login', component: LoginComponent },
  

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
