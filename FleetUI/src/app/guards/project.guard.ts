import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ProjectService } from '../services/project.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectGuard implements CanActivate {
  constructor(private projectService: ProjectService, private router: Router) {}

  canActivate(): boolean {
    if (this.projectService.isProjectCreated()) {
      return true;
    } else {
      this.router.navigate(['/project_setup']);
      return false;
    }
  }
}
