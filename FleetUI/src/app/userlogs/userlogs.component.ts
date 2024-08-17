import { table } from 'console';
import { ExportService } from '../export.service';
import { Component, OnInit } from '@angular/core';
 
 
@Component({
  selector: 'app-userlogs',
  templateUrl: './userlogs.component.html',
  styleUrl: './userlogs.component.css'
})
 
export class Userlogscomponent {
activeFilter: any;
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

  searchQuery: string = '';
  isPopupVisible: boolean | undefined;
  isTransitioning: boolean = false;
  activeButton: string = 'task'; // Default active button
  activeHeader: string = 'Task reports'; // Default header
 

  setActiveButton(button: string) {
    this.activeButton = button;
    this.isTransitioning = true;
    setTimeout(() => {
      this.activeButton = button;
      this.activeHeader = this.getHeader(button);
      this.isTransitioning = false;
    }, 200); // 300ms matches the CSS transition duration
  }
 
  currentTable = 'task';
// Your task data
    taskData = [    
                       { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3' , column5: 'Row 1 Col 3',column6: 'Row 1 Col 3'},
                        { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3',column5: 'Row 1 Col 3' ,column6: 'Row 1 Col 3'},
                        { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3' ,column5: 'Row 1 Col 3',column6: 'Row 1 Col 3'},
                        { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3',column5: 'Row 1 Col 3' ,column6: 'Row 1 Col 3'},
                        { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3',column5: 'Row 1 Col 3' ,column6: 'Row 1 Col 3'},
                        { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3',column5: 'Row 1 Col 3' ,column6: 'Row 1 Col 3' }   ];
   
    // Your robot data
  robotData = [     { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3' , column5: 'Row 1 Col 3',column6: 'Row 1 Col 3'},
                    { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3',column5: 'Row 1 Col 3' ,column6: 'Row 1 Col 3'},
                    { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3' ,column5: 'Row 1 Col 3',column6: 'Row 1 Col 3'},
                    { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3',column5: 'Row 1 Col 3' ,column6: 'Row 1 Col 3'},
                    { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3',column5: 'Row 1 Col 3' ,column6: 'Row 1 Col 3'},
                    { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3',column5: 'Row 1 Col 3' ,column6: 'Row 1 Col 3' }   ];
                   
   // Your fleet data
    fleetData = [   
                        { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3' , column5: 'Row 1 Col 3',},
                        { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3',column5: 'Row 1 Col 3' ,},
                        { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3' ,column5: 'Row 1 Col 3',},
                        { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3',column5: 'Row 1 Col 3' ,},
                        { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3',column5: 'Row 1 Col 3' ,},
                        { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3',column5: 'Row 1 Col 3' , },
                        { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3',column5: 'Row 1 Col 3' ,},
                        { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3',column5: 'Row 1 Col 3' ,},
                        { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3',column5: 'Row 1 Col 3' ,},
                        { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3',column5: 'Row 1 Col 3' ,}, ];
                    
currentTab: any;
 
 
 
  showTable(table: string) {
    this.currentTable = table;
  }
 
  constructor(private exportService: ExportService) {}
 
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
        this.exportService.exportToExcel(data, `${this.currentTable}DataExport`);
        break;
      case 'pdf':
        this.exportService.exportToPDF(data, `${this.currentTable}DataExport`);
        break;
      default:
        console.error('Invalid export format');
    }
    this.closePopup(); // Close the popup after export
  }
 
  getHeader(button: string): string {
    switch (button) {
      case 'task':
        return 'Task reports';
      case 'robot':
        return 'Robot reports';
      case 'fleet':
        return 'Fleet reports';
      default:
        return 'Task reports';
    }
  }
 
  showPopup() {
    this.isPopupVisible = true;
 
  }
 
  closePopup() {
    this.isPopupVisible = false;
  
  }
  ONBtn: any;
  

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
    const startDateElement = document.getElementById('start-date') as HTMLInputElement;
    const endDateElement = document.getElementById('end-date') as HTMLInputElement;

    const startDate = startDateElement.value;
    const endDate = endDateElement.value;

    // Implement your date range filtering logic here
}

 
}
