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

  saveCommParams() {
    this.formData.selectedCategory = this.selectedCategory.name;
    console.log(this.formData); // handle data here..
  }

  selectCategory(category: any) {
    this.selectedCategory = category; // Method to select a category programmatically
  }
}
