import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProjectsetupComponent } from './projectsetup/projectsetup.component';
import { AuthGuard } from './auth.guard';
import { StatisticsComponent } from './statistics/statistics.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectGuard } from './guards/project.guard';
import { Userlogscomponent } from './userlogs/userlogs.component';
import { UsermanagementComponent } from './usermanagement/usermanagement.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: { animation: 'LoginPage' },
  },
  {
    path: 'project_setup',
    component: ProjectsetupComponent,
    canActivate: [ProjectGuard],
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
    canActivate: [AuthGuard, ProjectGuard],
  },
  {
    path: 'Reports',
    component: Userlogscomponent,
    canActivate: [AuthGuard, ProjectGuard],
  },
  {
    path: 'configuration',
    component: ConfigurationComponent,
    canActivate: [AuthGuard, ProjectGuard],
  },
  {
    path: 'usermanagement',
    component: UsermanagementComponent,
    canActivate: [AuthGuard, ProjectGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, ProjectGuard], // Ensure both guards are here
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
