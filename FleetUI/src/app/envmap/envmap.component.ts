import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  ChangeDetectorRef,
  Renderer2,
  Input,
} from '@angular/core';
import { formatDate } from '@angular/common';
import { environment } from '../../environments/environment.development';
import { saveAs } from 'file-saver';
import { ProjectService } from '../services/project.service';

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
  @Input() EnvData: any[] = [];
  @Input() addEnvToEnvData!: (data: any) => void;

  @Output() closePopup = new EventEmitter<void>();
  @Output() newEnvEvent = new EventEmitter<any>();
  @ViewChild('imageCanvas', { static: false })
  imageCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('overlayCanvas', { static: false })
  overlayCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imagePopupCanvas', { static: false })
  imagePopupCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('resolutionInput') resolutionInput!: ElementRef<HTMLInputElement>;
  @ViewChild('nodeDetailsPopup', { static: false })
  nodeDetailsPopup!: ElementRef<HTMLDivElement>;

  projData: any;
  form: FormData | null = null;
  selectedImage: File | null = null;
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
  Nodes: { id: number; x: number; y: number; orientationAngle?: number; type: string }[] = [];
  NodeDetails: {
    nodeID: number;
    sequenceId: number;
    nodeDescription: string;
    released: boolean;
    nodePosition: { x: number; y: number; orientation: number };
  }[] = []; // updated structure
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
    id: 1,
    x: 0,
    y: 0,
    description: '',
    actions: [], // Initialize with a non-null value
  };
  isMoveActionFormVisible: boolean = true;
  isDockActionFormVisible: boolean = true;
  isUndockActionFormVisible: boolean = true;
  private isDrawingLine: boolean = false; // Tracks if a line is being drawn
  private lineStartX: number | null = null;
  private lineStartY: number | null = null;
  private lineEndX: number | null = null;
  private lineEndY: number | null = null;
  isDistanceConfirmed = false; // Flag to control the Save button
  isEnterButtonVisible = false;
  isCanvasInitialized = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private projectService: ProjectService
  ) {}

  ngAfterViewInit(): void {
    this.projData = this.projectService.getSelectedProject();
    if (!this.overlayCanvas) return;
    setTimeout(() => {
      console.log('ngAfterViewInit: overlayCanvas', this.overlayCanvas);
      const canvas = this.overlayCanvas?.nativeElement;
      if (canvas) {
        this.setupCanvas();
        this.isCanvasInitialized = true; // Avoid re-initializing the canvas
      } else {
        console.error('Canvas element still not found');
      }
    }, 0); // Adjust the delay if necessary
  }

  ngAfterViewChecked(): void {
    if (this.showImage && this.overlayCanvas && !this.isCanvasInitialized) {
      this.setupCanvas();
      this.isCanvasInitialized = true;
    }
  }

  getOverlayCanvas(): HTMLCanvasElement | null {
    return this.overlayCanvas?.nativeElement;
  }

  setupCanvas(): void {
    const canvas = this.getOverlayCanvas();
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }
    // Ensure the canvas has width and height
    if (canvas.width === 0 || canvas.height === 0) {
      console.error('Canvas width or height is zero');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (ctx) {
 
      // Preload asset images
      this.assetImages['docking'] = new Image();
      this.assetImages['docking'].src = 'assets/Asseticon/docking-station.svg';

      this.assetImages['charging'] = new Image();
      this.assetImages['charging'].src =
        'assets/Asseticon/charging-station.svg';

      this.assetImages['picking'] = new Image();
      this.assetImages['picking'].src = 'assets/Asseticon/picking-station.svg';

      this.robotImages['robotA'] = new Image();
      this.robotImages['robotA'].src = 'assets/CanvasRobo/robotA.svg';

      this.robotImages['robotB'] = new Image();
      this.robotImages['robotB'].src = 'assets/CanvasRobo/robotB.svg';
    } else {
      console.error('Failed to get canvas context');
    }
  }
  plotAsset(x: number, y: number): void {
    const canvas = this.getOverlayCanvas();
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    const assetImage = this.assetImages[this.selectedAsset || ''];
    if (assetImage) {
      ctx.drawImage(assetImage, x, y);
      console.log(`Plotted ${this.selectedAsset} at (${x}, ${y})`);
    } else {
      console.error('Selected asset is not valid');
    }
  }
  
  private drawArrowLine(startX: number, startY: number, endX: number, endY: number): void {
    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
        // Apply the Y-transformation (assuming the transformation inverts the Y-coordinate)
        const canvasHeight = canvas.height;
        const transformedStartY = canvasHeight - startY;
        const transformedEndY = canvasHeight - endY;

        // Calculate the angle in radians and convert it to degrees using the transformed Y-coordinates
        const angleRadians = Math.atan2(transformedEndY - transformedStartY, endX - startX);
        const angleDegrees = angleRadians * (180 / Math.PI);

        // Update the orientationAngle of the node
        const currentNode = this.Nodes.find(node => node.x === startX && node.y === startY);
        if (currentNode) {
            currentNode.orientationAngle = angleDegrees;
        }

        console.log(`Orientation angle with respect to the X-axis: ${angleDegrees.toFixed(2)}°`);

      // Draw the line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw arrowhead
      const arrowLength = 10;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowLength * Math.cos(angleRadians - Math.PI / 6),
        endY + arrowLength * Math.sin(angleRadians - Math.PI / 6)
      );
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowLength * Math.cos(angleRadians + Math.PI / 6),
        endY + arrowLength * Math.sin(angleRadians + Math.PI / 6)
      );
      ctx.stroke();
    }
  }

  deleteSelectedNode(): void {
    if (!this.selectedNode) {
      console.log('No node selected for deletion.');
      return;
    }

    // Remove the selected node from the nodes array
    this.nodes = this.nodes.filter(
      (node) =>
        node.x !== this.selectedNode!.x || node.y !== this.selectedNode!.y
    );

    // Remove the node from the Nodes array
    this.Nodes = this.Nodes.filter(
      (node) =>
        node.x !== this.selectedNode!.x || node.y !== this.selectedNode!.y
    );

    // Clear the canvas and redraw the remaining nodes
    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Redraw remaining nodes
      this.nodes.forEach((node) => {
        this.plotPointOnImagePopupCanvas(node.x, node.y);
      });
    } // Reset selectedNode
    this.selectedNode = null;
    console.log('Node deleted successfully.');
  }
  @HostListener('click', ['$event'])
  onOverlayCanvasClick(event: MouseEvent): void {
    const canvas = this.overlayCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y =
      canvas.height -
      (event.clientY - rect.top) * (canvas.height / rect.height);

    const selected = this.nodes.find(
      (node) => Math.abs(node.x - x) < 5 && Math.abs(node.y - y) < 5
    );

    if (selected) {
      this.selectedNode = selected;
      console.log(
        `Node selected at position: (${x.toFixed(2)}, ${y.toFixed(2)})`
      );
    }
  }
  closeImagePopup(): void {
    this.showImagePopup = false;
  }
  selectAsset(assetType: 'docking' | 'charging' | 'picking'): void {
    this.selectedAsset = assetType;
    this.isPlottingEnabled = false; // Disable other plotting nodes when placing an asset
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
  // Parameters for the 'Move' action
  moveParameters = {
    maxLinearVelocity: '',
    maxAngularVelocity: '',
    maxToleranceAtGoalX: '',
    maxToleranceAtGoalY: '',
    maxToleranceAtGoalOrientation: '',
    endPointOrientation: false,
    autoRobotMode: 'mode1', // Default mode
  };
  dockParameters = {
    maxLinearVelocity: '',
    maxAngularVelocity: '',
    maxToleranceAtGoalX: '',
    maxToleranceAtGoalY: '',
    maxToleranceAtGoalOrientation: '',
    goalOffsetX: '',
    goalOffsetY: '',
    goalOffsetOrientation: '',
    endPointOrientation: false,
    dockingType: 'mode1',
  };
  undockParameters = {
    maxLinearVelocity: '',
    maxAngularVelocity: '',
    maxToleranceAtGoalX: '',
    maxToleranceAtGoalY: '',
    maxToleranceAtGoalOrientation: '',
    endPointOrientation: false,
    undockingDistance: '',
  };

  saveNodeDetails(): void {
    // Transform Nodes array to NodeDetails format
    this.NodeDetails = this.Nodes.map((node, index) => ({
        nodeID: node.id,
        sequenceId: index + 1, // Assuming sequenceId is based on the order of nodes
        nodeDescription: '', // Set this as empty or assign a value if available
        released: true,
        nodePosition: {
            x: node.x,
            y: node.y,
            orientation: node.orientationAngle || 0, // Use the latest orientation angle here
        },
        actions: this.actions, // Include actions here
    }));

    // Create a JSON object with the node details
    const nodeDetails = {
        nodes: this.NodeDetails,
    };

    // Log the JSON object to the console
    console.log(JSON.stringify(nodeDetails, null, 2));

    // Save the JSON object to a file
    const blob = new Blob([JSON.stringify(nodeDetails, null, 2)], {
        type: 'application/json',
    });
    saveAs(blob, 'node-details.json');
    this.isNodeDetailsPopupVisible = false; // Hide the popup if needed
}


  onActionChange(): void {
    this.resetParameters();
    this.showActionForm();
  }
  resetParameters(): void {
    this.moveParameters = {
      maxLinearVelocity: '',
      maxAngularVelocity: '',
      maxToleranceAtGoalX: '',
      maxToleranceAtGoalY: '',
      maxToleranceAtGoalOrientation: '',
      endPointOrientation: false,
      autoRobotMode: 'mode1',
    };
    this.dockParameters = {
      maxLinearVelocity: '',
      maxAngularVelocity: '',
      maxToleranceAtGoalX: '',
      maxToleranceAtGoalY: '',
      maxToleranceAtGoalOrientation: '',
      goalOffsetX: '',
      goalOffsetY: '',
      goalOffsetOrientation: '',
      endPointOrientation: false,
      dockingType: 'mode1',
    };
    this.undockParameters = {
      maxLinearVelocity: '',
      maxAngularVelocity: '',
      maxToleranceAtGoalX: '',
      maxToleranceAtGoalY: '',
      maxToleranceAtGoalOrientation: '',
      endPointOrientation: false,
      undockingDistance: '',
    };
  }
  showActionForm(): void {
    this.hideActionForms();
    if (this.selectedAction === 'Move') {
      this.isMoveActionFormVisible = true;
    } else if (this.selectedAction === 'Dock') {
      this.isDockActionFormVisible = true;
    } else if (this.selectedAction === 'Undock') {
      this.isUndockActionFormVisible = true;
    }
  }
  hideActionForms(): void {
    this.isMoveActionFormVisible = false;
    this.isDockActionFormVisible = false;
    this.isUndockActionFormVisible = false;
  }
  editAction(index: number): void {
    const action = this.actions[index];
    this.selectedAction = action.actionType; // Ensure this matches the actionType

    // Load the corresponding parameters into the form
    if (this.selectedAction === 'Move') {
      this.moveParameters = { ...action.parameters };
    } else if (this.selectedAction === 'Dock') {
      this.dockParameters = { ...action.parameters };
    } else if (this.selectedAction === 'Undock') {
      this.undockParameters = { ...action.parameters };
    }

    this.showActionForm();
    this.actions.splice(index, 1); // Remove the action from the list
  }

  selectedAction: string = ''; // Initialize with an empty string or any other default value
  actions: any[] = []; // Array to hold the list of actions with parameters
  // Method to add an action to the list
  addAction(): void {
    if (this.selectedAction) {
      let action;

      if (this.selectedAction === 'Move') {
        action = {
          actionType: this.selectedAction,
          actionId: 'action_move_001',
          actionDescription: 'Move to the next Point',
          parameters: { ...this.moveParameters },
        };
      } else if (this.selectedAction === 'Dock') {
        action = {
          actionType: this.selectedAction,
          actionId: 'action_dock_001',
          actionDescription: 'Dock at the Charging Station',
          parameters: { ...this.dockParameters },
        };
      } else if (this.selectedAction === 'Undock') {
        action = {
          actionType: this.selectedAction,
          actionId: 'action_undock_001',
          actionDescription: 'undock from the charging station',
          parameters: { ...this.undockParameters },
        };
      }

      this.actions.push(action);

      // Hide the form after adding
      this.hideActionForms();

      // Reset the selected action
      this.selectedAction = '';
    }
  }
  openMoveActionForm(): void {
    this.isMoveActionFormVisible = true;
    this.isDockActionFormVisible = true;
    this.isUndockActionFormVisible = true;
  }
  closeNodeDetailsPopup(): void {
    this.isNodeDetailsPopupVisible = false;
  }
  // Method to delete an action from the list
  removeAction(index: number): void {
    this.actions.splice(index, 1);
    this.hideActionForms();
  }
  isOptionDisabled(option: string): boolean {
    return this.actions.some((action) => action.actionType === option);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];
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

  showError: boolean = false; // Flag to show error message

  //  Saving all nodes and edges
  saveOpt() {
    console.log(this.Nodes);
    console.log(this.connections);
    if (!this.selectedImage) {
      alert('file missing!');
      return;
    }
    this.form = new FormData();
    let mapData = {
      projectName: this.projData.projectName,
      siteName: this.siteName,
      mapName: this.mapName,
      imgUrl: '',
      zones: [
        {
          zoneName: 'low_speed_zone',
          zoneCoordinates: [
            {
              x: 5,
              y: 5,
            },
            {
              x: 10,
              y: 5,
            },
            {
              x: 5,
              y: 10,
            },
            {
              x: 10,
              y: 10,
            },
          ],
        },
      ],
      edges: [this.connections],
      nodes: [this.Nodes],
      stations: [],
    };
    this.form?.append('mapImg', this.selectedImage);
    this.form?.append('mapData', JSON.stringify(mapData)); // Insert the map related data here..
    fetch(`http://${environment.API_URL}:${environment.PORT}/dashboard/maps`, {
      credentials: 'include',
      method: 'POST',
      body: this.form,
    })
      .then((response) => {
        // if (!response.ok)
        //   throw new Error(
        //     `Error occured with status code of ${response.status}`
        //   );
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.exits === true) {
          alert(data.msg);
          return;
        }
        if (data.isFileExist === false) {
          alert(data.msg);
          return;
        }
        if (data.map) {
          let mapCreatedAt = new Date(data.map.createdAt);
          let createdAt = mapCreatedAt.toLocaleString('en-IN', {
            month: 'short',
            year: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          });
          this.EnvData.push({
            id: data.map._id,
            mapName: data.map.mapName,
            siteName: this.siteName,
            date: createdAt,
          });
          this.cdRef.detectChanges();
        }

        console.log(this.EnvData);

        this.closePopup.emit();
      })
      .catch((error) => {
        console.error('Error occ : ', error);
      });
  }
  confirmDistance(): void {
    if (
      this.distanceBetweenPoints === null ||
      this.distanceBetweenPoints <= 0
    ) {
      this.showError = true; // Show error message if input is invalid
      return; // Exit the function if validation fails
    }

    this.showError = false; // Hide error message if input is valid

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
    this.isDistanceConfirmed = true; // Make the Save button visible
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
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Reset the points array and hide the distance dialog
      this.points = [];
      this.showDistanceDialog = false;
      this.distanceBetweenPoints = null; // Reset distance if applicable

      // Redraw the image if necessary without resetting canvas size
      const img = new Image();
      img.src = this.imageSrc || '';
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw image on the cleared canvas
      };
    }
    console.clear();
  }

  @HostListener('click', ['$event'])
  onImagePopupCanvasClick(event: MouseEvent): void {
    if (!this.showImagePopup || !this.imagePopupCanvas) return;
    const targetElement = event.target as HTMLElement;
    // Check if the click was on the "Clear" button, and if so, return early
    if (targetElement.classList.contains('clear-btn')) {
      return;
    }
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

  private plotPointOnImagePopupCanvas(x: number, y: number): void {
    const canvas = this.imagePopupCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;

    // Plot the node on the canvas
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();

    // Add the node to the nodes array with an ID
    const nodeId = this.nodeCounter++;
    this.Nodes.push({
      id: nodeId,
      x: x,
      y: y,
      type: this.plottingMode || 'single',
    });

    // Log the node details in JSON format
    this.logNodeDetails();
  }

  private logNodeDetails(): void {
    const nodesJson = JSON.stringify(this.Nodes, null, 2);
    console.log('Node details:', nodesJson);
  }
  open(): void {
    if (this.mapName && this.siteName) {
      for (let map of this.EnvData) {
        if (this.mapName.toLowerCase() === map.mapName?.toLowerCase()) {
          alert('Map name seems already exists, try another');
          return;
        }
      }
    }

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
    } else {
      alert('Please enter both Map Name and Site Name before clicking Open.');
    }
  }

  close(): void {
    this.closePopup.emit(); // Then close the popup
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
    const radius = 6; // Node radius
    const canvas = this.overlayCanvas.nativeElement;
    const transformedY = canvas.height - node.y; // Flip the Y-axis for node.y
  
    const dx = mouseX - node.x;
    const dy = mouseY - transformedY; // Use transformed Y-coordinate
    return dx * dx + dy * dy <= radius * radius;
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
        this.showNodeDetailsPopup();
        break;
      }
    }
  }

  showNodeDetailsPopup(): void {
    this.isNodeDetailsPopupVisible = true;
    this.cdRef.detectChanges(); // Ensure the popup updates
  }
  private drawNode(node: { x: number; y: number }, color: string, selected: boolean): void {
    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
        const transformedY = canvas.height - node.y; // Flip the Y-axis
        ctx.beginPath();
        ctx.arc(node.x, transformedY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = selected ? color : 'blue';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = selected ? 3 : 1;
        ctx.fill();
        ctx.stroke();
    }
  }
  // in changing process
  plotSingleNode(x: number, y: number): void {
    const canvas = this.overlayCanvas.nativeElement;
    const transformedY = canvas.height - y; // Flip the Y-axis

    const color = 'blue'; // Color for single nodes
    this.drawNode({ x, y: this.overlayCanvas.nativeElement.height-y }, color, false);

    this.nodeDetails = {
        id: this.nodeCounter,
        x: x * (this.ratio || 1), // Adjust for ratio if present
        y: transformedY * (this.ratio || 1),
        description: 'Single Node',
        actions: [],
    };
    console.log(
        `Type: Single Node, Node Number: ${this.nodeCounter}, Position:`,
        { x, y: transformedY }
    );

    this.nodes.push({ id: this.nodeCounter, x, y: transformedY });
    this.Nodes.push({ ...this.nodeDetails, type: 'single' });

    this.nodeCounter++; // Increment the node counter after assignment
    this.isPlottingEnabled = false; // Disable plotting after placing a single node
}

  plotMultiNode(x: number, y: number): void {
    const canvas = this.overlayCanvas.nativeElement;
    const transformedY = canvas.height - y; // Flip the Y-axis

    if (this.nodes.length >= 2) {
        alert('Only two nodes can be plotted in multi-node mode.');
        return;
    }

    const color = 'blue'; // Color for multi-nodes
    this.drawNode({ x, y: transformedY }, color, false);

    console.log(
        `Type: Multi Node, Node Number: ${this.nodeCounter}, Position:`,
        { x, y: transformedY }
    ); // Log the node number and position

    if (this.ratio !== null) {
        const distanceX = x * this.ratio;
        const distanceY = transformedY * this.ratio;
        console.log(
            `Type: Multi Node, Node Number: ${this.nodeCounter}, Distance (meters): X: ${distanceX.toFixed(
                2
            )}, Y: ${distanceY.toFixed(2)}`
        );
    }
    this.nodeDetails = {
        id: this.nodeCounter,
        x: x, // Adjust for ratio if present
        y: transformedY,
        description: 'Multi Node',
        actions: [],
    };
    this.nodeCounter++; // Increment the node counter

    if (this.nodes.length === 0) {
        this.firstNode = { x, y: transformedY };
    } else if (this.nodes.length === 1) {
        this.secondNode = { x, y: transformedY };
        this.showIntermediateNodesDialog = true;
        this.isPlottingEnabled = false; // Disable further plotting after two nodes
    }
    this.nodes.push({ id: this.nodeCounter, x, y: transformedY }); // Assign ID before incrementing
  }

  onInputChanged(): void {
    this.isEnterButtonVisible =
      this.numberOfIntermediateNodes !== null &&
      this.numberOfIntermediateNodes > 0;
  }
  plotIntermediateNodes(): void {
    if (this.numberOfIntermediateNodes && this.numberOfIntermediateNodes > 0) {
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
          this.nodes.push({ id: this.nodeCounter, x, y });

          this.nodeDetails = {
            id: this.nodeCounter,
            x: x * (this.ratio || 1), // Adjust for ratio if present
            y: y * (this.ratio || 1),
            description: 'Intermediate Node',
            actions: [],
          };

          this.drawNode({ x, y }, 'blue', false); // Set the initial color and no outline
          console.log(
            `Type: Intermediate Node, Node Number: ${this.nodeCounter}, Position:`,
            { x, y }
          );

          this.Nodes.push({ ...this.nodeDetails, type: 'multi' });

          this.nodeCounter++; // Increment the node counter
        }
      }
      this.closeIntermediateNodesDialog();
    }
  }

  closeIntermediateNodesDialog(): void {
    this.showIntermediateNodesDialog = false;
    this.firstNode = null;
    this.secondNode = null;
    this.numberOfIntermediateNodes = 0;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (this.overlayCanvas && this.overlayCanvas.nativeElement) {
      const rect = this.overlayCanvas.nativeElement.getBoundingClientRect();
      const x =
        (event.clientX - rect.left) *
        (this.overlayCanvas.nativeElement.width / rect.width);
      const y =
        (event.clientY - rect.top) *
        (this.overlayCanvas.nativeElement.height / rect.height);

      if (this.isDrawingZone) {
        this.startX = x;
        this.startY = y;
        this.currentZone = {
          type: 'low',
          startX: this.startX,
          startY: this.startY,
          endX: this.startX,
          endY: this.startY,
          color: this.zoneColor!,
        };
      }

      let nodeClicked = false;
      for (const node of this.nodes) {
        if (this.isNodeClicked(node, x, y)) {
          this.onNodeClick(node.x, node.y);
          nodeClicked = true;
          break;
        }
      }

      if (this.selectedNode && nodeClicked) {
        this.isDrawingLine = true;
        this.lineStartX = x;
        this.lineStartY = y;
        this.lineEndX = x;
        this.lineEndY = y;
      }

      if (!nodeClicked && this.isPlottingEnabled) {
        if (this.plottingMode === 'single') {
          this.plotSingleNode(x, y);
        } else if (this.plottingMode === 'multi') {
          this.plotMultiNode(x, y);
        } else if (this.selectedAsset) {
          this.plotAsset(x, y); // Plot asset if an asset is selected
        }
      }
    }
  }
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDrawingLine) {
      const canvas = this.overlayCanvas.nativeElement;
      const rect = canvas.getBoundingClientRect();
      this.lineEndX = (event.clientX - rect.left) * (canvas.width / rect.width);
      this.lineEndY =
        (event.clientY - rect.top) * (canvas.height / rect.height);

      // Redraw the canvas to show the line preview
      this.redrawCanvas();
      this.drawArrowLine(
        this.lineStartX!,
        this.lineStartY!,
        this.lineEndX!,
        this.lineEndY!
      );
    }
    if (
      this.isDrawingZone &&
      this.currentZone &&
      this.overlayCanvas &&
      this.overlayCanvas.nativeElement
    ) {
      const rect = this.overlayCanvas.nativeElement.getBoundingClientRect();
      const endX =
        (event.clientX - rect.left) *
        (this.overlayCanvas.nativeElement.width / rect.width);
      const endY =
        (event.clientY - rect.top) *
        (this.overlayCanvas.nativeElement.height / rect.height);

      // Update the current zone's end coordinates
      this.currentZone.endX = endX;
      this.currentZone.endY = endY;
      // Clear the canvas and redraw all zones
      this.redrawZones();
    }
  }
  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (this.isDrawingLine) {
      this.isDrawingLine = false;

      // Finalize the line drawing
      this.drawArrowLine(
        this.lineStartX!,
        this.lineStartY!,
        this.lineEndX!,
        this.lineEndY!
      );

      // Optionally, store the connection details here...
      this.connections.push({
        fromId: (this.selectedNode as { id: number; x: number; y: number }).id,
        toId: this.nodeCounter, // Assuming you want to create a new node at the end
        type: this.connectivityMode || 'uni',
      });

      // Reset the start and end positions
      this.lineStartX = this.lineStartY = this.lineEndX = this.lineEndY = null;
    }
    if (
      this.isDrawingZone &&
      this.currentZone &&
      this.overlayCanvas &&
      this.overlayCanvas.nativeElement
    ) {
      const rect = this.overlayCanvas.nativeElement.getBoundingClientRect();
      const endX =
        (event.clientX - rect.left) *
        (this.overlayCanvas.nativeElement.width / rect.width);
      const endY =
        (event.clientY - rect.top) *
        (this.overlayCanvas.nativeElement.height / rect.height);

      // Update the current zone's end coordinates
      this.currentZone.endX = endX;
      this.currentZone.endY = endY;

      // Check for overlap with existing zones
      if (this.checkZoneOverlap(this.currentZone)) {
        alert('Zones cannot overlap! The overlapping zone has been removed.');
        this.currentZone = null; // Reset the current zone
        this.isDrawingZone = false;

        // Clear the canvas and redraw all zones without the current one
        this.redrawZones();
        return; // Exit early to prevent saving the overlapping zone
      }

      // Save the current zone to the zones array
      this.zones.push(this.currentZone);

      // Redraw all zones
      this.redrawZones();

      // Reset drawing state
      this.isDrawingZone = false;
      this.currentZone = null;
    }
  }

  private checkZoneOverlap(newZone: Zone): boolean {
    for (const zone of this.zones) {
      if (this.isOverlapping(zone, newZone)) {
        return true;
      }
    }
    return false;
  }

  private isOverlapping(zone1: Zone, zone2: Zone): boolean {
    return !(
      zone2.startX > zone1.endX ||
      zone2.endX < zone1.startX ||
      zone2.startY > zone1.endY ||
      zone2.endY < zone1.startY
    );
  }

  private redrawCanvas(): void {
    // Clear the canvas and redraw all elements (nodes, zones, lines, etc.)
    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.nodes.forEach((node) => this.drawNode(node, 'blue', false));
      // Redraw connections if needed
      this.connections.forEach((connection) => {
        const fromNode = this.nodes.find(
          (node) => node.id === connection.fromId
        );
        const toNode = this.nodes.find((node) => node.id === connection.toId);
        if (fromNode && toNode) {
          this.drawArrowLine(fromNode.x, fromNode.y, toNode.x, toNode.y);
        }
      });
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
      ctx!.rect(
        zone.startX,
        zone.startY,
        zone.endX - zone.startX,
        zone.endY - zone.startY
      );
      ctx!.fillStyle = zone.color;
      ctx!.fill();
      ctx!.stroke();
    }
    // Draw the current zone being drawn
    if (this.currentZone) {
      ctx!.beginPath();
      ctx!.rect(
        this.currentZone.startX,
        this.currentZone.startY,
        this.currentZone.endX - this.currentZone.startX,
        this.currentZone.endY - this.currentZone.startY
      );
      ctx!.fillStyle = this.currentZone.color;
      ctx!.fill();
      ctx!.stroke();
    }
  }

  // in chaging process
  drawConnections(): void {
    if (
      !this.selectedNode ||
      !this.lastSelectedNode ||
      !this.connectivityMode
    ) {
      console.log('Not enough nodes or mode is not set');
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
