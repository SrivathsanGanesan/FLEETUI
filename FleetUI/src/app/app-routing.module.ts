import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProjectsetupComponent } from './projectsetup/projectsetup.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [AuthGuard], data: { animation: 'LoginPage' } },
  {
    path: 'project_setup',
    component: ProjectsetupComponent,
    canActivate: [AuthGuard],
    data: { animation: 'ProjectSetupPage' }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
