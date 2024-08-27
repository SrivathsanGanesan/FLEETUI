import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import { formatDate } from '@angular/common';
import { environment } from '../../environments/environment.development';

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
  @Output() newEnvEvent = new EventEmitter<any>();
  @ViewChild('imageCanvas') imageCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('overlayCanvas') overlayCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imagePopupCanvas', { static: false })
  imagePopupCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('resolutionInput') resolutionInput!: ElementRef<HTMLInputElement>;
  @ViewChild('nodeDetailsPopup', { static: false })
  nodeDetailsPopup!: ElementRef<HTMLDivElement>; // Reference to the node details popup

  fileName: string | null = null;
  mapName: string = '';
  siteName: string = '';
  height: number | null = null;
  width: number | null = null;
  showImage: boolean = false;
  imageSrc: string | null = null;
  showOptionsLayer: boolean = false;
  nodes: {
    id: number;
    x: number;
    y: number;
  }[] = [];
  Nodes: { id: number; x: number; y: number; type: string }[] = []; // nodes..
  connections: { fromId: number; toId: number; type: 'uni' | 'bi' }[] = []; // connections
  isNodeDetailsPopupVisible = false; // Control popup visibility
  ratio: number | null = null; // Store the resolution ratio (meters per pixel)
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
  private zones: Zone[] = [];
  showImagePopup: boolean = false;
  showDistanceDialog: boolean = false;
  distanceBetweenPoints: number | null = null;
  private nodeCounter: number = 1; // Counter to assign node numbers
  selectedNode: { x: number; y: number } | null = null;
  lastSelectedNode: { x: number; y: number } | null = null;
  node: { id: number; x: number; y: number }[] = []; // Nodes with unique IDs
  nodeDetails: {
    id: number;
    x: number;
    y: number;
    description: string;
    actions: string[]; // Can allow null if needed
  } = {
    id: 0,
    x: 0,
    y: 0,
    description: '',
    actions: [] // Initialize with a non-null value
  };

  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
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
  selectedAction: string = 'Move'; // Initialize with a default action
  actions: string[] = []; // Array to hold the list of actions

  // Method to add an action to the list
  addAction(): void {
    if (this.selectedAction) {
      this.actions.push(this.selectedAction);
    }
  }

  // Method to delete an action from the list
  removeAction(index: number): void {
    this.actions.splice(index, 1);
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
        console.error('Canvas element not found');
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
  private calculateDistance(
    point1: { x: number; y: number },
    point2: { x: number; y: number }
  ): number {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
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
        this.showDistanceDialog = true; // Show the distance input dialog
      }
    }
  }
  confirmDistance(): void {
    if (
      this.distanceBetweenPoints !== null &&
      this.distanceBetweenPoints !== 0
    ) {
      const distanceInPixels = this.calculateDistance(
        this.points[0],
        this.points[1]
      );
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

  //  Saving all nodes and edges
  async saveOpt() {
    console.log(this.Nodes);
    console.log(this.connections);
    const res = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/dashboard/maps`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodes: this.Nodes,
          edges: this.connections,
        }),
      }
    );
    const data = res.json();
    console.log(data);
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
    this.ratio = Number(
      (document.getElementById('resolution') as HTMLInputElement).value
    );

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
    }
    
     else {
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

  // in changing processs
  setConnectivityMode(mode: 'uni' | 'bi'): void {
    this.connectivityMode = mode;
    this.resetSelection(); // Reset any previous selections when changing mode
    console.log(`Connectivity mode set to: ${mode}`);
  }

  // in changing processs
  setZoneColor(color: string): void {
    this.zoneColor = color;
    this.isDrawingZone = true;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (this.overlayCanvas && this.overlayCanvas.nativeElement) {
      if (this.isDrawingZone) {
        const rect = this.overlayCanvas.nativeElement.getBoundingClientRect();
        this.startX = (event.clientX - rect.left) * (this.overlayCanvas.nativeElement.width / rect.width);
        this.startY = (event.clientY - rect.top) * (this.overlayCanvas.nativeElement.height / rect.height);
        this.currentZone = {
          type: 'low',
          startX: this.startX,
          startY: this.startY,
          endX: this.startX,
          endY: this.startY,
          color: this.zoneColor!
        };
      }
      
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
          this.onNodeClick(node.x, node.y);
          nodeClicked = true;
          break;
        }
      }

      // If no node is selected and plotting is enabled
      if (!nodeClicked && this.isPlottingEnabled) {
        if (this.plottingMode === 'single') {
          this.plotSingleNode(x, y);
        } else if (this.plottingMode === 'multi') {
          this.plotMultiNode(x, y);
        }
      }
    }
  }

  onNodeClick(x: number, y: number): void {
    if (
      this.selectedNode &&
      this.selectedNode.x === x &&
      this.selectedNode.y === y
    ) {
      // If the node is already selected, deselect it
      console.log('Node deselected:', x, y);
      this.deselectNode();
    } else {
      // If no node is selected or a different node is clicked
      if (!this.selectedNode) {
        console.log('First node selected:', x, y);
      } else {
        console.log('Second node selected:', x, y);
        this.lastSelectedNode = this.selectedNode;
      }
      this.selectedNode = { x, y };
      this.drawNode(this.selectedNode, 'transparent', true); // Draw the node as selected

      // Optionally, draw connections only if a second node is selected
      if (this.lastSelectedNode) {
        this.drawConnections();
        this.resetSelection(); // Reset for the next connection
      }
    }
  }
  private deselectNode(): void {
    if (this.selectedNode) {
      // Redraw the node in its original color (transparent)
      this.drawNode(this.selectedNode, 'transparent', false);
      this.selectedNode = null;
    }
  }

  private isNodeClicked(
    node: { x: number; y: number },
    mouseX: number,
    mouseY: number
  ): boolean {
    const radius = 6; // Same as the node radius
    const dx = mouseX - node.x;
    const dy = mouseY - node.y;
    return dx * dx + dy * dy <= radius * radius;
  }

  private drawNode(
    node: { x: number; y: number },
    color: string,
    selected: boolean
  ): void {
    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = selected ? color : 'blue';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = selected ? 3 : 1;
      ctx.fill();
      ctx.stroke();
    }
  }

  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent): void {
    event.preventDefault();

    const rect = this.overlayCanvas.nativeElement.getBoundingClientRect();
    const x =
      (event.clientX - rect.left) *
      (this.overlayCanvas.nativeElement.width / rect.width);
    const y =
      (event.clientY - rect.top) *
      (this.overlayCanvas.nativeElement.height / rect.height);

    // Check if a node is clicked
    for (const node of this.nodes) {
      if (this.isNodeClicked(node, x, y)) {
        this.showNodeDetailsPopup(node, x, y);
        break;
      }
    }
  }



  showNodeDetailsPopup(
    node: { id: number; x: number; y: number },
    clickX: number,
    clickY: number
  ): void {


    this.isNodeDetailsPopupVisible = true;

    // Position the popup near the clicked node
    const popup = this.nodeDetailsPopup.nativeElement;
    popup.style.left = `${clickX}px`;
    popup.style.top = `${clickY}px`;

    this.cdRef.detectChanges(); // Ensure the popup updates
  }

  closeNodeDetailsPopup(): void {
    this.isNodeDetailsPopupVisible = false;
  }

  saveNodeDetails(): void {
    // Implement save functionality here
    this.closeNodeDetailsPopup();
  }
  // in changing process

  plotSingleNode(x: number, y: number): void {
    const color = 'blue'; // Color for single nodes
    this.drawNode({ x, y }, color, false);

    // Push the node with the current counter before incrementing
    this.nodes.push({ id: this.nodeCounter, x, y });
    console.log(
      `Type: Single Node, Node Number: ${this.nodeCounter}, Position:`,
      { x, y }
    );

    if (this.ratio !== null) {
      const distanceX = x * this.ratio;
      const distanceY = y * this.ratio;
      console.log({
        id: this.nodeCounter,
        x: distanceX,
        y: distanceY,
        type: 'single',
      });
      this.Nodes.push({
        id: this.nodeCounter,
        x: distanceX,
        y: distanceY,
        type: 'single',
      });
    }

    this.nodeCounter++; // Increment the node counter after assignment
    this.isPlottingEnabled = false; // Disable plotting after placing a single node
  }

  plotMultiNode(x: number, y: number): void {
    if (this.nodes.length >= 2) {
      alert('Only two nodes can be plotted in multi-node mode.');
      return;
    }

    const color = 'blue'; // Color for multi-nodes
    this.drawNode({ x, y }, color, false);

    console.log(
      `Type: Multi Node, Node Number: ${this.nodeCounter}, Position:`,
      { x, y }
    ); // Log the node number and position

    if (this.ratio !== null) {
      const distanceX = x * this.ratio;
      const distanceY = y * this.ratio;
      console.log(
        `Type: Multi Node, Node Number: ${
          this.nodeCounter
        }, Distance (meters): X: ${distanceX.toFixed(
          2
        )}, Y: ${distanceY.toFixed(2)}`
      );
    }

    this.nodeCounter++; // Increment the node counter

    if (this.nodes.length === 0) {
      this.firstNode = { x, y };
    } else if (this.nodes.length === 1) {
      this.secondNode = { x, y };
      this.showIntermediateNodesDialog = true;
      this.isPlottingEnabled = false; // Disable further plotting after two nodes
    }
    this.nodes.push({ id: this.nodeCounter, x, y }); // Assign ID before incrementing
  }

  plotIntermediateNodes(): void {
    if (
      this.firstNode &&
      this.secondNode &&
      this.numberOfIntermediateNodes > 0
    ) {
      const dx =
        (this.secondNode.x - this.firstNode.x) /
        (this.numberOfIntermediateNodes + 1);
      const dy =
        (this.secondNode.y - this.firstNode.y) /
        (this.numberOfIntermediateNodes + 1);

      for (let i = 1; i <= this.numberOfIntermediateNodes; i++) {
        const x = this.firstNode.x + i * dx;
        const y = this.firstNode.y + i * dy;
        this.nodes.push({
          x,
          y,
          id: 0,
        });

        this.drawNode({ x, y }, 'blue', false); // Set the initial color and no outline

        console.log(
          `Type: Intermediate Node, Node Number: ${this.nodeCounter}, Position:`,
          { x, y }
        );

        if (this.ratio !== null) {
          const distanceX = x * this.ratio;
          const distanceY = y * this.ratio;
          // console.log(
          //   `Type: Intermediate Node, Node Number: ${
          //     this.nodeCounter
          //   }, Distance (meters): X: ${distanceX.toFixed(
          //     2
          //   )}, Y: ${distanceY.toFixed(2)}`
          // );
          console.log({
            id: this.nodeCounter,
            x: distanceX,
            y: distanceY,
            type: 'multi',
          });
          this.Nodes.push({
            id: this.nodeCounter,
            x: x * this.ratio,
            y: y * this.ratio,
            type: 'multi',
          });
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
        if (this.isDrawingZone && this.currentZone && this.overlayCanvas && this.overlayCanvas.nativeElement) {
      const rect = this.overlayCanvas.nativeElement.getBoundingClientRect();
      const endX = (event.clientX - rect.left) * (this.overlayCanvas.nativeElement.width / rect.width);
      const endY = (event.clientY - rect.top) * (this.overlayCanvas.nativeElement.height / rect.height);

      // Update the current zone's end coordinates
      this.currentZone.endX = endX;
      this.currentZone.endY = endY;
      // Clear the canvas and redraw all zones
      this.redrawZones();
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (this.isDrawingZone && this.currentZone && this.overlayCanvas && this.overlayCanvas.nativeElement) {
      const rect = this.overlayCanvas.nativeElement.getBoundingClientRect();
      const endX = (event.clientX - rect.left) * (this.overlayCanvas.nativeElement.width / rect.width);
      const endY = (event.clientY - rect.top) * (this.overlayCanvas.nativeElement.height / rect.height);
  
      // Update the current zone's end coordinates
      this.currentZone.endX = endX;
      this.currentZone.endY = endY;
  
      // Save the current zone to the zones array
      this.zones.push(this.currentZone);
  
      // Redraw all zones
      this.redrawZones();
  
      // Reset drawing state
      this.isDrawingZone = false;
      this.currentZone = null;
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
  private redrawZones(): void {
    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    ctx!.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all existing zones
    for (const zone of this.zones) {
      ctx!.beginPath();
      ctx!.rect(zone.startX, zone.startY, zone.endX - zone.startX, zone.endY - zone.startY);
      ctx!.fillStyle = zone.color;
      ctx!.fill();
      ctx!.stroke();
    }

    // Draw the current zone being drawn
    if (this.currentZone) {
      ctx!.beginPath();
      ctx!.rect(this.currentZone.startX, this.currentZone.startY, this.currentZone.endX - this.currentZone.startX, this.currentZone.endY - this.currentZone.startY);
      ctx!.fillStyle = this.currentZone.color;
      ctx!.fill();
      ctx!.stroke();
    }
  }
 
// in chaging process
drawConnections(): void {
  if (!this.selectedNode || !this.lastSelectedNode || !this.connectivityMode) {
      console.log("Not enough nodes or mode is not set");
      return; // Ensure both nodes and a mode are selected
    }

    const fromId = this.getNodeId(this.lastSelectedNode);
    const toId = this.getNodeId(this.selectedNode);

    console.log('Drawing connection between nodes with IDs:', fromId, toId);

    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.log('Canvas context is not available');
      return;
    }

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;

    // Draw line between the nodes
    ctx.beginPath();
    ctx.moveTo(this.lastSelectedNode.x, this.lastSelectedNode.y);
    ctx.lineTo(this.selectedNode.x, this.selectedNode.y);
    ctx.stroke();

    // Draw arrow(s) based on the connectivity mode
    if (this.connectivityMode === 'uni') {
      console.log(
        'Drawing unidirectional arrow between node IDs:',
        fromId,
        toId
      );
      this.drawArrow(
        ctx,
        this.lastSelectedNode.x,
        this.lastSelectedNode.y,
        this.selectedNode.x,
        this.selectedNode.y
      );
      this.connections.push({ fromId, toId, type: 'uni' });
    } else if (this.connectivityMode === 'bi') {
      console.log(
        'Drawing bidirectional arrows between node IDs:',
        fromId,
        toId
      );
      this.drawArrow(
        ctx,
        this.lastSelectedNode.x,
        this.lastSelectedNode.y,
        this.selectedNode.x,
        this.selectedNode.y
      );
      this.drawArrow(
        ctx,
        this.selectedNode.x,
        this.selectedNode.y,
        this.lastSelectedNode.x,
        this.lastSelectedNode.y
      );
      this.connections.push({ fromId, toId, type: 'bi' });
    }
  }

  private getNodeId(node: { x: number; y: number }): number {
    const foundNode = this.nodes.find((n) => n.x === node.x && n.y === node.y);
    return foundNode ? foundNode.id : -1; // Return -1 if the node is not found
  }

  // in changing process
  drawArrow(
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
  ): void {
    const fromId = this.getNodeId({ x: fromX, y: fromY });
    const toId = this.getNodeId({ x: toX, y: toY });

    console.log('Drawing arrow between node IDs:', fromId, toId);

    const headLength = 10;
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
    ctx.closePath();
    ctx.fillStyle = 'black';
    ctx.fill();
  }

  resetSelection(): void {
    this.selectedNode = null;
    this.lastSelectedNode = null;
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
