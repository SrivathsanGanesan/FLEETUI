import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef
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
  @ViewChild('uploadedCanvas', { static: false }) uploadedCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('overlayCanvas', { static: false }) overlayCanvas!: ElementRef<HTMLCanvasElement>;
  
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
  imageWidth: number = 0;  // Width in meters
  pixelsPerMeter: number = 0; // Pixels per meter
  private backgroundImage: HTMLImageElement | null = null;
  isConnectivityModeActive: boolean = false; // Track if connectivity mode is active
  connectivityPoints: { x: number; y: number }[] = []; // Store selected points for connectivity
  
  EnvData:any[] = [
    { column1: 'Map 1', column2: 'Site 1', column3: 'Jul 4, 2024. 14:00:17' },
    { column1: 'Map 2', column2: 'Site 2', column3: 'Jul 15, 2024. 14:00:17' },
    { column1: 'Map 3', column2: 'Site 4', column3: 'Jul 28, 2024. 14:00:17' }
  ];
  ngOnChanges() {
    this.filterData();
  }

  searchTerm: string = '';
  filteredEnvData: any[] = [];
  filteredRobotData: any[] = [];
  filterData() {
    const term = this.searchTerm.toLowerCase();

    if (this.currentTable === 'Environment') {
      this.filteredEnvData = this.EnvData.filter(item => {
        const date = new Date(item.column3);
        const withinDateRange = (!this.startDate || date >= this.startDate) && (!this.endDate || date <= this.endDate);
        return (item.column1.toLowerCase().includes(term) || item.column2.toLowerCase().includes(term) || item.column3.toLowerCase().includes(term)) && withinDateRange;
      });
    } else if (this.currentTable === 'robot') {
      this.filteredRobotData = this.robotData.filter(item =>
        item.column1.toLowerCase().includes(term) || item.column2.toLowerCase().includes(term)
      );
    }
  }
  robotData:any[] = [
    { column1: 'Robot 1', column2: '192.168.XX.XX' },
    { column1: 'Robot 2', column2: '192.168.XX.XX' }
  ];
  selectedrobotData = [
    { column1: '192.168.XX.XX', column2: ' ' },
    { column1: '192.168.XX.XX', column2: ' ' }
  ];

  constructor(
    private dialog: MatDialog,
    private exportService: ExportService,
    private cdRef: ChangeDetectorRef
  ) {
    // this.iconImage.src = '../../assets/ConfigurationOptions/point.svg';
  }
  loadData() {
    // Fetch or initialize data here
    this.EnvData = []; // Replace with actual data fetching
    this.filterData(); // Initial filter application
  }
  zoneType: 'high' | 'medium' | 'low' | null = null;
  isDrawing: boolean = false;
  startX: number = 0;
  startY: number = 0;
  ngAfterViewInit() {
    
    const overlayCanvas = this.overlayCanvas?.nativeElement;
  

  
    if (overlayCanvas) {

      overlayCanvas.addEventListener('mousedown', this.onMouseDown.bind(this));
      overlayCanvas.addEventListener('mousemove', this.onMouseMove.bind(this));
      overlayCanvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    }
  }
  
  nodeMode: 'single' | 'multi' = 'single'; // Node mode (single or multi)
  modeSelected: boolean = false;
  setNodeMode(mode: 'single' | 'multi') {
    this.nodeMode = mode;
    this.modeSelected = true; // Mark that a mode has been selected
  }
  showRobotParametersPopup = false;

  openRobotParametersPopup() {
    this.showRobotParametersPopup = true;
  }

  closeRobotParametersPopup() {
    this.showRobotParametersPopup = false;
  }  
  
  drawConnectivity() {
    const canvas = this.uploadedCanvas?.nativeElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const [start, end] = this.connectivityPoints;
    if (start && end) {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = 'orange';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  isRobotPopupVisible: boolean = false;  
  robots = [
    { id: 1, name: 'Robot A'},
    { id: 2, name: 'Robot B'}
  ];   
  selectedRobots: any[] = [];
  showRobotPopup() {
    this.isRobotPopupVisible = true;
  }
  closeRobotPopup() {
    this.isRobotPopupVisible = false;
  }
  handleRobotAddition(selectedRobots: any[]) {
    if (selectedRobots.length > 0) {
        this.addRobotsToCanvas(selectedRobots);
    } else {
        console.error('No robots selected.');
    }
}
  robotPositions: { x: number; y: number }[] = [];  
  private robotImage: HTMLImageElement | null = null;
  private selectedRobotIndex: number | null = null;
  private offsetX: number = 0;
  private offsetY: number = 0;
  searchTermChanged() {
    this.filterData();
  }
  ngOnInit() {
    this.filteredEnvData = this.EnvData;
    this.filteredRobotData = this.robotData;
    this.searchTerm = '';
    this.searchTermChanged();
    // Initialize the robot image when the component loads
    this.robotImage = new Image();
    this.robotImage.src = '../../assets/CanvasRobo/robotA.svg'; // Replace with your image path
  
    // Optionally, you can also handle image loading errors
    this.robotImage.onerror = () => {
      console.error('Failed to load robot image.');
      this.robotImage = null; // Set to null or handle accordingly
    };
    // Add mouse event listeners
    if (this.uploadedCanvas) {    
  const canvas = this.uploadedCanvas.nativeElement;
  canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
  canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
  canvas.addEventListener('mouseup', this.onMouseUp.bind(this));}
  }
  setZoneType(zone: 'high' | 'medium' | 'low') {
    this.zoneType = zone;
  }
  getZoneColor(): string {
    switch (this.zoneType) {
      case 'high':
        return 'rgba(255, 0, 0, 0.5)'; // Red for high speed
      case 'medium':
        return 'rgba(255, 165, 0, 0.5)'; // Orange for medium speed
      case 'low':
        return 'rgba(0, 255, 0, 0.5)'; // Green for low speed
      default:
        return 'rgba(0, 0, 0, 0.5)'; // Default color (black) if none is selected
    }
  }

  onMouseDown(event: MouseEvent) {
    const canvas = this.uploadedCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;  
    if (!this.zoneType) return;


    this.startX = event.clientX - rect.left;
    this.startY = event.clientY - rect.top;
    this.isDrawing = true;
    // Check if the click is within the bounds of any robot
    this.selectedRobotIndex = this.robotPositions.findIndex(pos => {
      const robotWidth = this.robotImage?.naturalWidth || 40;
      const robotHeight = this.robotImage?.naturalHeight || 40;
  
      return x >= pos.x && x <= pos.x + robotWidth && y >= pos.y && y <= pos.y + robotHeight;
    });  
    if (this.selectedRobotIndex !== null && this.selectedRobotIndex !== -1) {
      // Store the offset within the robot
      const pos = this.robotPositions[this.selectedRobotIndex];
      this.offsetX = x - pos.x;
      this.offsetY = y - pos.y;
    }
  }  
  onMouseMove(event: MouseEvent) {
    if (this.selectedRobotIndex === null) return;  
    const canvas = this.uploadedCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;  
    const pos = this.robotPositions[this.selectedRobotIndex];
    pos.x = x - this.offsetX;
    pos.y = y - this.offsetY;
    this.redrawCanvas();
    if (!this.isDrawing || !this.zoneType) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;

    // Clear the previous rectangle (if any)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the new rectangle
    ctx.beginPath();
    ctx.rect(this.startX, this.startY, currentX - this.startX, currentY - this.startY);
    ctx.fillStyle = this.getZoneColor();
    ctx.fill();
  }  
  onMouseUp(event: MouseEvent) {
    if (this.isDrawing) {
      this.isDrawing = false;
    }
    this.selectedRobotIndex = null; // Deselect the robot
  }  
  drawRobotOnLayer(robot: any) {
    if (!robot) {
        console.error('Invalid robot object:', robot);
        return;
    }

    const overlayCanvas = this.overlayCanvas?.nativeElement;
    const ctx = overlayCanvas?.getContext('2d');
    if (!ctx || !this.robotImage) return;

    // Disable image smoothing for pixel-perfect drawing
    ctx.imageSmoothingEnabled = true;

    if (!overlayCanvas || !ctx) {
        console.error('Overlay canvas or context not found');
        return;
    }

    const randomX = Math.random() * (overlayCanvas.width - 30);
    const randomY = Math.random() * (overlayCanvas.height - 30);

    const img = new Image();
    img.src = this.robotImage?.src || '../../assets/robots/robotA.svg';

    img.onload = () => {
        // Draw the image at its natural size and use scaling for better quality
        const naturalWidth = img.width;
        const naturalHeight = img.height;
        
        // Scale the image down while maintaining its aspect ratio
        const desiredWidth = 10; // Or another desired width
        const aspectRatio = naturalWidth / naturalHeight;
        const desiredHeight = desiredWidth / aspectRatio;

        // Draw the image with the calculated width and height
        ctx.drawImage(img, randomX, randomY, desiredWidth, desiredHeight);
    };
}

addRobotsToCanvas(selectedRobots: any[]) {
  selectedRobots.forEach(robot => {
      this.drawRobotOnLayer(robot);
  });
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

  drawLineBetweenPoints() {
    const canvas = this.uploadedCanvas?.nativeElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !this.firstPoint || !this.secondPoint) return;  
    const x1 = this.firstPoint.x;
    const y1 = this.firstPoint.y;
    const x2 = this.secondPoint.x;
    const y2 = this.secondPoint.y;  
    // Draw the line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.stroke();  
    // Determine the direction of the arrows
    const arrowLength = 10;
    const angle = Math.atan2(y2 - y1, x2 - x1);  
    if (this.connectivityMode === 'uni-directional') {
      // Draw the arrow at the end point
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - arrowLength * Math.cos(angle - Math.PI / 6), y2 - arrowLength * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x2 - arrowLength * Math.cos(angle + Math.PI / 6), y2 - arrowLength * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fillStyle = 'green';
      ctx.fill();
    } else if (this.connectivityMode === 'bi-directional') {
      // Draw the arrow at the end point (bi-directional)
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - arrowLength * Math.cos(angle - Math.PI / 6), y2 - arrowLength * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x2 - arrowLength * Math.cos(angle + Math.PI / 6), y2 - arrowLength * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fillStyle = 'green';
      ctx.fill();  
      // Draw the arrow at the start point
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + arrowLength * Math.cos(angle - Math.PI / 6), y1 + arrowLength * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x1 + arrowLength * Math.cos(angle + Math.PI / 6), y1 + arrowLength * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fillStyle = 'green';
      ctx.fill();
    }
  }
deleteNode() {
    if (this.selectedNode) {
        this.nodes = this.nodes.filter(node => node.id !== this.selectedNode!.id);
        this.selectedNode = null;
        this.redrawCanvas();
    } else {
        alert('No node selected for deletion.');
    }
}
private hasPlottedSingleNode = false;
// Method to switch to single node mode
handleLayerClick(event: MouseEvent) {
  const canvas = this.overlayCanvas?.nativeElement;
  const rect = canvas?.getBoundingClientRect();
  const x = event.clientX - (rect?.left ?? 0);
  const y = event.clientY - (rect?.top ?? 0);

  console.log('Clicked coordinates:', { x, y });

  if (this.connectivityMode === 'none') {
    if (!this.modeSelected) {
      alert('Please select a node mode first.');
      return;
    }  

    const clickedNode = this.nodes.find(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance <= 5;
    });

    if (clickedNode) {
      // Node selection logic
      this.selectedNode = clickedNode;
      this.redrawCanvas();
      console.log(`Node selected: ID ${clickedNode.id}`);
    } else {
      console.log('No existing node clicked. Adding a new node.');

      if (this.nodeMode === 'single') {
        this.addSingleNode(event); // Plot the new single node
      } else if (this.nodeMode === 'multi') {
          this.addMultiNode(event);          
      } else {
        console.error('Invalid node mode. Expected "single" or "multi", but got:', this.nodeMode);
      }  

      if (this.nodes.length > 0) {
        console.log('Nodes array after adding:', this.nodes);
        this.redrawCanvas();
      } else {
        console.error('No nodes to redraw.');
      }
    }
  } else {
    console.log('Connectivity mode active.');
    
    if (!this.firstPoint) {
      this.firstPoint = { x, y };
      console.log('First point set:', this.firstPoint);
      this.redrawCanvas();
    } else if (!this.secondPoint) {
      this.secondPoint = { x, y };
      console.log('Second point set:', this.secondPoint);
      this.redrawCanvas();
      this.drawLineBetweenPoints();
      this.firstPoint = null;
      this.secondPoint = null;
      this.connectivityMode = 'none';
    }
  }
}
switchToSingleNodeMode() {
  this.nodeMode = 'single';  // Set mode to single
  this.hasPlottedSingleNode = false; // Reset flag for single node mode
  console.log('Switched to single node mode.');
}
addSingleNode(event: MouseEvent) {
  const canvas = this.overlayCanvas?.nativeElement;
  const rect = canvas?.getBoundingClientRect();
  const x = event.clientX - (rect?.left ?? 0);
  const y = event.clientY - (rect?.top ?? 0);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const relativeX = (x - centerX) / this.pixelsPerMeter;
  const relativeY = -(y - centerY) / this.pixelsPerMeter; // Y is inverted
  console.log(`Coordinates: (${relativeX.toFixed(2)}, ${relativeY.toFixed(2)}) meters`);
  if (this.nodeMode === 'single') {
    if (!this.hasPlottedSingleNode) {
      // Add a new node if no single node has been plotted yet
      this.nodes.push({ x, y, id: this.nodeIdCounter++ });
      this.hasPlottedSingleNode = true; // Set flag to true to prevent further nodes
    }
  } else {
    // In multi-node mode, add new nodes
    this.nodes.push({ x, y, id: this.nodeIdCounter++ });
    this.hasPlottedSingleNode = false; // Reset flag for multi-node mode
  }
  this.redrawCanvas();
}
addMultiNode(event: MouseEvent) {
  const canvas = this.uploadedCanvas?.nativeElement;
  const rect = canvas?.getBoundingClientRect();
  const x = event.clientX - (rect?.left ?? 0);
  const y = event.clientY - (rect?.top ?? 0);
  // Calculate coordinates relative to the center
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const relativeX = (x - centerX) / this.pixelsPerMeter;
  const relativeY = -(y - centerY) / this.pixelsPerMeter; // Y is inverted
  console.log(`Coordinates: (${relativeX.toFixed(2)}, ${relativeY.toFixed(2)}) meters`);
  this.nodes.push({ x, y, id: this.nodeIdCounter++ });
  this.redrawCanvas();
}
redrawCanvas() {
  const overlayCanvas = this.overlayCanvas?.nativeElement;
  const ctx = overlayCanvas?.getContext('2d');
  if (!overlayCanvas || !ctx) return;
  ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  
  // Draw background image if available
  if (this.backgroundImage) {
    ctx.drawImage(this.backgroundImage, 0, 0, overlayCanvas.width, overlayCanvas.height);
  }
  // Draw each node
  this.nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = node === this.selectedNode ? 'blue' : 'red';
    ctx.fill();
    ctx.stroke();
  });
}
calculatePixelsPerMeter() {
  const canvas = this.uploadedCanvas?.nativeElement;
  if (canvas) {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const pixelsPerMeterX = canvasWidth / this.imageWidth;
      const pixelsPerMeterY = canvasHeight / this.imageHeight;
      this.pixelsPerMeter = (pixelsPerMeterX + pixelsPerMeterY) / 2;
      console.log('Pixels per meter:', this.pixelsPerMeter);
  }
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
  openImage() {
    if (this.mapName === '' || this.siteName === '') {
      alert('Map name and Site name required!');
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
          // Store the image in the backgroundImage property
          this.backgroundImage = img;
          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(this.imageFile);

      this.addEnvironmentData(); // Add data to the table when the image is opened
    }
  }
  mapName: string = ''; // To store the Map Name input value
  siteName: string = ''; // To store the Site Name input value
  addEnvironmentData() {
    const newEntry = {
      column1: this.mapName,
      column2: this.siteName,
      column3: formatDate(new Date(), 'MMM d, yyyy. HH:mm:ss', 'en-US')
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
  saveMap() {
    // here we go..
    console.log(this.mapName, this.siteName);
    console.log('Map Saved');
  }
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
      if (button === 'fleet') {
        this.currentTable = 'fleet';
        this.currentTab = 'fleet';
      } else {
        this.currentTable = button;
        this.currentTab = button;
      }
    }, 200);
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