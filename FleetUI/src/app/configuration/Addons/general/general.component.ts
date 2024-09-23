import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ProjectService } from '../../../services/project.service';
import { environment } from '../../../../environments/environment.development';

interface DB {
  name: string;
  code: string;
}

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrl: './general.component.css',
})
export class GeneralComponent {
  // dtype: DB[] | undefined;
  // iptype: DB[] | undefined;

  selectedMap: any | null = null;

  formData: any = {
    selectedDb: '',
    selectedIp: '',
    selectedRoboManagerType: '',
    selectedTaskManagerType: '',
    fleetServerMode: 0,
    serverIP: '',
    serverPort: '',
    databaseIp: '',
    databaseName: '',
  };

  dtype: any[] = [
    { name: 'PostgreSQL', code: 'NY' },
    { name: 'MongoDB', code: 'RM' },
    { name: 'SQL', code: 'LDN' },
  ];

  iptype: any[] = [
    { name: 'Static', code: 'NY' },
    { name: 'Dynamic', code: 'RM' },
    { name: 'Public', code: 'LDN' },
    { name: 'Private', code: 'LDM' },
  ];

  robotManagerType: any[] = [
    { name: 'RMtype_1', code: 'NY' },
    { name: 'RMtype_2', code: 'RM' },
    { name: 'RMtype_3', code: 'LDN' },
  ];

  taskManagerType: any[] = [
    { name: 'TaskMtype_1', code: 'NY' },
    { name: 'TaskMtype_2', code: 'RM' },
    { name: 'TaskMtype_3', code: 'LDN' },
  ];

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.selectedMap = this.projectService.getMapData();
  }

  saveParams() {
    if (!this.selectedMap) {
      console.log('no map selected');
      return;
    }
    console.log(this.formData);
  }
}
