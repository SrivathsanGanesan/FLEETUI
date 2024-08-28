import { Component, OnInit } from '@angular/core';
import { ExportService } from '../export.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'] // Note: changed to `styleUrls`
})
export class TasksComponent implements OnInit {

  searchQuery: string = '';
  isPopupVisible: boolean = false;
  activeFilter: string = 'today'; // Default filter
  activeHeader: string = 'Tasks'; // Default header
  currentTable: string = 'task'; // Default table

  taskData = [
    { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3', column5: 'Row 1 Col 3', column6: 'Row 1 Col 3' },
    { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3', column5: 'Row 1 Col 3', column6: 'Row 1 Col 3' },
    { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3', column5: 'Row 1 Col 3', column6: 'Row 1 Col 3' },
    { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3', column5: 'Row 1 Col 3', column6: 'Row 1 Col 3' },
    { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3', column5: 'Row 1 Col 3', column6: 'Row 1 Col 3' },
    { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3', column5: 'Row 1 Col 3', column6: 'Row 1 Col 3' },
    { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3', column5: 'Row 1 Col 3', column6: 'Row 1 Col 3' },
    { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3', column5: 'Row 1 Col 3', column6: 'Row 1 Col 3' },
    { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3', column5: 'Row 1 Col 3', column6: 'Row 1 Col 3' },
    { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3', column5: 'Row 1 Col 3', column6: 'Row 1 Col 3' },
    { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3', column5: 'Row 1 Col 3', column6: 'Row 1 Col 3' },
    { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3', column5: 'Row 1 Col 3', column6: 'Row 1 Col 3' },
    // Add more data as necessary
  ];

  constructor(private exportService: ExportService) {}

  ngOnInit(): void {}

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
    // Implement your filtering logic here
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    // Implement your search logic here
  }

  onDateChange(event: Event): void {
    const startDate = (document.getElementById('start-date') as HTMLInputElement).value;
    const endDate = (document.getElementById('end-date') as HTMLInputElement).value;
    // Implement your date range filtering logic here
  }

  exportData(format: string) {
    const data = this.taskData; // We only have one table now
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
    this.closePopup();
  }

  showPopup() {
    this.isPopupVisible = true;
  }

  closePopup() {
    this.isPopupVisible = false;
  }
}
