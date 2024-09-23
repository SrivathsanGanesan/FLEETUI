import { Component } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrl: './communication.component.css',
})
export class CommunicationComponent {
  categories: any[] = [
    { name: 'FastDDS', key: 'A' },
    { name: 'MarkFastDDSNATeting', key: 'M' },
    { name: 'Simulation', key: 'P' },
    { name: 'SimulationSocket', key: 'R' },
    { name: 'Socket', key: 'S' },
    { name: 'MQTT', key: 'Q' },
  ];

  selectedMap: any | null = null;
  selectedCategory: any = null; // No initial selection

  formData: any = {
    externalInterfaceIp: '',
    externalInterfaceType: '',
    roboInterfaceIp: '',
    roboInterfaceType: '',
    selectedCategory: '',
  };

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.selectedMap = this.projectService.getMapData();
  }

  async saveCommParams() {
    if (!this.selectedCategory) {
      console.log('select type');
      return;
    }
    this.formData.selectedCategory = this.selectedCategory.name;
    // console.log(this.formData); // handle data here..
    let response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/config-fleet-params/communication`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mapId: this.selectedMap.id,
          communicationParams: this.formData,
        }),
      }
    );

    let data = await response.json();
    console.log(data);
    if (data.isSet) console.log('configured!');
  }

  selectCategory(category: any) {
    this.selectedCategory = category; // Method to select a category programmatically
  }
}
