import { environment } from '../../environments/environment.development';
import { ExportService } from '../export.service';
import { ChangeDetectorRef, Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-userlogs',
  templateUrl: './userlogs.component.html',
  styleUrls: ['./userlogs.component.css'], // Corrected styleUrl to styleUrls
})
export class Userlogscomponent implements OnInit, AfterViewInit {
  mapData: any | null = null;
  searchQuery: string = '';
  isPopupVisible: boolean = false;
  isTransitioning: boolean = false;
  activeButton: string = 'task'; // Default active button
  activeHeader: string = 'Task logs'; // Default header
  currentTable: string = 'task';
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  displayedColumns: string[] = ['dateTime', 'taskId', 'taskName', 'errCode', 'criticality', 'desc'];
  paginatedTaskData = new MatTableDataSource<any>([]);
  paginatedRobotData = new MatTableDataSource<any>([]);
  paginatedFleetData = new MatTableDataSource<any>([]);
activeTable: any;

  constructor(
    private exportService: ExportService,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.getTaskLogs();
    this.getRoboLogs();
    this.getFleetLogs();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginatedTaskData.paginator = this.paginator;
      this.paginatedRobotData.paginator = this.paginator;
      this.paginatedFleetData.paginator = this.paginator;
    }
  }

  getTaskLogs() {
    fetch(`http://${environment.API_URL}:${environment.PORT}/err-logs/task-logs/${this.mapData?.id}`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ timeStamp1: '', timeStamp2: '' }),
    })
      .then(response => response.json())
      .then(data => {
        const { taskLogs } = data;
        this.paginatedTaskData.data = taskLogs.notifications.map((taskErr: any) => ({
          dateTime: new Date().toDateString(),
          taskId: 'task_001',
          taskName: 'Pick Packs',
          errCode: taskErr.name,
          criticality: taskErr.criticality,
          desc: taskErr.description,
        }));
        this.setPaginatedData();
      })
      .catch(err => console.error(err));
  }

  getRoboLogs() {
    fetch(`http://${environment.API_URL}:${environment.PORT}/err-logs/robo-logs/${this.mapData?.id}`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ timeStamp1: '', timeStamp2: '' }),
    })
      .then(response => response.json())
      .then(data => {
        const { roboLogs } = data;
        this.paginatedRobotData.data = roboLogs.table[0].values.map((roboErr: any) => ({
          dateTime: new Date().toDateString(),
          roboId: roboErr.ROBOT_ID,
          roboName: roboErr.ROBOT_NAME,
          errCode: '100',
          criticality: Math.floor(Math.random() * 10),
          desc: roboErr.DESCRIPTION,
        }));
        this.setPaginatedData();
      })
      .catch(err => console.error(err));
  }

  getFleetLogs() {
    fetch(`http://${environment.API_URL}:${environment.PORT}/err-logs/fleet-logs/${this.mapData?.id}`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ timeStamp1: '', timeStamp2: '' }),
    })
      .then(response => response.json())
      .then(data => {
        const { fleetLogs } = data;
        this.paginatedFleetData.data = fleetLogs.map((fleetErr: any) => ({
          dateTime: new Date().toDateString(),
          moduleName: fleetErr.moduleName,
          errCode: fleetErr.errCode,
          criticality: fleetErr.criticality,
          desc: fleetErr.desc,
        }));
        this.setPaginatedData();
      })
      .catch(err => console.error(err));
  }

  setPaginatedData() {
    if (this.paginator) {
      switch (this.currentTable) {
        case 'task':
          this.paginatedTaskData.paginator = this.paginator;
          break;
        case 'robot':
          this.paginatedRobotData.paginator = this.paginator;
          break;
        case 'fleet':
          this.paginatedFleetData.paginator = this.paginator;
          break;
        default:
          break;
      }
      // Trigger update to reflect paginator changes
      this.paginatedTaskData._updateChangeSubscription();
      this.paginatedRobotData._updateChangeSubscription();
      this.paginatedFleetData._updateChangeSubscription();
    }
  }

  showTable(table: string) {
    this.currentTable = table;
    this.setPaginatedData();
  }

  onPageChange(event: PageEvent) {
    // Handle page change if needed
  }

  togglePopup() {
    this.isPopupVisible = !this.isPopupVisible;
  }

  exportAsPDF() {
    this.exportData('pdf');
  }

  exportAsExcel() {
    this.exportData('excel');
  }

  exportAsCSV() {
    this.exportData('csv');
  }

  exportData(format: string) {
    const data = this.getCurrentTableData();
    switch (format) {
      case 'csv':
        this.exportService.exportToCSV(data, `${this.currentTable}DataExport`);
        break;
      case 'excel':
        this.exportService.exportToExcel(data, `${this.currentTable}DataExport`);
        break;
      case 'pdf':
        this.exportService.exportToPDF(data, `${this.currentTable}DataExport`);
        break;
      default:
        console.error('Invalid export format');
    }
  }

  getHeader(button: string): string {
    switch (button) {
      case 'task':
        return 'Task logs';
      case 'robot':
        return 'Robot logs';
      case 'fleet':
        return 'Fleet logs';
      default:
        return 'Task logs';
    }
  }

  showPopup() {
    this.isPopupVisible = true;
  }

  onClose() {
    this.isPopupVisible = false;
  }

  setActiveButton(button: string) {
    this.activeButton = button;
    this.isTransitioning = true;
    setTimeout(() => {
      this.activeButton = button;
      this.activeHeader = this.getHeader(button);
      this.isTransitioning = false;
    }, 200); // 200ms to match CSS transition duration
  }

  getCurrentTableData() {
    switch (this.currentTable) {
      case 'task':
        return this.paginatedTaskData.data;
      case 'robot':
        return this.paginatedRobotData.data;
      case 'fleet':
        return this.paginatedFleetData.data;
      default:
        return [];
    }
  }
}
