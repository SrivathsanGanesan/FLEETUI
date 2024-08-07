import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectService } from '../services/project.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectGuard implements CanActivate {
  constructor(private projectService: ProjectService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;
    return this.checkProjectExist(url);
  }

  checkProjectExist(url: string): boolean {
    if (this.projectService.isProjectCreated()) {
      if (url === '/project_setup') {
        this.router.navigate(['/dashboard']);
        return false;
      }
      return true;
    } else {
      if (url !== '/project_setup') {
        this.router.navigate(['/project_setup']);
      }
      return false;
    }
  }
}
