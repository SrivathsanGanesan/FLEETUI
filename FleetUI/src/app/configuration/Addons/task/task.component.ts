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

  saveTaskParams() {
    console.log(this.selectedCategory.name); // handle data here..
  }

  selectCategory(category: any) {
    this.selectedCategory = category;
  }
}
