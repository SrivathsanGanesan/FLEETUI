import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, retry } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectCreatedKey = 'is-project-setted';
  private selectedProjectKey = 'project-data';

  private inLive: BehaviorSubject<boolean> = new BehaviorSubject<boolean>( false );
  private isFleetUp: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  initializeMapSelectedStatus: any
  showModelCanvas: boolean = false;

  inLive$ = this.inLive.asObservable();
  isFleetUp$ = this.isFleetUp.asObservable();

  constructor(private cookieService: CookieService, private http: HttpClient) {}

  private apiUrl = `http://${environment.API_URL}:${environment.PORT}/get_robot_utilization`;

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

  clearAllUserState() {
    this.cookieService.delete('_user', '/');
    this.cookieService.deleteAll();
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

  setInLive(value: boolean): void {
    this.inLive.next(value);
  }

  getInLive(): boolean {
    return this.inLive.getValue();
  }

  getIsFleetUp(): boolean {
    return this.isFleetUp.getValue();
  }

  setIsFleetUp(value: boolean): void {
    this.isFleetUp.next(value);
  }

  getRobotUtilization(mapId: string, timeStamp1: number, timeStamp2: number): Observable<any> {
    return this.http.post(this.apiUrl, { mapId, timeStamp1, timeStamp2 });
  }

  setInitializeMapSelected(value:boolean){
    this.initializeMapSelectedStatus=value
    // console.log('set initializer called and status--->',this.initializeMapSelectedStatus)
    this.cookieService.set('mapInitializeStatus',this.initializeMapSelectedStatus)
  }

  getInitializeMapSelected(){
    // console.log('get initialize called and status -->',this.cookieService.get('mapInitializeStatus'))
    return this.cookieService.get('mapInitializeStatus');
  }

  setShowModelCanvas(state: boolean) {
    this.showModelCanvas = state;
  }

  getShowModelCanvas():boolean{
    return this.showModelCanvas;
  }
}
