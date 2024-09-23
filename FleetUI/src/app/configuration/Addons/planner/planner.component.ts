import { Component } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { environment } from '../../../../environments/environment.development';

interface DB {
  name: string;
  code: string;
}
@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrl: './planner.component.css',
})
export class PlannerComponent {
  // plannerType: DB[] | undefined;
  selectedMap: any | null = null;
  selectedPlanner: any | null = null;

  plannerType: DB[] = [
    { name: 'ASipp', code: 'ASipp' },
    { name: 'NodeGraph', code: 'NodeGraph' },
  ];

  formData: any = {
    plannerType: '',
    externalInterfaceType: '',
    maxLinearVelocity: '',
    maxRobotsCount: '',
    safeThreshhold: '',
    lookAhead: '',
    maxPointstoRes: '',
    FOV: '',
  };

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.selectedMap = this.projectService.getMapData();
  }

  async savePlanner() {
    if (!this.selectedMap) return;
    if (!this.selectedPlanner) {
      console.log('select planner type');
      return;
    }
    this.formData.plannerType = this.selectedPlanner.name;
    // console.log(this.formData); handle here..
    let response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/config-fleet-params/planner`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mapId: this.selectedMap.id,
          plannerParams: this.formData,
        }),
      }
    );

    let data = await response.json();
    console.log(data);
    if (data.isSet) console.log('configured!');
  }
}
