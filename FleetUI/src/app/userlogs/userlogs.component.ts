import { environment } from '../../environments/environment.development';
import { ExportService } from '../export.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-userlogs',
  templateUrl: './userlogs.component.html',
  styleUrl: './userlogs.component.css',
})
export class Userlogscomponent {
  activeFilter: any;
  ONBtn: any;
  searchQuery: string = '';
  isPopupVisible: boolean | undefined;
  isTransitioning: boolean = false;
  activeButton: string = 'task'; // Default active button
  activeHeader: string = 'Task logs'; // Default header
  currentTable = 'task';
  currentTab: any;

  // Your task data
  taskData = [
    {
      dateTime: 'Sept 3, 3:30 AM',
      taskId: 'Task_001',
      taskName: 'drop packs',
      errCode: 'Err_001',
      criticality: 'medium',
      desc: 'latency occured',
    },
  ];

  // Your robot data
  robotData = [
    {
      column1: 'Row 1 Col 1',
      column2: 'Row 1 Col 2',
      column3: 'Row 1 Col 3',
      column4: 'Row 1 Col 3',
      column5: 'Row 1 Col 3',
      column6: 'Row 1 Col 3',
    },
    {
      column1: 'Row 2 Col 1',
      column2: 'Row 2 Col 2',
      column3: 'Row 2 Col 3',
      column4: 'Row 1 Col 3',
      column5: 'Row 1 Col 3',
      column6: 'Row 1 Col 3',
    },
    {
      column1: 'Row 1 Col 1',
      column2: 'Row 1 Col 2',
      column3: 'Row 1 Col 3',
      column4: 'Row 1 Col 3',
      column5: 'Row 1 Col 3',
      column6: 'Row 1 Col 3',
    },
    {
      column1: 'Row 2 Col 1',
      column2: 'Row 2 Col 2',
      column3: 'Row 2 Col 3',
      column4: 'Row 1 Col 3',
      column5: 'Row 1 Col 3',
      column6: 'Row 1 Col 3',
    },
    {
      column1: 'Row 1 Col 1',
      column2: 'Row 1 Col 2',
      column3: 'Row 1 Col 3',
      column4: 'Row 1 Col 3',
      column5: 'Row 1 Col 3',
      column6: 'Row 1 Col 3',
    },
    {
      column1: 'Row 2 Col 1',
      column2: 'Row 2 Col 2',
      column3: 'Row 2 Col 3',
      column4: 'Row 1 Col 3',
      column5: 'Row 1 Col 3',
      column6: 'Row 1 Col 3',
    },
  ];

  // Your fleet data
  fleetData = [
    {
      column1: 'Row 1 Col 1',
      column2: 'Row 1 Col 2',
      column3: 'Row 1 Col 3',
      column4: 'Row 1 Col 3',
      column5: 'Row 1 Col 3',
    },
    {
      column1: 'Row 2 Col 1',
      column2: 'Row 2 Col 2',
      column3: 'Row 2 Col 3',
      column4: 'Row 1 Col 3',
      column5: 'Row 1 Col 3',
    },
    {
      column1: 'Row 1 Col 1',
      column2: 'Row 1 Col 2',
      column3: 'Row 1 Col 3',
      column4: 'Row 1 Col 3',
      column5: 'Row 1 Col 3',
    },
    {
      column1: 'Row 2 Col 1',
      column2: 'Row 2 Col 2',
      column3: 'Row 2 Col 3',
      column4: 'Row 1 Col 3',
      column5: 'Row 1 Col 3',
    },
    {
      column1: 'Row 1 Col 1',
      column2: 'Row 1 Col 2',
      column3: 'Row 1 Col 3',
      column4: 'Row 1 Col 3',
      column5: 'Row 1 Col 3',
    },
    {
      column1: 'Row 2 Col 1',
      column2: 'Row 2 Col 2',
      column3: 'Row 2 Col 3',
      column4: 'Row 1 Col 3',
      column5: 'Row 1 Col 3',
    },
    {
      column1: 'Row 1 Col 1',
      column2: 'Row 1 Col 2',
      column3: 'Row 1 Col 3',
      column4: 'Row 1 Col 3',
      column5: 'Row 1 Col 3',
    },
    {
      column1: 'Row 1 Col 1',
      column2: 'Row 1 Col 2',
      column3: 'Row 1 Col 3',
      column4: 'Row 1 Col 3',
      column5: 'Row 1 Col 3',
    },
    {
      column1: 'Row 1 Col 1',
      column2: 'Row 1 Col 2',
      column3: 'Row 1 Col 3',
      column4: 'Row 1 Col 3',
      column5: 'Row 1 Col 3',
    },
    {
      column1: 'Row 1 Col 1',
      column2: 'Row 1 Col 2',
      column3: 'Row 1 Col 3',
      column4: 'Row 1 Col 3',
      column5: 'Row 1 Col 3',
    },
  ];

  constructor(private exportService: ExportService) {}

  togglePopup() {
    throw new Error('Method not implemented.');
  }
  exportAsPDF() {
    throw new Error('Method not implemented.');
  }
  exportAsExcel() {
    throw new Error('Method not implemented.');
  }
  exportAsCSV() {
    throw new Error('Method not implemented.');
  }

  onTabChange(arg0: string) {
    throw new Error('Method not implemented.');
  }

  setActiveButton(button: string) {
    this.activeButton = button;
    this.isTransitioning = true;
    setTimeout(() => {
      this.activeButton = button;
      this.activeHeader = this.getHeader(button);
      this.isTransitioning = false;
    }, 200); // 300ms matches the CSS transition duration
  }

  showTable(table: string) {
    this.currentTable = table;
  }

  setCurrentTable(table: string) {
    this.currentTable = table;
  }

  getCurrentTableData() {
    switch (this.currentTable) {
      case 'task':
        return this.taskData;
      case 'robot':
        return this.robotData;
      case 'fleet':
        return this.fleetData;
      default:
        return [];
    }
  }

  exportData(format: string) {
    const data = this.getCurrentTableData();
    switch (format) {
      case 'csv':
        this.exportService.exportToCSV(data, `${this.currentTable}DataExport`);
        break;
      case 'excel':
        this.exportService.exportToExcel(
          data,
          `${this.currentTable}DataExport`
        );
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

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
  }

  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value;
    // Implement your search logic here
  }

  onDateFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const filter = selectElement.value;
    // Implement your date filter logic here
  }

  onDateChange(event: Event): void {
    const startDateElement = document.getElementById(
      'start-date'
    ) as HTMLInputElement;
    const endDateElement = document.getElementById(
      'end-date'
    ) as HTMLInputElement;

    const startDate = startDateElement.value;
    const endDate = endDateElement.value;

    // Implement your date range filtering logic here
  }
}
