import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CreatePostComponent } from './create-post/create-post.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'register', pathMatch: 'full' }, 
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] }, 
  { path: 'create-post', component: CreatePostComponent },
//   { path: '', redirectTo: '/dashboard', pathMatch: 'full' },  // Redirecting to dashboard by default
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
