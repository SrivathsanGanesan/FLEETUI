import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProjectsetupComponent } from './projectsetup/projectsetup.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavbarComponent } from './sidenavbar/sidenavbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { Userlogscomponent } from './userlogs/userlogs.component';
import { UsermanagementComponent } from './usermanagement/usermanagement.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartComponent } from './chart/chart.component';
import { UptimeComponent } from './uptime/uptime.component';
import { ThroughputComponent } from './throughput/throughput.component';
import { IPScannerComponent } from './ipscanner/ipscanner.component';
import { MatTabsModule } from '@angular/material/tabs';
import { RobotParametersPopupComponent } from './robot-parameters-popup/robot-parameters-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidenavbarComponent,
    DashboardComponent,
    ProjectsetupComponent,
    ConfigurationComponent,
    UsermanagementComponent,
    Userlogscomponent,
    StatisticsComponent,
    ChartComponent,
    UptimeComponent,
    ThroughputComponent,
    IPScannerComponent,
    RobotParametersPopupComponent,
    
  ],
  imports: [
    NgApexchartsModule,
    BrowserModule,
    AppRoutingModule,
    MatTabsModule,
    BrowserAnimationsModule,
    FormsModule,
    BrowserModule,
    
  ],
  providers: [
    // provideClientHydration()

    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
