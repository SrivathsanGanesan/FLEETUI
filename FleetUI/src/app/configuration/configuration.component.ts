import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { ExportService } from '../export.service';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { RobotParametersPopupComponent } from '../robot-parameters-popup/robot-parameters-popup.component';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'],
})
export class ConfigurationComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('uploadedCanvas', { static: false })
  uploadedCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('overlayLayer', { static: false }) overlayLayer!: ElementRef;

  nodes: Array<{ x: number; y: number; id: number }> = [];
  selectedNode: { x: number; y: number; id: number } | null = null;
  nodeIdCounter: number = 0; // Counter to generate unique IDs for each node
  fleetTab: string = 'general';
  filteredData: any;
  originalData: any;
  searchQuery: string = '';
  isPopupVisible: boolean = false;
  isTransitioning: boolean = false;
  activeButton: string = 'Environment'; // Default active button
  activeHeader: string = 'Environment'; // Default header
  chosenImageName = ''; // Initialize chosenImageName with an empty string
  imageUploaded: boolean = false; // To track if an image is uploaded
  imageFile: File | null = null; // Store the uploaded image file
  isImageOpened: boolean = false; // Track if the image is opened in the canvas
  currentTable = 'Environment';
  currentTab: any;
  imageHeight: number = 0; // Height in meters
  imageWidth: number = 0; // Width in meters
  pixelsPerMeter: number = 0; // Pixels per meter
  private backgroundImage: HTMLImageElement | null = null;
  isConnectivityModeActive: boolean = false; // Track if connectivity mode is active
  connectivityPoints: { x: number; y: number }[] = []; // Store selected points for connectivity

  EnvData: any[] = [
    { column1: 'Map 1', column2: 'Site 1', column3: 'Jul 4, 2024. 14:00:17' },
    { column1: 'Map 2', column2: 'Site 2', column3: 'Jul 15, 2024. 14:00:17' },
    { column1: 'Map 3', column2: 'Site 4', column3: 'Jul 28, 2024. 14:00:17' },
  ];

  // Update EnvData in both the component and service
  // this.EnvData.push([newEntry]);
  // this.sharedDataService.updateEnvData([...this.EnvData]);

  ngOnChanges() {
    this.filterData();
  }

  searchTerm: string = '';
  filteredEnvData: any[] = [];
  filteredRobotData: any[] = [];
  filterData() {
    const term = this.searchTerm.toLowerCase();

    if (this.currentTable === 'Environment') {
      this.filteredEnvData = this.EnvData.filter((item) => {
        const date = new Date(item.column3);
        const withinDateRange =
          (!this.startDate || date >= this.startDate) &&
          (!this.endDate || date <= this.endDate);

        return (
          (item.column1.toLowerCase().includes(term) ||
            item.column2.toLowerCase().includes(term) ||
            item.column3.toLowerCase().includes(term)) &&
          withinDateRange
        );
      });
    } else if (this.currentTable === 'robot') {
      this.filteredRobotData = this.robotData.filter(
        (item) =>
          item.column1.toLowerCase().includes(term) ||
          item.column2.toLowerCase().includes(term)
      );
    }
  }
  robotData: any[] = [
    { column1: 'Robot 1', column2: '192.168.XX.XX' },
    { column1: 'Robot 2', column2: '192.168.XX.XX' },
  ];
  selectedrobotData = [
    { column1: '192.168.XX.XX', column2: ' ' },
    { column1: '192.168.XX.XX', column2: ' ' },
  ];

  constructor(private cdRef: ChangeDetectorRef) {}
  loadData() {
    // Fetch or initialize data here
    this.EnvData = []; // Replace with actual data fetching
    this.filterData(); // Initial filter application
  }

  ngAfterViewInit() {}
  drawConnectivity() {
    const canvas = this.uploadedCanvas?.nativeElement;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    const [start, end] = this.connectivityPoints;
    if (start && end) {
      // Draw a line between the two points
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);

      // Set line style
      ctx.strokeStyle = 'orange';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw arrow or other indication if needed
      // (optional, for visualization)
    }
  }
  isRobotPopupVisible: boolean = false;

  robots = [
    { id: 1, name: 'Robot A' },
    { id: 2, name: 'Robot B' },
  ];

  selectedRobots: any[] = [];
  showRobotPopup() {
    this.isRobotPopupVisible = true;
  }

  closeRobotPopup() {
    this.isRobotPopupVisible = false;
  }
  showRobotParametersPopup = false;
  openRobotParametersPopup() {
    this.showRobotParametersPopup = true;
  }
  closeRobotParametersPopup() {
    this.showRobotParametersPopup = false;
  }
  showImageUploadPopup = false;
  openImageUploadPopup(): void {
    this.showImageUploadPopup = true;
  }

  closeImageUploadPopup(): void {
    this.showImageUploadPopup = false;
  }
  updateMapDetails(event: { mapName: string; siteName: string }) {
    const { mapName, siteName } = event;
    if (mapName && siteName) {
      const newEntry = {
        mapName,
        siteName,
        lastCreated: new Date().toLocaleDateString(),
      };
      this.filteredEnvData.push(newEntry);
    }
  }

  searchTermChanged() {
    this.filterData();
  }
  ngOnInit() {
    this.filteredEnvData = this.EnvData;
    this.filteredRobotData = this.robotData;
    this.searchTerm = '';
    this.searchTermChanged();
    // Initialize the robot image when the component loads

    // Optionally, you can also handle image loading errors

    // Add mouse event listeners
  }

  showIPScannerPopup = false;

  openIPScanner() {
    this.showIPScannerPopup = true;
  }

  closeIPScanner() {
    this.showIPScannerPopup = false;
  }

  connectivity() {
    this.isConnectivityModeActive = true; // Enable connectivity mode
    this.connectivityPoints = []; // Clear previous points
    console.log('Connectivity mode activated. Select two points.');
  }
  connectivityMode: 'none' | 'bi-directional' | 'uni-directional' = 'none';
  firstPoint: { x: number; y: number } | null = null;
  secondPoint: { x: number; y: number } | null = null;

  addEnvironmentData() {
    const newEntry = {
      // column1: this.mapName,
      // column2: this.siteName,
      column3: formatDate(new Date(), 'MMM d, yyyy. HH:mm:ss', 'en-US'),
    };

    this.EnvData.push(newEntry);
    this.filteredEnvData = [...this.EnvData];
  }

  isCalibrationLayerVisible = false;

  showCalibrationLayer() {
    this.isCalibrationLayerVisible = true;
  }

  hideCalibrationLayer() {
    this.isCalibrationLayerVisible = false;
  }

  // saveMap() {
  //   // here we go..
  //   console.log(this.mapName, this.siteName);
  //   console.log('Map Saved');
  // }

  // Add methods for each button's functionality
  addNode() {
    console.log('Add Node clicked');
  }

  zones() {
    console.log('Zones clicked');
  }

  addAssets() {
    console.log('Add Assets clicked');
  }

  addRobots() {
    console.log('Add Robots clicked');
  }

  removeRobots() {
    console.log('Remove Robots clicked');
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

  onDateFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const filter = selectElement?.value || '';
    // Implement your date filter logic here
  }
  startDate: Date | null = null;
  endDate: Date | null = null;
  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const id = input.id;
    const value = input.value;

    if (id === 'start-date') {
      this.startDate = value ? new Date(value) : null;
    } else if (id === 'end-date') {
      this.endDate = value ? new Date(value) : null;
    }

    this.filterData(); // Apply filters whenever the date changes
  }
  editItem(item: any) {
    console.log('Edit item:', item);
  }

  deleteItem(item: any) {
    // Find the index of the item to be deleted
    const index = this.EnvData.indexOf(item);

    // Remove the item if found
    if (index !== -1) {
      this.EnvData.splice(index, 1);
      this.filterData(); // Reapply filters after deletion
    }
  }

  addItem(item: any) {
    console.log('Add item:', item);
  }

  blockItem(item: any) {
    console.log('Block item:', item);
  }
}
