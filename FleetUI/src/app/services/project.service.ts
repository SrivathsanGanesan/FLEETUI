import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import path from 'path';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectCreatedKey = 'is-project-setted';
  private selectedProjectKey = 'project-data';

  constructor(private cookieService: CookieService) {}

  setProjectCreated(created: boolean) {
    this.cookieService.set('is-project-setted', JSON.stringify(created), {
      path: '/',
    });
    // localStorage.setItem(this.projectCreatedKey, JSON.stringify(created));
  }

  isProjectCreated(): boolean {
    const storedValue = this.cookieService.get('is-project-setted');
    return storedValue ? JSON.parse(storedValue) : false;
  }

  setSelectedProject(project: any) {
    this.cookieService.set('project-data', JSON.stringify(project), {
      path: '/',
    });
  }

  getSelectedProject() {
    const storedProject = this.cookieService.get('project-data');
    return storedProject ? JSON.parse(storedProject) : null;
  }

  clearProjectData() {
    this.cookieService.delete('project-data', '/');
    this.cookieService.delete('is-project-setted', '/');
  }
}
