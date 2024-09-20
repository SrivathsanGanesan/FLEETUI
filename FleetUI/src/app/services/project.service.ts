import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

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

  setMapData(mapData: any) {
    this.cookieService.set('map-data', JSON.stringify(mapData), {
      path: '/',
    });
  }

  clearMapData() {
    this.cookieService.delete('map-data', '/');
  }

  getMapData() {
    const storedMap = this.cookieService.get('map-data');
    return storedMap ? JSON.parse(storedMap) : null;
  }

  // track map is selected..
  setIsMapSet(state: boolean) {
    this.cookieService.set('_isMapSet', JSON.stringify(state));
  }

  getIsMapSet(): boolean {
    const isMapSet = this.cookieService.get('_isMapSet');
    return isMapSet ? JSON.parse(isMapSet) : false;
  }

  clearIsMapSet() {
    this.cookieService.delete('_isMapSet', '/');
  }

  // setNode() {
  //   this.cookieService.set('nodes', JSON.stringify([{ id: 1, name: 'node1' }]));
  // }
}
