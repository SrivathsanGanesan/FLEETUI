import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectCreated = false;

  setProjectCreated(created: boolean) {
    this.projectCreated = created;
  }

  isProjectCreated(): boolean {
    return this.projectCreated;
  }
}
