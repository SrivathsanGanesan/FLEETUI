import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProjectsetupComponent } from './projectsetup/projectsetup.component';
import { AuthGuard } from './auth.guard';
import { StatisticsComponent } from './statistics/statistics.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectGuard } from './guards/project.guard';
import { UserlogsComponent } from './userlogs/userlogs.component';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [AuthGuard], data: { animation: 'LoginPage' } },
  {
    path: 'project_setup',
    component: ProjectsetupComponent,
    canActivate: [AuthGuard],
    data: { animation: 'ProjectSetupPage' }
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
  },
  {
    path: 'userlogs',
    component: UserlogsComponent,
  },
  {
    path: 'configuration',
    component: ConfigurationComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, ProjectGuard], // Protect the dashboard with both AuthGuard and ProjectGuard
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
