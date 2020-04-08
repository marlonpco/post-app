import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { AuthGuard } from './authentication/auth.guard';

const routes: Routes = [
  { path: '', component: PostListComponent, canActivate: [AuthGuard] },
  { path: 'list', component: PostListComponent},
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: PostCreateComponent, canActivate: [AuthGuard]  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}
