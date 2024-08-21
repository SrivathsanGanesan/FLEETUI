import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  ChangeDetectorRef
} from '@angular/core';
import { formatDate } from '@angular/common';

interface Zone {
  type: 'high' | 'medium' | 'low';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
}
@Component({
  selector: 'app-envmap',
  templateUrl: './envmap.component.html',
  styleUrls: ['./envmap.component.css'],
})
export class EnvmapComponent implements AfterViewInit {
  @Output() closePopup = new EventEmitter<void>();
  @ViewChild('imageCanvas') imageCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('overlayCanvas') overlayCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imagePopupCanvas', { static: false }) imagePopupCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('resolutionInput') resolutionInput!: ElementRef<HTMLInputElement>;

  fileName: string | null = null;
  mapName: string = '';
  siteName: string = '';
  height: number | null = null;
  width: number | null = null;
  showImage: boolean = false;
  imageSrc: string | null = null;
  showOptionsLayer: boolean = false;
  nodes: { x: number; y: number }[] = [];
  selectedAsset: 'docking' | 'charging' | 'picking' | null = null;
  assetImages: { [key: string]: HTMLImageElement } = {};
  plottingMode: 'single' | 'multi' | null = null;
  connectivityMode: 'uni' | 'bi' | null = null;
  zoneColor: string | null = null;
  isPlottingEnabled: boolean = false;
  isDrawingZone: boolean = false;
  startX: number | null = null;
  startY: number | null = null;
  isOptionsMenuVisible = false;
  isCalibrationLayerVisible = false;
  showIntermediateNodesDialog: boolean = false;
  numberOfIntermediateNodes: number = 0;
  firstNode: { x: number; y: number } | null = null;
  secondNode: { x: number; y: number } | null = null;
  currentZone: Zone | null = null;
  robotImages: { [key: string]: HTMLImageElement } = {};
  isRobotPopupVisible: boolean = false;
  tableData: { mapName: string; siteName: string }[] = []; // Holds table data
  private points: { x: number; y: number }[] = [];
  private zones: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }[] = [];
  showImagePopup: boolean = false;
  showDistanceDialog: boolean = false;
  distanceBetweenPoints: number | null = null;
  ratio: number | null = null;  // Store the resolution ratio (meters per pixel)
  private nodeCounter: number = 1; // Counter to assign node numbers
  selectedNode: { x: number; y: number } | null = null;
    

  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    // Preload asset images
    this.assetImages['docking'] = new Image();
    this.assetImages['docking'].src = 'assets/Asseticon/docking-station.svg';

    this.assetImages['charging'] = new Image();
    this.assetImages['charging'].src = 'assets/Asseticon/charging-station.svg';

    this.assetImages['picking'] = new Image();
    this.assetImages['picking'].src = 'assets/Asseticon/picking-station.svg';

    this.robotImages['robotA'] = new Image();
    this.robotImages['robotA'].src = 'assets/CanvasRobo/robotA.svg';

    this.robotImages['robotB'] = new Image();
    this.robotImages['robotB'].src = 'assets/CanvasRobo/robotB.svg';
  }


  closeImagePopup(): void {
    this.showImagePopup = false;
  }
  selectAsset(assetType: 'docking' | 'charging' | 'picking'): void {
    this.selectedAsset = assetType;
    this.isPlottingEnabled = false; // Disable other plotting modes when placing an asset
  }
  onRobotsPlaced(event: { type: 'robotA' | 'robotB'; count: number }): void {
    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    const robotImage = this.robotImages[event.type];

    for (let i = 0; i < event.count; i++) {
      const x = Math.random() * (canvas.width - robotImage.width);
      const y = Math.random() * (canvas.height - robotImage.height);
      ctx!.drawImage(robotImage, x, y);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.fileName = file.name;
      this.showImage = false;

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imageSrc = e.target!.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  openImagePopup(): void {
    if (this.imageSrc) {
      this.showImagePopup = true;
      this.cdRef.detectChanges();
  
      const canvas = this.imagePopupCanvas?.nativeElement;
      if (!canvas) {
        console.error("Canvas element not found");
        return;
      }
  
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = this.imageSrc;
  
      img.onload = () => {
        // Clear the points array
        this.points = [];
  
        // Clear the canvas
        ctx!.clearRect(0, 0, canvas.width, canvas.height);
  
        // Set canvas dimensions and draw the image
        canvas.width = img.width;
        canvas.height = img.height;
        ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    } else {
      alert('No image uploaded.');
    }
  }
  private calculateDistance(point1: { x: number; y: number }, point2: { x: number; y: number }): number {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  }
  
  @HostListener('click', ['$event'])
  onImagePopupCanvasClick(event: MouseEvent): void {
    if (!this.showImagePopup || !this.imagePopupCanvas) return;

    const canvas = this.imagePopupCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);

    if (this.points.length < 2) {
      this.points.push({ x, y });
      this.plotPointOnImagePopupCanvas(x, y);

      if (this.points.length === 2) {
        console.log('Two points plotted:', this.points);
        const distance = this.calculateDistance(this.points[0], this.points[1]);
        console.log(`Distance between points: ${distance.toFixed(2)} pixels`);
        this.showDistanceDialog = true;  // Show the distance input dialog
      }
    }
  }
  confirmDistance(): void {
    if (this.distanceBetweenPoints !== null && this.distanceBetweenPoints !== 0) {
      const distanceInPixels = this.calculateDistance(this.points[0], this.points[1]);
      console.log(`Distance entered: ${this.distanceBetweenPoints} meters`);
      
      if (distanceInPixels !== 0) {
        this.ratio = this.distanceBetweenPoints / distanceInPixels;
        console.log(`Resolution (meters per pixel): ${this.ratio.toFixed(2)}`);
        
        // Update the resolution input field
        if (this.resolutionInput) {
          this.resolutionInput.nativeElement.value = this.ratio.toFixed(2);
        }
      } else {
        console.log('Distance in pixels is zero, cannot calculate ratio.');
      }
      
      this.showDistanceDialog = false;
    }
  }
  saveCanvas(): void {
    const canvas = this.imagePopupCanvas.nativeElement;
    // const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    // link.href = dataURL;
    // link.download = 'canvas-image.png';
    link.click();
    this.showImagePopup = false;
  }
  clearCanvas(): void {
    const canvas = this.imagePopupCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  
      // Clear points array and logs
      this.points = [];
      console.clear(); // Clear console logs
  
      // Redraw image if needed
      const img = new Image();
      img.src = this.imageSrc || '';
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  }
    
  
  private plotPointOnImagePopupCanvas(x: number, y: number): void {
    const canvas = this.imagePopupCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
  }
  
  open(): void {
    if (this.mapName && this.siteName && this.imageSrc) {
      this.fileName = null;
      this.showImage = true;

      const img = new Image();
      img.src = this.imageSrc;

      img.onload = () => {
        if (this.imageCanvas && this.imageCanvas.nativeElement) {
          const canvas = this.imageCanvas.nativeElement;
          const ctx = canvas.getContext('2d')!;

          canvas.width = this.width || img.width;
          canvas.height = this.height || img.height;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          if (this.overlayCanvas && this.overlayCanvas.nativeElement) {
            const overlay = this.overlayCanvas.nativeElement;
            overlay.width = canvas.width;
            overlay.height = canvas.height;
          }
        }
      };
    } else {
      alert('Please enter both Map Name and Site Name before clicking Open.');
    }
  }

  close(): void {
    // new value to array..
    if (this.mapName && this.siteName)
      this.newEnvEvent.emit({
        column1: this.mapName,
        column2: this.siteName,
        column3: 'Jul 4, 2024. 14:00:17',
      });
    this.closePopup.emit();
  }

  setPlottingMode(mode: 'single' | 'multi'): void {
    this.plottingMode = mode;
    this.isPlottingEnabled = true;
    if (mode === 'multi') {
      this.nodes = [];
      this.firstNode = null;
      this.secondNode = null;
    }
  }
  setConnectivityMode(mode: 'uni' | 'bi'): void {
    if (this.nodes.length < 2) {
      alert('Please plot at least two nodes before setting connectivity.');
      return;
    }
    this.connectivityMode = mode;
    this.isPlottingEnabled = false;
  }
  setZoneColor(color: string): void {
    this.zoneColor = color;
    this.isDrawingZone = true;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (this.overlayCanvas && this.overlayCanvas.nativeElement) {
      // const canvas = this.overlayCanvas.nativeElement;
      const rect = this.overlayCanvas.nativeElement.getBoundingClientRect();
      const x =
        (event.clientX - rect.left) *
        (this.overlayCanvas.nativeElement.width / rect.width);
      const y =
        (event.clientY - rect.top) *
        (this.overlayCanvas.nativeElement.height / rect.height);

      // Check if a node is clicked
      let nodeClicked = false;
      for (const node of this.nodes) {
        if (this.isNodeClicked(node, x, y)) {
          this.selectedNode = node; // Select the clicked node
          nodeClicked = true;
          break;
        }
      }
  
      if (nodeClicked) {
        this.redrawNodes(); // Redraw nodes to show the selected node
      } else if (this.isPlottingEnabled) {
        // If no node is selected and plotting is enabled
        if (this.plottingMode === 'single') {
          this.plotSingleNode(x, y);
        } else if (this.plottingMode === 'multi') {
          this.plotMultiNode(x, y);
        }
  
        if (this.connectivityMode) {
          this.drawConnections();
        }
      }
  
      if (this.isDrawingZone) {
        this.startX = event.clientX;
        this.startY = event.clientY;
      }
    }
  }
  
private isNodeClicked(node: { x: number; y: number }, mouseX: number, mouseY: number): boolean {
  const radius = 8; // Same as the node radius
  const dx = mouseX - node.x;
  const dy = mouseY - node.y;
  return dx * dx + dy * dy <= radius * radius;
}
private drawNode(node: { x: number; y: number }, color: string, isSelected: boolean): void {
  const canvas = this.overlayCanvas.nativeElement;
  const ctx = canvas.getContext('2d')!;

  ctx.beginPath();
  ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();

  if (isSelected) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'black'; 
      ctx.stroke();
  }
}

  private redrawNodes(): void {
    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    this.nodes.forEach((node) => {
      const isSelected = this.selectedNode === node;
      const color = isSelected ? 'orange' : 'blue'; // Highlight selected node
      this.drawNode(node, color, isSelected);
    });

    if (this.connectivityMode) {
      this.drawConnections();
    }
  }

  plotSingleNode(x: number, y: number): void {
    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'blue'; // Color for single nodes
    ctx.fill();

    this.nodes.push({ x, y });
    console.log(`Type: Single Node, Node Number: ${this.nodeCounter}, Position:`, { x, y }); // Log the node number and position

    if (this.ratio !== null) {
      const distanceX = x * this.ratio;
      const distanceY = y * this.ratio;
      console.log(`Type: Single Node, Node Number: ${this.nodeCounter}, Distance (meters): X: ${distanceX.toFixed(2)}, Y: ${distanceY.toFixed(2)}`);
    }
    this.nodeCounter++; // Increment the node counter
    this.isPlottingEnabled = false; // Disable plotting after placing a single node
  }

  plotMultiNode(x: number, y: number): void {
    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;

    if (this.nodes.length >= 2) {
      alert('Only two nodes can be plotted in multi-node mode.');
      return;
    }

    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green'; // Color for multi-nodes
    ctx.fill();

    console.log(`Type: Multi Node, Node Number: ${this.nodeCounter}, Position:`, { x, y }); // Log the node number and position

    if (this.ratio !== null) {
      const distanceX = x * this.ratio;
      const distanceY = y * this.ratio;
      console.log(`Type: Multi Node, Node Number: ${this.nodeCounter}, Distance (meters): X: ${distanceX.toFixed(2)}, Y: ${distanceY.toFixed(2)}`);
    }

    this.nodeCounter++; // Increment the node counter

    if (this.nodes.length === 0) {
      this.firstNode = { x, y };
    } else if (this.nodes.length === 1) {
      this.secondNode = { x, y };
      this.showIntermediateNodesDialog = true;
      this.isPlottingEnabled = false; // Disable further plotting after two nodes
    }
    this.nodes.push({ x, y });
  }

  plotIntermediateNodes(): void {
    if (this.firstNode && this.secondNode && this.numberOfIntermediateNodes > 0) {
        const dx = (this.secondNode.x - this.firstNode.x) / (this.numberOfIntermediateNodes + 1);
        const dy = (this.secondNode.y - this.firstNode.y) / (this.numberOfIntermediateNodes + 1);

        for (let i = 1; i <= this.numberOfIntermediateNodes; i++) {
            const x = this.firstNode.x + i * dx;
            const y = this.firstNode.y + i * dy;
            this.nodes.push({ x, y });

            this.drawNode({ x, y }, 'red', false); // Set the initial color and no outline

            console.log(`Type: Intermediate Node, Node Number: ${this.nodeCounter}, Position:`, { x, y });

            if (this.ratio !== null) {
                const distanceX = x * this.ratio;
                const distanceY = y * this.ratio;
                console.log(`Type: Intermediate Node, Node Number: ${this.nodeCounter}, Distance (meters): X: ${distanceX.toFixed(2)}, Y: ${distanceY.toFixed(2)}`);
            }

            this.nodeCounter++; // Increment the node counter
        }
    }
    this.closeIntermediateNodesDialog();
}

  closeIntermediateNodesDialog(): void {
    this.showIntermediateNodesDialog = false;
    this.firstNode = null;
    this.secondNode = null;
    this.numberOfIntermediateNodes = 0;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (
      this.isDrawingZone &&
      this.startX !== null &&
      this.startY !== null &&
      this.overlayCanvas &&
      this.overlayCanvas.nativeElement
    ) {
      const canvas = this.overlayCanvas.nativeElement;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * (canvas.width / rect.width);
      const y = (event.clientY - rect.top) * (canvas.height / rect.height);

      ctx!.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawing
      this.drawZone(this.startX, this.startY, event.clientX, event.clientY);
    }
  }
  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (this.isDrawingZone && this.startX !== null && this.startY !== null) {
      this.isDrawingZone = false;
      this.startX = null;
      this.startY = null;
    }
  }
  drawZone(startX: number, startY: number, endX: number, endY: number): void {
    if (!this.overlayCanvas || !this.zoneColor) return;

    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x1 = (startX - rect.left) * (canvas.width / rect.width);
    const y1 = (startY - rect.top) * (canvas.height / rect.height);
    const x2 = (endX - rect.left) * (canvas.width / rect.width);
    const y2 = (endY - rect.top) * (canvas.height / rect.height);

    ctx!.beginPath();
    ctx!.rect(
      Math.min(x1, x2),
      Math.min(y1, y2),
      Math.abs(x2 - x1),
      Math.abs(y2 - y1)
    );
    ctx!.fillStyle = this.zoneColor;
    ctx!.fill();
  }

  drawConnections(): void {
    if (this.nodes.length < 2) return;

    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    for (let i = 0; i < this.nodes.length - 1; i++) {
      const startNode = this.nodes[i];
      const endNode = this.nodes[i + 1];

      // Draw line
      ctx.beginPath();
      ctx.moveTo(startNode.x, startNode.y);
      ctx.lineTo(endNode.x, endNode.y);
      ctx.stroke();

      // Draw arrow if unidirectional or bidirectional
      if (this.connectivityMode === 'uni') {
        this.drawArrow(ctx, startNode.x, startNode.y, endNode.x, endNode.y);
      } else if (this.connectivityMode === 'bi') {
        this.drawArrow(ctx, startNode.x, startNode.y, endNode.x, endNode.y);
        this.drawArrow(ctx, endNode.x, endNode.y, startNode.x, startNode.y);
      }
    }
  }

  drawArrow(
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
  ): void {
    const headLength = 10; // Length of the arrow head
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.lineTo(toX, toY);
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fill();
  }

  toggleOptionsMenu(): void {
    this.isOptionsMenuVisible = !this.isOptionsMenuVisible;
  }

  hideCalibrationLayer(): void {
    this.isOptionsMenuVisible = false;
  }
  openRobotPopup(): void {
    this.isRobotPopupVisible = true;
  }

  closeRobotPopup(): void {
    this.isRobotPopupVisible = false;
  }
  placeRobots(selectedRobots: any[]): void {
    if (!this.overlayCanvas) return;

    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    selectedRobots.forEach((robot) => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;

      const img = new Image();
      img.src = robot.image;
      img.onload = () => {
        ctx.drawImage(img, x - img.width, y - img.height);
      };
    });
  }
}
