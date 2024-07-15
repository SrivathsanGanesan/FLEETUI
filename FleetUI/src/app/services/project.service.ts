import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectCreatedKey = 'projectCreated';

  setProjectCreated(created: boolean) {
    localStorage.setItem(this.projectCreatedKey, JSON.stringify(created));
  }

  isProjectCreated(): boolean {
    const storedValue = localStorage.getItem(this.projectCreatedKey);
    return storedValue ? JSON.parse(storedValue) : false;
  }
}
