import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private envDataSubject = new BehaviorSubject<any[]>([
    { column1: 'Map 1', column2: 'Site 1', column3: 'Jul 4, 2024. 14:00:17' },
    { column1: 'Map 2', column2: 'Site 2', column3: 'Jul 15, 2024. 14:00:17' },
    { column1: 'Map 3', column2: 'Site 4', column3: 'Jul 28, 2024. 14:00:17' },
  ]);
  envData = this.envDataSubject.asObservable();
  getEnvData() {
    return this.envDataSubject.getValue();
  }
  updateEnvData(newEnvData: any[]) {
    this.envDataSubject.next(newEnvData);
  }
  constructor() {}
}
