import { Component, OnInit, ViewChild } from '@angular/core';
import { ExportService } from '../export.service';
import { environment } from '../../environments/environment.development';
import { ProjectService } from '../services/project.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
 
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'], // Note: changed to `styleUrls`
})
export class TasksComponent implements OnInit {
  mapData: any | null = null;
  searchQuery: string = '';
  isPopupVisible: boolean = false;
 
  tasks: any[] = [];
 
  // taskData = [];
 
  filteredTaskData = this.tasks;
 // Paginated data
 paginatedData = this.tasks;

 // Set paginator view child
 @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
activeHeader: any;



 // Method to handle pagination changes
 setPaginatedData() {
  if (this.paginator) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    this.paginatedData = this.filteredTaskData.slice(startIndex, startIndex + this.paginator.pageSize);
  }
}

 // Called whenever the page is changed
 onPageChange(event: PageEvent) {
   this.setPaginatedData();
 }
 
  constructor(
    private exportService: ExportService,
    private projectService: ProjectService
  ) {
    if (this.mapData) this.mapData = this.projectService.getMapData();
  }
 
  ngOnInit() {
    let dum = {
      taskId: 'task_001',
      taskName: 'task_init',
      status: 'online',
      roboName:' agv_012',
      sourceDestination: 'N/A',
    };
    for(let i = 1; i <= 100; i++){
      this.tasks.push(dum)
    }
    this.filteredTaskData  = this.tasks;
    return
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

      this.setPaginatedData();
  }
 
  onSearch(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
 
    if (!inputValue) {
      this.filteredTaskData = this.tasks;
    } else {
      this.filteredTaskData = this.tasks.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(inputValue)
        )
      );
    }
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
    const data = this.tasks;
    switch (format) {
      case 'csv':
        this.exportService.exportToCSV(data, `TaskDataExport`);
        break;
      case 'excel':
        this.exportService.exportToExcel(data, `TaskDataExport`);
        break;
      case 'pdf':
        this.exportService.exportToPDF(data, 'TaskDataEXport');
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
 