import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectCreatedKey = 'projectCreated';
  private selectedProjectKey = 'selectedProject';

  setProjectCreated(created: boolean) {
    localStorage.setItem(this.projectCreatedKey, JSON.stringify(created));
  }

  isProjectCreated(): boolean {
    const storedValue = localStorage.getItem(this.projectCreatedKey);
    return storedValue ? JSON.parse(storedValue) : false;
  }

  setSelectedProject(project: any) {
    localStorage.setItem(this.selectedProjectKey, JSON.stringify(project));
  }

  getSelectedProject() {
    const storedProject = localStorage.getItem(this.selectedProjectKey);
    return storedProject ? JSON.parse(storedProject) : null;
  }

  clearProjectData() {
    localStorage.removeItem(this.projectCreatedKey);
    localStorage.removeItem(this.selectedProjectKey);
  }
}
