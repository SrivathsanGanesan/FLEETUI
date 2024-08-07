import { ExportService } from '../export.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent {
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
    fleetTab: string = 'general';
    filteredData: any;
    originalData: any;
    searchQuery: string = '';
    isPopupVisible: boolean | undefined;
    isTransitioning: boolean = false;
    activeButton: string = 'task'; // Default active button
    activeHeader: string = 'Environment '; // Default header
   
  
    isSameMonth(itemDate: Date, arg1: Date) {
      throw new Error('Method not implemented.');
    }
    isSameWeek(itemDate: Date, arg1: Date) {
      throw new Error('Method not implemented.');
    }
    isSameDay(itemDate: Date, arg1: Date) {
      throw new Error('Method not implemented.');
    }
   
    setActiveButton(button: string) {
      this.activeButton = button;
      this.isTransitioning = true;
      setTimeout(() => {
        this.activeButton = button;
        this.activeHeader = this.getHeader(button);
        this.isTransitioning = false;
    
        // Set the current table and tab based on the button
        if (button === 'fleet') {
          this.currentTable = 'fleet';
          this.currentTab = 'fleet';
        } else {
          this.currentTable = button;
          this.currentTab = button;
        }
      }, 200); // 200ms matches the CSS transition duration
    }
   
    currentTable = 'task';
  // Your task data
      EnvData = [    { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3' },
                      
                      { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3' }  ];
     
      // Your robot data
    robotData = [     { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3' },
                      
                      { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3' }   ];
                     
     
     
  currentTab: any;
   
   
  setFleetTab(tab: string): void {
    this.fleetTab = tab;
  }
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
          return this.EnvData;
        case 'robot':
          return this.robotData;
        
          
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
          return 'Environment';
        case 'robot':
          return 'Robot';
        case 'fleet':
          return 'Fleet';
        default:
          return 'Environment';
      }
    }
   
    showPopup() {
      this.isPopupVisible = true;
   
    }
   
    closePopup() {
      this.isPopupVisible = false;
    
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
  
  function onDateFilterChange(event: Event | undefined, Event: { new(type: string, eventInitDict?: EventInit): Event; prototype: Event; readonly NONE: 0; readonly CAPTURING_PHASE: 1; readonly AT_TARGET: 2; readonly BUBBLING_PHASE: 3; }) {
    throw new Error('Function not implemented.');
  
   
  }
  