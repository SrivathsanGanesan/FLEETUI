import { Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ExportService } from '../export.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('uploadedCanvas', { static: false }) uploadedCanvas!: ElementRef<HTMLCanvasElement>;

  fleetTab: string = 'general';
  filteredData: any;
  originalData: any;
  searchQuery: string = '';
  isPopupVisible: boolean = false;
  isTransitioning: boolean = false;
  activeButton: string = 'Environment'; // Default active button
  activeHeader: string = 'Environment'; // Default header
  chosenImageName = ''; // Initialize chosenImageName with an empty string
  imageHeight = 0; // Initialize imageHeight with a default value
  imageWidth = 0; // Initialize imageWidth with a default value
  imageUploaded: boolean = false; // To track if an image is uploaded
  imageFile: File | null = null; // Store the uploaded image file
  isImageOpened: boolean = false; // Track if the image is opened in the canvas
  currentTable = 'Environment';
  currentTab: any;

  EnvData = [
    { column1: 'Map 1', column2: 'Site 1', column3: 'Jul 5, 2024. 14:00:17' },
    { column1: 'Map 2', column2: 'Site 2', column3: 'Jul 6, 2024. 14:00:17' }
  ];
  robotData = [
    { column1: 'Robot 1', column2: '192.168.XX.XX' },
    { column1: 'Robot 2', column2: '192.168.XX.XX' }
  ];
  selectedrobotData = [
    { column1: '192.168.XX.XX', column2: ' ' },
    { column1: '192.168.XX.XX', column2: ' ' }
  ];

  constructor(private exportService: ExportService, private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // Any initialization that requires the view to be fully loaded can go here.
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  calibrateCoordinates() {
    // Add your calibration logic here
    console.log("Calibrate Coordinates button clicked!");
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      this.chosenImageName = this.imageFile.name;
    }
  }

  openImage() {
    if (this.imageFile) {
      this.isImageOpened = true;
      this.cdRef.detectChanges(); // Ensure view updates before drawing the image
  
      const canvas = this.uploadedCanvas?.nativeElement;
      if (!canvas) {
        console.error('Canvas element not found');
        return;
      }
  
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get canvas context');
        return;
      }
  
      // Set fixed canvas dimensions
      canvas.width = 1400; // Fixed width
      canvas.height = 600; // Fixed height
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }
  
  isCalibrationLayerVisible = false;

  showCalibrationLayer() {
    this.isCalibrationLayerVisible = true;
  }

  hideCalibrationLayer() {
    this.isCalibrationLayerVisible = false;
  }

  // Add methods for each button's functionality
  addNode() {
    console.log("Add Node clicked");
  }

  connectivity() {
    console.log("Connectivity clicked");
  }

  zones() {
    console.log("Zones clicked");
  }

  addAssets() {
    console.log("Add Assets clicked");
  }

  addRobots() {
    console.log("Add Robots clicked");
  }

  removeRobots() {
    console.log("Remove Robots clicked");
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
    this.isImageOpened = false;
    this.chosenImageName = '';
    this.imageHeight = 0;
    this.imageWidth = 0;
  }

  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement?.value || '';
    // Implement your search logic here
  }

  onDateFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const filter = selectElement?.value || '';
    // Implement your date filter logic here
  }

  onDateChange(event: Event): void {
    const startDateElement = document.getElementById('start-date') as HTMLInputElement;
    const endDateElement = document.getElementById('end-date') as HTMLInputElement;

    const startDate = startDateElement?.value || '';
    const endDate = endDateElement?.value || '';

    // Implement your date range filtering logic here
  }

  editItem(item: any) {
    console.log('Edit item:', item);
  }

  deleteItem(item: any) {
    console.log('Delete item:', item);
  }

  addItem(item: any) {
    console.log('Add item:', item);
  }

  blockItem(item: any) {
    console.log('Block item:', item);
  }
}
