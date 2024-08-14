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
  imageWidth: number = 0;  // Width in meters
  pixelsPerMeter: number = 0; // Pixels per meter
  private backgroundImage: HTMLImageElement | null = null;
  isConnectivityModeActive: boolean = false; // Track if connectivity mode is active
  connectivityPoints: { x: number; y: number }[] = []; // Store selected points for connectivity
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
    private dialog: MatDialog,
    private exportService: ExportService,
    private cdRef: ChangeDetectorRef
    
  ) {
    // this.iconImage.src = '../../assets/ConfigurationOptions/point.svg';
  }
  ngAfterViewInit() { }

  nodeMode: 'single' | 'multi' = 'single'; // Node mode (single or multi)
  modeSelected: boolean = false; // Flag to track if a node mode has been selected
  // Set the node mode (single or multi)
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
    { id: 1, name: 'Robot A', color: 'red', imageUrl: 'assets/robots/robotA.svg' },
    { id: 2, name: 'Robot B', color: 'green', imageUrl: 'assets/robots/robotB.svg' },
    // Add more robots with their respective image URLs here
  ];
  selectedRobots: any[] = [];
  showRobotPopup() {
    this.isRobotPopupVisible = true;
  }

  closeRobotPopup() {
    this.isRobotPopupVisible = false;
  }

  handleRobotAddition(selectedRobot: any) {
    console.log('Selected robot:', selectedRobot);
    if (selectedRobot && selectedRobot.imageUrl) {
      console.log('Adding robot:', selectedRobot);
      this.drawRobotOnCanvas(selectedRobot);
    } else {
      console.error('Robot imageUrl is undefined:', selectedRobot);
    }
  }
  
 
drawRobotOnCanvas(robot: any) {
  if (!robot || !robot.imageUrl) {
      console.error('Invalid robot object:', robot);
      return;
  }

  const canvas = this.uploadedCanvas.nativeElement;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
      console.error('Canvas context not found');
      return;
  }

  const img = new Image();
  img.src = robot.imageUrl;

  const x = canvas.width / 2;
  const y = canvas.height / 2;

  img.onload = () => {
      ctx.drawImage(img, x - 20, y - 20, 40, 40);
      console.log(`Robot ${robot.name} placed on the canvas at (${x}, ${y})`);
  };

  img.onerror = () => {
      console.error(`Failed to load robot image: ${robot.imageUrl}`);
  };

  if (img.complete) {
      ctx.drawImage(img, x - 20, y - 20, 40, 40);
      console.log(`Robot ${robot.name} placed on the canvas at (${x}, ${y})`);
  }
}

  // Add the addRobotsToCanvas function here
  addRobotsToCanvas(selectedRobots: any[]) {
    selectedRobots.forEach(robot => {
      this.drawRobotOnCanvas(robot);
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

  handleLayerClick(event: MouseEvent) {
    const canvas = this.uploadedCanvas?.nativeElement;
    const rect = canvas?.getBoundingClientRect();
    const x = event.clientX - (rect?.left ?? 0);
    const y = event.clientY - (rect?.top ?? 0);

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
        this.selectedNode = clickedNode;
        this.redrawCanvas();
        console.log(`Node selected: ID ${clickedNode.id}`);
      } else {
        if (this.nodeMode === 'single' && this.nodes.length === 0) {
          this.addSingleNode(event);
        } else if (this.nodeMode === 'multi') {
          this.addMultiNode(event);
        }
      }

      if (this.nodes.length > 0) {
        this.redrawCanvas();
      }
    } else {
      if (!this.firstPoint) {
        this.firstPoint = { x, y };
        this.redrawCanvas();
      } else if (!this.secondPoint) {
        this.secondPoint = { x, y };
        this.redrawCanvas();
        this.drawLineBetweenPoints();
        this.firstPoint = null;
        this.secondPoint = null;
        this.connectivityMode = 'none';
      }
    }
  }
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

addSingleNode(event: MouseEvent) {
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

  // If a single node is already placed, do not add more nodes
  if (this.nodes.length === 0 || (this.nodeMode === 'single' && this.nodes.length === 0)) {
    this.nodes.push({ x, y, id: this.nodeIdCounter++ });
    this.redrawCanvas();
  }
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
calculatePixelsPerMeter() {
  const canvas = this.uploadedCanvas?.nativeElement;
  if (canvas) {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Calculate pixels per meter based on the image dimensions
      const pixelsPerMeterX = canvasWidth / this.imageWidth;
      const pixelsPerMeterY = canvasHeight / this.imageHeight;

      // Average pixels per meter (if the image is not square)
      this.pixelsPerMeter = (pixelsPerMeterX + pixelsPerMeterY) / 2;

      console.log('Pixels per meter:', this.pixelsPerMeter);
  }
}

redrawCanvas() {
  const canvas = this.uploadedCanvas?.nativeElement;
  const ctx = canvas?.getContext('2d');

  if (!canvas || !ctx) return;

  // Clear only the nodes, not the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Redraw the background image if it exists
  if (this.backgroundImage) {
    ctx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
  }

  // Draw nodes
  this.nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = node === this.selectedNode ? 'blue' : 'red'; // Highlight selected node
      ctx.fill();
      ctx.stroke();
  });
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
