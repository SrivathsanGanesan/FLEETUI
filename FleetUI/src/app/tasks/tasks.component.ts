import { Component, OnInit } from '@angular/core';
import { ExportService } from '../export.service';
import { environment } from '../../environments/environment.development';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'], // Note: changed to `styleUrls`
})
export class TasksComponent implements OnInit {
  mapData: any | null = null;
  searchQuery: string = '';
  isPopupVisible: boolean = false;
  activeFilter: string = 'today'; // Default filter
  activeHeader: string = 'Tasks'; // Default header
  currentTable: string = 'task'; // Default table
  tasks: any[] = [];

  

  taskData = [
    {
      taskId: 'task_001',
      taskStatus: 'Row 1 Col 2',
      taskAllocatedAT: 'Row 1 Col 3',
      completedAt: 'Row 1 Col 3',
      sourceLocation: 'Row 1 Col 3',
      taskType: 'Pickup',
      roboId: 'Row 1 Col 3',
    },
    {
      taskId: 'task_001',
      taskStatus: 'Row 1 Col 2',
      taskAllocatedAT: 'Row 1 Col 3',
      completedAt: 'Row 1 Col 3',
      sourceLocation: 'Row 1 Col 3',
      taskType: 'Pickup',
      roboId: 'Row 1 Col 3',
    },
  ];

  filteredTaskData = this.tasks;
paginatedTaskData: any;
paginator: any;

  constructor(
    private exportService: ExportService,
    private projectService: ProjectService
  ) {
    if (this.mapData) this.mapData = this.projectService.getMapData();
  }

  ngOnInit() {
    this.mapData = this.projectService.getMapData();
    if (!this.mapData) return;

    fetch(
      `http://${environment.API_URL}:${environment.PORT}/fleet-tasks/${this.mapData.id}`,
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ timeStamp1: '', timeStamp2: '' }),
      }
    )
      .then((response) => {
        // if (!response.ok)
        //   throw new Error(`Error with status code of : ${response.status}`);
        return response.json();
      })
      .then((data) => {
        // console.log(data.tasks);
        const { tasks } = data;
        this.tasks = tasks.map((task: any) => {
          return {
            taskId: task.task_id,
            taskName: task.sub_task[0]?.task_type
              ? task.sub_task[0]?.task_type
              : 'N/A',
            status: task.task_status.status,
            roboName: task.agent_name,
            sourceDestination: task.sub_task[0]?.source_location
              ? task.sub_task[0]?.source_location
              : 'N/A',
          };
        });
        this.filteredTaskData = this.tasks;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onSearch(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value.toLowerCase();

    if (!inputValue) {
      this.filteredTaskData = this.taskData;
    } else {
      this.filteredTaskData = this.taskData.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(inputValue)
        )
      );
    }
  }

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
    // Implement your filtering logic here
  }

  onDateChange(event: Event): void {
    const startDate = (
      document.getElementById('start-date') as HTMLInputElement
    ).value;
    const endDate = (document.getElementById('end-date') as HTMLInputElement)
      .value;
    // Implement your date range filtering logic here
  }

  exportData(format: string) {
    const data = this.taskData;
    switch (format) {
      case 'csv':
        this.exportService.exportToCSV(data, `TaskDataExport`);
        break;
      case 'excel':
        this.exportService.exportToExcel(data, `TaskDataExport`);
        break;
      case 'pdf':
        this.exportService.exportToPDF(data, `TaskDataExport`);
        break;
      default:
        console.error('Invalid export format');
    }
  }

  showPopup() {
    this.isPopupVisible = true;
  }

  onClose() {
    this.isPopupVisible = false;
  }
}
