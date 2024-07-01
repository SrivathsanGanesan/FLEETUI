import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProjectsetupComponent } from './projectsetup/projectsetup.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProjectsetupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    
  ],
  providers: [
    // provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
