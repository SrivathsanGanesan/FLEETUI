import { ExportService } from '../export.service';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent {
  @ViewChild('uploadedCanvas', { static: false }) uploadedCanvas!: ElementRef<HTMLCanvasElement>;

  fleetTab: string = 'general';
  filteredData: any;
  originalData: any;
  searchQuery: string = '';
  isPopupVisible: boolean | undefined;
  isTransitioning: boolean = false;
  activeButton: string = 'Environment'; // Default active button
  activeHeader: string = 'Environment'; // Default header
  chosenImageName = ''; // Initialize chosenImageName with an empty string
  imageHeight = 0; // Initialize imageHeight with a default value
  imageWidth = 0; // Initialize imageWidth with a default value
  imageUploaded: boolean = false; // To track if an image is uploaded
  imageFile: File | null = null; // Store the uploaded image file
  currentTable = 'Environment';
  currentTab: any;

  // Your task data
  EnvData = [
    { column1: 'Map 1', column2: 'Site 1', column3: 'Jul 5,2024. 14:00:17' },
    { column1: 'Map 2', column2: 'Site 2', column3: 'Jul 6,2024. 14:00:17' }
  ];
  robotData = [
    { column1: 'Robot 1', column2: '192.168.XX.XX' },
    { column1: 'Robot 2', column2: '192.168.XX.XX' }
  ];
  selectedrobotData = [
    { column1: '192.168.XX.XX', column2: ' ' },
    { column1: '192.168.XX.XX', column2: ' ' }
  ];

  constructor(private exportService: ExportService) {}

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input && input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      this.chosenImageName = this.imageFile.name;
    }
  }

  openImage(): void {
    if (this.imageFile && this.imageHeight && this.imageWidth) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = this.uploadedCanvas.nativeElement;
          canvas.width = this.imageWidth;
          canvas.height = this.imageHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, this.imageWidth, this.imageHeight);
            this.imageUploaded = true;
            this.closePopup();
          }
        };
      };
      reader.readAsDataURL(this.imageFile);
    }
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

  setFleetTab(tab: string): void {
    this.fleetTab = tab;
  }

  showTable(table: string) {
    this.currentTable = table;
  }

  setCurrentTable(table: string) {
    this.currentTable = table;
  }

  getCurrentTableData() {
    switch (this.currentTable) {
      case 'Environment':
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
      case 'Environment':
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
    const inputElement = event.target as HTMLInputElement | null;
    const query = inputElement?.value || '';
    // Implement your search logic here
  }

  onDateFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement | null;
    const filter = selectElement?.value || '';
    // Implement your date filter logic here
  }

  onDateChange(event: Event): void {
    const startDateElement = document.getElementById('start-date') as HTMLInputElement | null;
    const endDateElement = document.getElementById('end-date') as HTMLInputElement | null;

    const startDate = startDateElement?.value || '';
    const endDate = endDateElement?.value || '';

    // Implement your date range filtering logic here
  }

  editItem(item: any) {
    console.log('Edit item:', item);
    // Implement your edit logic here
  }

  deleteItem(item: any) {
    console.log('Delete item:', item);
    // Implement your delete logic here
  }

  addItem(item: any) {
    console.log('Add item:', item);
    // Implement your add logic here
  }

  blockItem(item: any) {
    console.log('Block item:', item);
    // Implement your block logic here
  }
}

function onDateFilterChange(event: Event | undefined, Event: { new(type: string, eventInitDict?: EventInit): Event; prototype: Event; readonly NONE: 0; readonly CAPTURING_PHASE: 1; readonly AT_TARGET: 2; readonly BUBBLING_PHASE: 3; }) {
  throw new Error('Function not implemented.');
}
