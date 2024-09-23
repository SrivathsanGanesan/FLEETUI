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
    serverIP: '0.0.0.0',
    serverPort: '8080',
    databaseIp: '0.0.0.0',
    databaseName: '',
  };

  selectedDb: any = { name: '', code: '' };
  selectedIp: any = { name: '', code: '' };
  selectedRoboManagerType: any = { name: '', code: '' };
  selectedTaskManagerType: any = { name: '', code: '' };

  dtype: any[] = [
    { name: 'PostgreSQL', code: 'NY' },
    { name: 'MongoDB', code: 'RM' },
    { name: 'SQL', code: 'LDN' },
  ];

  iptype: any[] = [
    { name: 'Static', code: 'NY' },
    { name: 'Dynamic', code: 'RMD' },
    { name: 'Public', code: 'LDN' },
    { name: 'Private', code: 'LDM' },
  ];

  robotManagerType: any[] = [
    { name: 'RMtype_1', code: 'MY' },
    { name: 'RMtype_2', code: 'RO' },
    { name: 'RMtype_3', code: 'LDC' },
  ];

  taskManagerType: any[] = [
    { name: 'TaskMtype_1', code: 'UY' },
    { name: 'TaskMtype_2', code: 'RI' },
    { name: 'TaskMtype_3', code: 'LQN' },
  ];

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.selectedMap = this.projectService.getMapData();
  }

  async saveParams() {
    if (!this.selectedMap) {
      console.log('no map selected');
      return;
    }
    this.formData.selectedDb = this.selectedDb.name;
    this.formData.selectedIp = this.selectedIp.name;
    this.formData.selectedRoboManagerType = this.selectedRoboManagerType.name;
    this.formData.selectedTaskManagerType = this.selectedTaskManagerType.name;
    console.log(this.formData); // handle the form here..
    let response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/config-fleet-params/general`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mapId: this.selectedMap.id,
          generalParams: this.formData,
        }),
      }
    );

    let data = await response.json();
    console.log(data);
    if (data.isSet) console.log('configured!');
  }
}
