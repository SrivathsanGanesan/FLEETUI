import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { ExportService } from '../export.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'],
})
export class ConfigurationComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('uploadedCanvas', { static: false })
  uploadedCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('overlayLayer') overlayLayer!: ElementRef<HTMLDivElement>;

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
  ];
  robotData = [
    { column1: 'Robot 1', column2: '192.168.XX.XX' },
    { column1: 'Robot 2', column2: '192.168.XX.XX' },
  ];
  selectedrobotData = [
    { column1: '192.168.XX.XX', column2: ' ' },
    { column1: '192.168.XX.XX', column2: ' ' },
  ];

  constructor(
    private exportService: ExportService,
    private cdRef: ChangeDetectorRef
  ) {
    this.iconImage.src = '../../assets/ConfigurationOptions/point.svg';
  }

  ngAfterViewInit() {
    // Any initialization that requires the view to be fully loaded can go here.
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  calibrateCoordinates() {
    // Add your calibration logic here
    console.log('Calibrate Coordinates button clicked!');
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      this.chosenImageName = this.imageFile.name;
    }
  }
  isMultiNodeMode = false; // Track Multi Node mode
  addMultiNode() {
    console.log("Multi Node clicked");
    this.isMultiNodeMode = !this.isMultiNodeMode; // Toggle multi node mode
    this.isSingleNodeMode = false; // Disable single node mode if active
    const canvas = this.uploadedCanvas?.nativeElement;
    if (this.isMultiNodeMode) {
      canvas.addEventListener('click', this.plotMultiNode.bind(this));
    } else {
      canvas.removeEventListener('click', this.plotMultiNode.bind(this));
    }
  }
  plotMultiNode(event: MouseEvent) {
    if (!this.isMultiNodeMode) return;

    const canvas = this.uploadedCanvas?.nativeElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Draw the icon at the clicked position
    ctx.drawImage(this.iconImage, x, y, 20, 20); // Adjust the width and height as needed
  }
  openImage() {
    if (this.mapName === '' && this.siteName === '') {
      alert('Map name and site name required!');
      return;
    }

    if (this.imageFile) {
      this.isImageOpened = true;
      this.cdRef.detectChanges();

      const canvas = this.uploadedCanvas?.nativeElement;
      const ctx = canvas.getContext('2d');

      if (!canvas || !ctx) {
        console.error('Canvas or context not found');
        return;
      }

      canvas.width = 1400;
      canvas.height = 600;

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

      this.addEnvironmentData(); // Add data to the table when the image is opened
    }
  }
  deleteNode(){
    console.log("node deleted")
  }
  iconImage = new Image(); // Image for plotting nodes
  isSingleNodeMode = false; // To track if Single Node mode is active
  addSingleNode() {
    console.log('Single Node clicked');
    this.isSingleNodeMode = true; // Enable single node mode
    const canvas = this.uploadedCanvas?.nativeElement;
    if (canvas) {
      canvas.addEventListener('click', this.plotSingleNode.bind(this));
    }
  }

  plotSingleNode(event: MouseEvent) {
    if (!this.isSingleNodeMode) return;

    const canvas = this.uploadedCanvas?.nativeElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Draw the icon at the clicked position
    ctx.drawImage(this.iconImage, x, y, 20, 20); // Adjust the width and height as needed

    // Disable single node mode after plotting
    this.isSingleNodeMode = false;
    canvas.removeEventListener('click', this.plotSingleNode.bind(this));
  }

  mapName: string = ''; // To store the Map Name input value
  siteName: string = ''; // To store the Site Name input value

  addEnvironmentData() {
    const currentTime = new Date();
    const formattedTime = formatDate(
      currentTime,
      'MMM d, yyyy. HH:mm:ss',
      'en-US'
    );
    this.EnvData.push({
      column1: this.mapName,
      column2: this.siteName,
      column3: formattedTime,
    });
  }

  isCalibrationLayerVisible = false;

  showCalibrationLayer() {
    this.isCalibrationLayerVisible = true;
  }

  hideCalibrationLayer() {
    this.isCalibrationLayerVisible = false;
  }
  saveMap() {
    // here we go..
    console.log(this.mapName, this.siteName);
    console.log('Map Saved');
  }
  // Add methods for each button's functionality
  addNode() {
    console.log('Add Node clicked');
  }

  connectivity() {
    console.log('Connectivity clicked');
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
    const startDateElement = document.getElementById(
      'start-date'
    ) as HTMLInputElement;
    const endDateElement = document.getElementById(
      'end-date'
    ) as HTMLInputElement;

    const startDate = startDateElement?.value || '';
    const endDate = endDateElement?.value || '';

    // Implement your date range filtering logic here
  }

  editItem(item: any) {
    console.log('Edit item:', item);
  }

  deleteItem(item: any) {
    const index = this.EnvData.findIndex((envItem) => envItem === item);
    if (index !== -1) {
      this.EnvData.splice(index, 1);
    }
  }

  addItem(item: any) {
    console.log('Add item:', item);
  }

  blockItem(item: any) {
    console.log('Block item:', item);
  }
}
