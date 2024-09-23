import { Component } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  selectedMap: any | null = null;
  categories: any[] = [
    { name: 'FIFO', key: 'A' },
    { name: 'LP', key: 'B' },
  ];

  selectedCategory: any = null; // Ensure no selection initially

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.selectedMap = this.projectService.getMapData();
  }

  async saveTaskParams() {
    if (!this.selectedCategory) {
      console.log('select type');
      return;
    }
    // console.log(this.selectedCategory.name); // handle data here..
    let response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/config-fleet-params/task`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mapId: this.selectedMap.id,
          taskManagerType: this.selectedCategory.name,
        }),
      }
    );

    let data = await response.json();
    console.log(data);
    if (data.isSet) console.log('configured!');
  }

  selectCategory(category: any) {
    this.selectedCategory = category;
  }
}
