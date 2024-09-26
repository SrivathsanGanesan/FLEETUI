import { Component } from '@angular/core';
import { fadeAnimation } from './app.animations';

import { LoaderService } from './loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [fadeAnimation]
})
export class AppComponent {
  title = 'FleetUI';
  getRouteAnimationData(outlet: any) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

 

  constructor(private loaderService: LoaderService) {}
  
}
