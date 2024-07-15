import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProjectsetupComponent } from './projectsetup/projectsetup.component';
import { AuthGuard } from './auth.guard';
import { StatisticsComponent } from './statistics/statistics.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogsComponent } from './logs/logs.component';
import { ProjectGuard } from './guards/project.guard';
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
    path: 'configuration',
    component: ConfigurationComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard,ProjectGuard]
  },
  {
    path: 'logs',
    component: LogsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
