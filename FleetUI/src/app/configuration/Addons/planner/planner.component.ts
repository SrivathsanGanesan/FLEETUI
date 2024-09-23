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

  savePlanner() {
    if (!this.selectedMap) return;
    this.formData.plannerType = this.selectedPlanner.name;
    // console.log(this.formData); handle here..
  }
}
