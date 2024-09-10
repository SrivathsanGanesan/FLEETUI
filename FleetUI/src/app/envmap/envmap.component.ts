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
import { sequence } from '@angular/animations';

interface Node {
  id: string;
  sequenceId: number;
  description: string;
  released: boolean;
  pos: { x: number; y: number; orientation: number };
  actions: any[];
  intermediate_node:boolean;
  Waiting_node:boolean;
}

interface Edge {
  edgeId: string; //Unique edge identification
  sequenceId: number; //Number to track the sequence of nodes and edges in an order and to simplify order updates
  edgeDescription: string; //Additional information on the edge
  released: boolean; //"true" indicates that the edge is part of the base. "false" indicates that the edge is part of the horizon.
  startNodeId: string; //nodeId of startNode
  endNodeId: string; //nodeId of endNode
  maxSpeed: number; //Permitted maximum speed on the edge in m/s
  maxHeight: number; //Permitted maximum height of the vehicle, including the load, on edge in m
  minHeight: number; //Permitted minimal height of the load handling device on the edge in m
  orientation: number; //Orientation of the AGV on the edge in rad
  orientationType: string; //The value orientationType defines if it has to be interpreted relative to the global project specific map coordinate system or tangential to the edge
  direction: string; //Sets direction at junctions for line-guided or wire-guided vehicles, to be defined initially (vehicle-individual)
  rotationAllowed: boolean; //“true”: rotation is allowed on the edge. “false”: rotation is not allowed on the edge.
  maxRotationSpeed: number; //Maximum rotation speed in rad/s
  // Trajectory trajectory; //Defines the curve, on which the AGV should move between startNode and endNode
  length: number; //Length of the path from startNode to endNode
  action: any[]; //Array of actionIds to be executed on the edge
}

interface asset {
  id: number;
  x: number;
  y: number;
  type: string;
  orientation : number,
  undockingDistance : number,
  desc : string
} // Array to track assets

interface Zone {
  id: string;
  pos: any[];
  type: ZoneType | null;
}

interface Robo {
  roboDet: any;
  x: number;
  y: number;
}

enum ZoneType {
  HIGH_SPEED_ZONE = 'High Speed Zone',
  MEDIUM_SPEED_ZONE = 'Medium Speed Zone',
  SLOW_SPEED_ZONE = 'Slow Speed Zone',
  MUTED_SPEED_ZONE = 'Muted Speed Zone',
  TURNING_SPEED_ZONE = 'Turning Speed Zone',
  IN_PLACE_SPEED_ZONE = 'In Place Speed Zone',
  CHARGING_ZONE = 'Charging Zone',
  PREFERRED_ZONE = 'Preferred Zone',
  UNPREFERRED_ZONE = 'Unpreferred Zone',
  KEEPOUT_ZONE = 'Keepout Zone',
  CRITICAL_SAFETY_ZONE = 'Critical Safety Zone',
  BLIND_LOCALISATION_ZONE = 'Blind Localisation Zone',
  DENSE_ZONE = 'Dense Zone',
  STRICTLY_PATH_ZONE = 'Strictly Path Zone',
  OBSTACLE_AVOIDANCE_ZONE = 'Obstacle Avoidance Zone',
  EMERGENCY_ZONE = 'Emergency Zone',
  MAINTENANCE_ZONE = 'Maintenance Zone',
  PARKING_ZONE = 'Parking Zone',
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
  orientationAngle: number = 0;
  nodes: Node[] = []; // Org_nodes
  edges: Edge[] = []; // Org_edges
  assets: asset[] = []; // Org_assets
  zones: Zone[] = []; // Org_zones
  robos: Robo[] = []; // Org_robos
  Nodes: {
    id: number;
    x: number;
    y: number;
    orientationAngle?: number;
    type: string;
  }[] = [];

  NodeDetails: {
    nodeID: string;
    sequenceId: number;
    nodeDescription: string;
    released: boolean;
    nodePosition: { x: number; y: number; orientation: number };
  }[] = []; // updated structure
  connections: { fromId: number; toId: number; type: 'uni' | 'bi' }[] = []; // connections
  isNodeDetailsPopupVisible = false; // Control popup visibility
  ratio: number | null = null; // Store the resolution ratio (meters per pixel)
  plottingMode: 'single' | 'multi' | null = null;
  isPlottingEnabled: boolean = false;
  isDrawing: boolean = false;
  startX: number | null = null;
  startY: number | null = null;
  isOptionsMenuVisible = false;
  isCalibrationLayerVisible = false;
  showIntermediateNodesDialog: boolean = false;
  numberOfIntermediateNodes: number = 0;
  firstNode: Node | null = null;
  secondNode: Node | null = null;
  robotImages: { [key: string]: HTMLImageElement } = {};
  isRobotPopupVisible: boolean = false;
  tableData: { mapName: string; siteName: string }[] = []; // Holds table data
  private points: { x: number; y: number }[] = [];
  showImagePopup: boolean = false;
  showDistanceDialog: boolean = false;
  distanceBetweenPoints: number | null = null;
  private nodeCounter: number = 1; // Counter to assign node numbers
  private edgeCounter: number = 1; // Counter to assign edge numbers
  private actionCounter: number = 1; // Counter to assign action numbers
  private assetCounter: number = 1; // counter to assign asset numbers
  private zoneCounter: number = 1; // counter to assigh zone numbers
  private zonePosCounter: number = 1; // counter to assign zone numbers
  selectedNode: Node | null = null;
  lastSelectedNode: { x: number; y: number } | null = null;
  node: { id: number; x: number; y: number }[] = []; // Nodes with unique IDs
  nodeDetails: {
    id: number;
    x: number;
    y: number;
    description: string;
    actions: string[]; // Can allow null if needed
    intermediate_node:boolean;
    waiting_node:boolean;
  } = {
    id: 1,
    x: 0,
    y: 0,
    description: '',
    actions: [], // Initialize with a non-null value
    intermediate_node:false,
    waiting_node:false
  };
  isMoveActionFormVisible: boolean = true;
  isDockActionFormVisible: boolean = true;
  isUndockActionFormVisible: boolean = true;
  private isDrawingLine: boolean = false; // Tracks if a line is being drawn
  private lineStartX: number | null = null;
  private lineStartY: number | null = null;
  private lineEndX: number | null = null;
  private lineEndY: number | null = null;
  selectedAction: string = ''; // Initialize with an empty string or any other default value
  actions: any[] = []; // Array to hold the list of actions with parameters
  isDistanceConfirmed = false; // Flag to control the Save button
  isEnterButtonVisible = false;
  isCanvasInitialized = false;
  showError: boolean = false; // Flag to show error message
  direction: 'uni' | 'bi' | null = null;
  selectedAssetType: string | null = null;
  assetImages: { [key: string]: HTMLImageElement } = {};
  // selectedAsset: { x: number, y: number, type: string } | null = null;
  selectedRobo: Robo | null = null;
  selectedAsset: asset | null = null;
  draggingAsset: boolean = false;
  draggingRobo: boolean = false;
  isZonePlottingEnabled = false;
  plottedPoints: { id: number; x: number; y: number }[] = [];
  firstPlottedPoint: { id: number; x: number; y: number } | null = null;
  zoneType: ZoneType | null = null; // Selected zone type
  isPopupVisible: boolean = false; // Popup visibility
  zoneColors: { [key in ZoneType]: string } = {
    [ZoneType.HIGH_SPEED_ZONE]: 'rgba(255, 0, 0, 0.3)', // Red with 30% opacity
    [ZoneType.MEDIUM_SPEED_ZONE]: 'rgba(255, 165, 0, 0.3)', // Orange with 30% opacity
    [ZoneType.SLOW_SPEED_ZONE]: 'rgba(255, 255, 0, 0.3)', // Yellow with 30% opacity
    [ZoneType.MUTED_SPEED_ZONE]: 'rgba(0, 128, 0, 0.3)', // Green with 30% opacity
    [ZoneType.TURNING_SPEED_ZONE]: 'rgba(0, 0, 255, 0.3)', // Blue with 30% opacity
    [ZoneType.IN_PLACE_SPEED_ZONE]: 'rgba(75, 0, 130, 0.3)', // Indigo with 30% opacity
    [ZoneType.CHARGING_ZONE]: 'rgba(238, 130, 238, 0.3)', // Violet with 30% opacity
    [ZoneType.PREFERRED_ZONE]: 'rgba(0, 255, 255, 0.3)', // Cyan with 30% opacity
    [ZoneType.UNPREFERRED_ZONE]: 'rgba(128, 0, 128, 0.3)', // Purple with 30% opacity
    [ZoneType.KEEPOUT_ZONE]: 'rgba(255, 69, 0, 0.3)', // OrangeRed with 30% opacity
    [ZoneType.CRITICAL_SAFETY_ZONE]: 'rgba(255, 20, 147, 0.3)', // DeepPink with 30% opacity
    [ZoneType.BLIND_LOCALISATION_ZONE]: 'rgba(127, 255, 0, 0.3)', // Chartreuse with 30% opacity
    [ZoneType.DENSE_ZONE]: 'rgba(220, 20, 60, 0.3)', // Crimson with 30% opacity
    [ZoneType.STRICTLY_PATH_ZONE]: 'rgba(0, 0, 139, 0.3)', // DarkBlue with 30% opacity
    [ZoneType.OBSTACLE_AVOIDANCE_ZONE]: 'rgba(0, 100, 0, 0.3)', // DarkGreen with 30% opacity
    [ZoneType.EMERGENCY_ZONE]: 'rgba(139, 0, 0, 0.3)', // DarkRed with 30% opacity
    [ZoneType.MAINTENANCE_ZONE]: 'rgba(184, 134, 11, 0.3)', // DarkGoldenRod with 30% opacity
    [ZoneType.PARKING_ZONE]: 'rgba(47, 79, 79, 0.3)', // DarkSlateGray with 30% opacity
  };
  roboInitOffset: number = 60;
  draggingRobot: Robo | null = null; // Currently dragged robot
  deselectTimeout: any = null;
  highlightDuration = 2000; // Example: 2 seconds 
  currentEdge : Edge = {
      edgeId: '',
      sequenceId: 0,
      edgeDescription: '',
      released: true,
      startNodeId: '',
      endNodeId: '',
      maxSpeed: 0,
      maxHeight: 0,
      minHeight: 0,
      orientation: 0,
      orientationType: '',
      direction: 'UN_DIRECTIONAL',
      rotationAllowed: true,
      maxRotationSpeed: 0,
      length: 0,
      action : [],
    };
  showPopup = false;
  zoneTypeList = Object.values(ZoneType); // Converts the enum to an array
  DockPopup: boolean = false; // To control the popup visibility
  popupPosition = { x: 0, y: 0 }; // To store the popup position
  undockingDistance: string = ''; // Input field for undocking distance
  description: string = ''; // Input field for description
  selectedAssetId: string | null = null; // Store the selected asset ID

  setDirection(direction: 'uni' | 'bi'): void {
    this.toggleOptionsMenu();
    this.deselectNode();
    this.direction = direction;
    this.firstNode = null;
    this.secondNode = null;
  }
  selectAssetType(assetType: string) {
    this.toggleOptionsMenu();
    this.selectedAssetType = assetType;
  }
  
  constructor(
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private projectService: ProjectService
  ) {}
  ngAfterViewInit(): void {
    this.projData = this.projectService.getSelectedProject();
    if (!this.overlayCanvas || !this.imageCanvas) return;

      const canvas = this.overlayCanvas?.nativeElement;
      const imageCanvas = this.imageCanvas?.nativeElement;
      if (canvas && imageCanvas) {
        // Set the size of the overlay canvas to match the image canvas
        canvas.width = imageCanvas.width;
        canvas.height = imageCanvas.height;
  
        this.setupCanvas();
        this.isCanvasInitialized = true; // Avoid re-initializing the canvas
      } else {
        console.error('Canvas element(s) still not found');
      }
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
    const imageCanvas = this.imageCanvas?.nativeElement;
    if (!canvas || !imageCanvas) {
      console.error('Canvas element not found');
      return;
    }
  
    // Set the overlay canvas size to match the image canvas size
    canvas.width = imageCanvas.width;
    canvas.height = imageCanvas.height;
  
    // Ensure the canvas has a valid width and height
    if (canvas.width === 0 || canvas.height === 0) {
      console.error('Canvas width or height is zero');
      return;
    }
  
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Initialize assets and robots
      this.assetImages['docking'] = new Image();
      this.assetImages['docking'].src = 'assets/Asseticon/docking-station.svg';
  
      this.assetImages['charging'] = new Image();
      this.assetImages['charging'].src = 'assets/Asseticon/charging-station.svg';
  
      this.robotImages['robotA'] = new Image();
      this.robotImages['robotA'].src = 'assets/CanvasRobo/robotA.svg';
  
      this.robotImages['robotB'] = new Image();
      this.robotImages['robotB'].src = 'assets/CanvasRobo/robotB.svg';
    } else {
      console.error('Failed to get canvas context');
    }
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
      (node) => Math.abs(node.pos.x - x) < 5 && Math.abs(node.pos.y - y) < 5
    );

    // if (selected) {
    //   this.selectedNode = selected;
    //   console.log(
    //     `Node selected at position: (${x.toFixed(2)}, ${y.toFixed(2)})`
    //   );
    // }
  }
  deleteSelectedNode(): void {
    if (this.selectedNode) {
      // Remove from nodes array
      this.nodes = this.nodes.filter((node) => {
        return (
          node.pos.x !== this.selectedNode?.pos.x &&
          node.pos.y !== this.selectedNode?.pos.y
        );
      });

      this.edges = this.edges.filter((edge) => {
        return (
          edge.startNodeId !== this.selectedNode?.id &&
          edge.endNodeId !== this.selectedNode?.id
        );
      });
      console.log(this.edges);
      // this.cdRef.detectChanges(); // remove in later..

      // Clear the selectedNode
      this.selectedNode = null;
      // Redraw the canvas
      this.redrawCanvas();
    } else {
      console.log('No node selected to delete.');
    }
    this.isNodeDetailsPopupVisible = false;

  }
  closeImagePopup(): void {
    this.showImagePopup = false;
  }
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
  addAction(): void {
    if (this.selectedAction) {
      let action: any;

      if (this.selectedAction === 'Move') {
        action = {
          actionType: this.selectedAction,
          actionId: `action_${this.actionCounter}`,
          actionDescription: 'Move to the next Point',
          parameters: { ...this.moveParameters },
        };
        this.actionCounter++;
      } else if (this.selectedAction === 'Dock') {
        action = {
          actionType: this.selectedAction,
          actionId: `action_${this.actionCounter}`,
          actionDescription: 'Dock at the Charging Station',
          parameters: { ...this.dockParameters },
        };
        this.actionCounter++;
      } else if (this.selectedAction === 'Undock') {
        action = {
          actionType: this.selectedAction,
          actionId: `action_${this.actionCounter}`,
          actionDescription: 'undock from the charging station',
          parameters: { ...this.undockParameters },
        };
        this.actionCounter++;
      }

      this.actions.push(action);
      this.nodes = this.nodes.map((node) => {
        console.log(this.selectedNode?.id, node.id);
        if (this.selectedNode?.id === node.id) node.actions.push(action);
        return node;
      });
      this.cdRef.detectChanges();

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
      mpp: this.ratio,
      imgUrl: '',
      zones: this.zones,
      edges: this.edges,
      nodes: this.nodes,
      stations: this.assets,
    };
    this.form?.append('mapImg', this.selectedImage);
    this.form?.append('mapData', JSON.stringify(mapData)); // Insert the map related data here..
    fetch(`http://${environment.API_URL}:${environment.PORT}/dashboard/maps`, {
      method: 'POST',
      credentials: 'include',
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
            createdAt: data.map.createdAt,
          });
          this.EnvData.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          this.cdRef.detectChanges();
        }

        console.log(this.EnvData);

        this.closePopup.emit();
      })
      .catch((error) => {
        console.error('Error occ : ', error);
      });

    this.form = null;
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
  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent): void {
    event.preventDefault();
    const rect = this.overlayCanvas.nativeElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (this.overlayCanvas.nativeElement.width / rect.width);
    const y = (event.clientY - rect.top) * (this.overlayCanvas.nativeElement.height / rect.height);

    // Check if a node is clicked
    for (const node of this.nodes) {
      if (this.isNodeClicked(node, x, y)) {
        this.showNodeDetailsPopup();
            return;
        }
    }
    // Check if the click is on an edge
    const clickedEdge = this.edges.find(edge => this.isPointOnEdge(edge, x, y));
    for (const asset of this.assets) {
      if (this.isAssetClicked(asset, x, y)) {
        console.log('asset clicked');
        
        this.selectedAsset = asset;
        this.DockPopup = true; // Show the popup
        // this.popupPosition = { x: event.clientX, y: event.clientY }; // Set popup position
        // this.selectedAssetId = asset.id; // Store selected asset ID
        return;
      }
    }
    if (clickedEdge) {
      this.currentEdge = clickedEdge; // Set the current edge details
      this.DockPopup = true; // Show the popup
    }
  }
  savePopupData(): void {
    console.log(this.selectedAsset);
    
    if (this.selectedAsset) {
      // Find the asset and update its properties
      this.assets = this.assets.map((asset) => {
        if (asset) {
          asset.undockingDistance = parseInt(this.undockingDistance);
          asset.desc = this.description; //this.selectedAsset?.desc ? this.selectedAsset?.desc : ''
        }
        return asset;
      });
     this.redrawCanvas()
    }
    console.log(this.assets);
    
    this.closePopup1();
  }
  closePopup1(): void {
    this.DockPopup = false;
    this.undockingDistance = '';
    this.description = '';
    this.selectedAssetId = null;
  }
  showNodeDetailsPopup(): void {
    this.isNodeDetailsPopupVisible = true;
    this.cdRef.detectChanges(); // Ensure the popup updates
  }
  private drawNode(node: Node, color: string, selected: boolean): void {
    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      const transformedY = canvas.height - node.pos.y; // Flip the Y-axis
      ctx.beginPath();
      ctx.arc(node.pos.x, transformedY, 7, 0, 2 * Math.PI);
      ctx.fillStyle = selected ? color : 'blue';
      ctx.lineWidth = selected ? 3 : 1;
      ctx.fill();
  
      // Draw the node ID below the node
      ctx.font = '12px Arial'; // Font size and type
      ctx.fillStyle = 'black'; // Text color
      ctx.textAlign = 'center'; // Center align text
      ctx.textBaseline = 'top'; // Position text below the node
      ctx.fillText(node.id, node.pos.x, transformedY + 10); // Draw node ID
    }
  }
  private drawArrowLine(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    maxHeight: number = 50, // Maximum allowed height
    maxWidth: number = 50 // Maximum allowed width
  ): void {
    console.log(startX, startY);

    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Apply the Y-transformation (assuming the transformation inverts the Y-coordinate)
      const canvasHeight = canvas.height;
      const transformedStartY = canvasHeight - startY;
      let transformedEndY = canvasHeight - endY;

      // Calculate the actual height of the line
      let height = Math.abs(transformedEndY - transformedStartY);
      let width = Math.abs(endX - startX);

      // Adjust the endY coordinate if the height exceeds maxHeight
      if (height > maxHeight) {
        const directionY = transformedEndY > transformedStartY ? 1 : -1; // Determine if the line is going up or down
        transformedEndY = transformedStartY + directionY * maxHeight;
      }

      // Adjust the endX coordinate if the width exceeds maxWidth
      if (width > maxWidth) {
        const directionX = endX > startX ? 1 : -1; // Determine if the line is going right or left
        endX = startX + directionX * maxWidth;
      }

      // Recalculate the angle after possible adjustments
      const angleRadians = Math.atan2(
        transformedEndY - transformedStartY,
        endX - startX
      );
      const angleDegrees = angleRadians * (180 / Math.PI);
      // Update the orientationAngle of the node
      const currentNode = this.nodes.find((node) => {
        if (Math.abs(node.pos.x - startX) <= 5)
          node.pos.orientation = angleDegrees;
      });

      this.orientationAngle = angleDegrees;
      if (this.secondNode) this.secondNode.pos.orientation = angleDegrees;
      if (currentNode) {
        currentNode.pos.orientation = angleDegrees;
      }

      console.log(
        `Orientation angle with respect to the X-axis: ${angleDegrees.toFixed(
          2
        )}°`
      );

      // Draw the line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, canvasHeight - transformedEndY); // Use transformedEndY for correct rendering
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw arrowhead
      const arrowLength = 10;
      ctx.beginPath();
      ctx.moveTo(endX, canvasHeight - transformedEndY); // Arrow at the adjusted end point
      ctx.lineTo(
        endX - arrowLength * Math.cos(angleRadians - Math.PI / 6),
        canvasHeight -
          transformedEndY +
          arrowLength * Math.sin(angleRadians - Math.PI / 6)
      );
      ctx.moveTo(endX, canvasHeight - transformedEndY);
      ctx.lineTo(
        endX - arrowLength * Math.cos(angleRadians + Math.PI / 6),
        canvasHeight -
          transformedEndY +
          arrowLength * Math.sin(angleRadians + Math.PI / 6)
      );
      ctx.stroke();
    }
  }
  plotRobo(x: number, y: number, isSelected: boolean = false): void {
    const image = this.robotImages['robotB'];
    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (image && ctx) {
      const imageSize = 30;

      // Highlight the selected robot with a border or background
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(x, y, imageSize * 1, 0, 2 * Math.PI); // Draw a circle centered on the robot
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Semi-transparent red
        ctx.fill();
        ctx.closePath();
      }

      // Draw the robot image
      ctx.drawImage(
        image,
        x - imageSize / 2,
        y - imageSize / 2,
        imageSize * 1.3,
        imageSize
      );
    }
  }
  drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number): void {
    ctx.font = '12px Arial'; // Set font size and family
    ctx.fillStyle = 'black'; // Set text color
    ctx.textAlign = 'center'; // Center align the text
    ctx.textBaseline = 'top'; // Align text from the top
    ctx.fillText(text, x, y); // Draw text at (x, y)
  }
  
  plotSingleNode(x: number, y: number): void {
    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const transformedY = canvas.height - y; // Flip the Y-axis

    const color = 'blue'; // Color for single nodes
    this.drawNode(
      {
        id: '',
        sequenceId: 0,
        description: '',
        released: true,
        pos: { x: x, y: transformedY, orientation: 0 },
        intermediate_node : false,
        Waiting_node : false,
        actions: [],
      },
      color,
      false
    );

    this.nodeDetails = {
      id: this.nodeCounter,
      x: x * (this.ratio || 1), // Adjust for ratio if present
      y: transformedY * (this.ratio || 1),
      description: '',
      actions: [],
      intermediate_node:false,
      waiting_node:false
    };
    console.log(
      `Type: Single Node, Node Number: ${this.nodeCounter}, Position:`,
      { x, y: transformedY }
    );
    let node = {
      id: this.nodeCounter.toString(),
      sequenceId: this.nodeCounter,
      description: '',
      released: true,
      pos: { x: x, y: transformedY, orientation: this.orientationAngle },
      actions: [],
      intermediate_node : false,
      Waiting_node : false
    };
    //{ id: this.nodeCounter.toString(), x, y: transformedY,type: 'single' }
    this.nodes.push(node);
    this.Nodes.push({ ...this.nodeDetails, type: 'single' });
    

    this.nodeCounter++; // Increment the node counter after assignment
    this.isPlottingEnabled = false; // Disable plotting after placing a single node

    this.isDrawingLine = true;
    this.lineStartX = x;
    this.lineStartY = y;

    this.overlayCanvas.nativeElement.addEventListener( 'mousemove', this.onMouseMove.bind(this) );
    this.overlayCanvas.nativeElement.addEventListener( 'mouseup', this.onMouseUp.bind(this) );
  }
  setPlottingMode(mode: 'single' | 'multi'): void {
    this.plottingMode = mode;
    this.isPlottingEnabled = true;
    this.toggleOptionsMenu();

    if (mode === 'multi') {
      // this.nodes = [];
      this.firstNode = null;
      this.secondNode = null;
    }
  }
  plotMultiNode(x: number, y: number): void {
    const canvas = this.overlayCanvas.nativeElement;
    const transformedY = canvas.height - y; // Flip the Y-axis

    const color = 'blue'; // Color for multi-nodes
    this.drawNode(
      {
        id: '',
        sequenceId: 0,
        description: '',
        released: true,
        pos: { x: x, y: transformedY, orientation: 0 },
        actions: [],
        intermediate_node :false,
        Waiting_node :false
      },
      color,
      false
    );

    console.log(
      `Type: Multi Node, Node Number: ${this.nodeCounter}, Position:`,
      { x, y: transformedY }
    ); // Log the node number and position

    if (this.ratio !== null) {
      const distanceX = x * this.ratio;
      const distanceY = transformedY * this.ratio;
      console.log(
        `Type: Multi Node, Node Number: ${
          this.nodeCounter
        }, Distance (meters): X: ${distanceX.toFixed(
          2
        )}, Y: ${distanceY.toFixed(2)}`
      );
    }

    this.nodeDetails = {
      id: this.nodeCounter,
      x: x, // Adjust for ratio if present
      y: transformedY,
      description: '',
      actions: [],
      intermediate_node:false,
      waiting_node:false
    };

    if (this.firstNode === null) {
      // Plotting the first node
      let firstnode = {
        id: this.nodeCounter.toString(),
        sequenceId: this.nodeCounter,
        description: '',
        released: true,
        pos: { x: x, y: transformedY, orientation: 0 },
        actions: [],
        intermediate_node :false,
        Waiting_node :false
      };
      this.firstNode = firstnode;
      this.nodes.push(firstnode);
    } else if (this.secondNode === null) {
      // Plotting the second node
      let secondnode = {
        id: this.nodeCounter.toString(),
        sequenceId: this.nodeCounter,
        description: '',
        released: true,
        pos: { x: x, y: transformedY, orientation: 0 },
        actions: [],
        intermediate_node :false,
        Waiting_node :false
      };
      this.secondNode = secondnode;
      this.nodes.push(secondnode);

      this.isDrawingLine = true;
      this.lineStartX = x;
      this.lineStartY = y;

      this.overlayCanvas.nativeElement.addEventListener(
        'mousemove',
        this.onMouseMove.bind(this)
      );
      this.overlayCanvas.nativeElement.addEventListener(
        'mouseup',
        this.onMouseUp.bind(this)
      );

      this.showIntermediateNodesDialog = true;
      this.isPlottingEnabled = false; // Disable further plotting after two nodes
    } else {
      // Plotting additional nodes
      let node = {
        id: this.nodeCounter.toString(),
        sequenceId: this.nodeCounter,
        description: '',
        released: true,
        pos: {
          x: x,
          y: transformedY,
          orientation: this.secondNode.pos.orientation,
        },
        actions: [],
        intermediate_node :false,
        Waiting_node :false
      };
      this.nodes.push(node);
    }

    this.Nodes.push({ ...this.nodeDetails, type: 'multi' });
    this.nodeCounter++; // Increment the node counter
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
          (this.secondNode.pos.x - this.firstNode.pos.x) /
          (this.numberOfIntermediateNodes + 1);
        const dy =
          (this.secondNode.pos.y - this.firstNode.pos.y) /
          (this.numberOfIntermediateNodes + 1);

        for (let node of this.nodes) {
          if (
            node.pos.x == this.firstNode?.pos.x &&
            node.pos.y == this.firstNode?.pos.y
          )
            node.pos.orientation = this.secondNode!.pos.orientation;
        }

        for (let i = 1; i <= this.numberOfIntermediateNodes; i++) {
          const x = this.firstNode.pos.x + i * dx;
          const y = this.firstNode.pos.y + i * dy;
          let node = {
            id: this.nodeCounter.toString(),
            sequenceId: this.nodeCounter,
            description: '',
            released: true,
            pos: { x: x, y: y, orientation: this.secondNode!.pos.orientation },
            actions: [],
            intermediate_node :false,
            Waiting_node :false
          };
          this.nodes.push(node);

          this.nodeDetails = {
            id: this.nodeCounter,
            x: x * (this.ratio || 1), // Adjust for ratio if present
            y: y * (this.ratio || 1),
            description: 'Intermediate Node',
            actions: [],
            intermediate_node:false,
            waiting_node:false
          };

          this.drawNode(
            {
              id: '',
              sequenceId: 0,
              description: '',
              released: true,
              pos: { x: x, y: y, orientation: 0 },
              actions: [],
              intermediate_node :false,
              Waiting_node :false
            },
            'blue',
            false
          ); // Set the initial color and no outline
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
  saveNodeDetails(): void {

    // Ensure the nodeDetails object includes the checkbox values
    // const updatedNodeDetails = {
    //   ...this.nodeDetails,  // Spread the existing details
    //   intermediate_node: this.nodeDetails.intermediate_node,
    //   waiting_node: this.nodeDetails.waiting_node,
    // };
    if (this.selectedNode) {
      const nodeIndex = this.nodes.findIndex(node => node.id === this.selectedNode!.id);


    if (nodeIndex !== -1) {
      this.nodes[nodeIndex].description = this.nodeDetails.description;
      this.nodes[nodeIndex].intermediate_node = this.nodeDetails.intermediate_node;
      this.nodes[nodeIndex].Waiting_node = this.nodeDetails.waiting_node;
    }
  }
    // Transform Nodes array to NodeDetails format
    this.NodeDetails = this.nodes.map((node, index) => ({
      nodeID: `node_${String(node.id).padStart(3, '0')}`, // Format nodeID as a string
      sequenceId: index + 1, // SequenceId is based on the order of nodes
      nodeDescription: this.nodeDetails.description || '', // Use node description
      intermediate_node: this.nodeDetails.intermediate_node,  // Bind checkbox value
      waiting_node: this.nodeDetails.waiting_node,  // Bind checkbox value
      released: true,
      nodePosition: {
        x: node.pos.x,
        y: node.pos.y,
        orientation: node.pos.orientation, // Use the latest orientation angle here
      },
      actions: this.actions, // Include actions here
    }));

    // Log the JSON object to the console
    console.log(this.nodes);
    console.log(this.edges);
    console.log(this.assets);
    console.log(this.zones);
    
    

    // // Save the JSON object to a file
    // const blob = new Blob([JSON.stringify(updatedNodeDetails, null, 2)], {
    //   type: 'application/json',
    // });
    // saveAs(blob, 'node-details.json');
  
    // Clear all the details for the previous node
    this.Nodes = []; // Clear the Nodes array
    this.resetParameters(); // Reset the parameters
    this.actions = []; // Clear the actions array
    this.selectedAction = ''; // Reset the selected action
    this.isNodeDetailsPopupVisible = false; // Hide the popup if needed
  }
  closeIntermediateNodesDialog(): void {
    this.showIntermediateNodesDialog = false;
    this.firstNode = null;
    this.secondNode = null;
    this.numberOfIntermediateNodes = 0;
  }
  private onNodeClick(x: number, y: number): void {
    // Find the clicked node
    let clickedNode: Node | undefined;
    clickedNode = this.nodes.find((node) => node.pos.x === x && node.pos.y === y);
  
    if (clickedNode) {
      if (!this.firstNode) {
        this.firstNode = clickedNode;
        this.drawNode(clickedNode, 'red', true); // Highlight the first node
      } else if (!this.secondNode) {
        this.secondNode = clickedNode;
        this.drawNode(clickedNode, 'red', true); // Highlight the second node
  
        // Check if the edge between the selected nodes already exists
        const existingEdge = this.edges.find(
          (edge) =>
            (edge.startNodeId === this.firstNode?.id && edge.endNodeId === this.secondNode?.id && edge.direction === 'UN_DIRECTIONAL' && this.direction === 'uni') ||
            (edge.startNodeId === this.secondNode?.id && edge.endNodeId === this.firstNode?.id && edge.direction === 'UN_DIRECTIONAL' && this.direction === 'uni') ||
            (edge.startNodeId === this.firstNode?.id && edge.endNodeId === this.secondNode?.id && edge.direction === 'BI_DIRECTIONAL' && this.direction === 'bi') ||
            (edge.startNodeId === this.secondNode?.id && edge.endNodeId === this.firstNode?.id && edge.direction === 'BI_DIRECTIONAL' && this.direction === 'bi')
        );
  
        // If the edge already exists in the same direction, show alert
        if (existingEdge) {
          alert(`The ${this.direction === 'uni' ? 'uni-directional' : 'bi-directional'} edge between these nodes already exists!`);
        } else {
          // If no existing edge, proceed to draw
          if (this.direction === 'uni') {
            let edge: Edge;
            edge = {
              edgeId: this.edgeCounter.toString(),
              sequenceId: this.edgeCounter,
              edgeDescription: '',
              released: true,
              startNodeId: this.firstNode.id,
              endNodeId: this.secondNode.id,
              maxSpeed: 0,
              maxHeight: 0,
              minHeight: 0,
              orientation: 0,
              orientationType: '',
              direction: 'UN_DIRECTIONAL',
              rotationAllowed: true,
              maxRotationSpeed: 0,
              length: 0,
              action: [],
            };
            this.edges.push(edge);
            this.drawEdge(this.firstNode.pos, this.secondNode.pos, 'uni', this.firstNode.id, this.secondNode.id);
          } else if (this.direction === 'bi') {
            let edge: Edge;
            edge = {
              edgeId: this.edgeCounter.toString(),
              sequenceId: this.edgeCounter,
              edgeDescription: '',
              released: true,
              startNodeId: this.firstNode.id,
              endNodeId: this.secondNode.id,
              maxSpeed: 0,
              maxHeight: 0,
              minHeight: 0,
              orientation: 0,
              orientationType: '',
              direction: 'BI_DIRECTIONAL',
              rotationAllowed: true,
              maxRotationSpeed: 0,
              length: 0,
              action: [],
            };
            this.edges.push(edge);
            this.drawEdge(this.firstNode.pos, this.secondNode.pos, 'bi', this.firstNode.id, this.secondNode.id);
          }
  
          this.edgeCounter++;
        }
  
        // Reset after drawing
        this.resetSelection();
      }
  
      if (this.selectedNode === clickedNode) {
        // If the same node is clicked again, deselect it
        this.deselectNode();
        console.log('Node deselected:', x, y);
      } else {
        // If a different node is clicked, deselect the previous one if any
        if (this.selectedNode) {
          this.deselectNode();
        }
        // Select the new node
        this.selectedNode = clickedNode;
        this.drawNode(clickedNode, 'red', true); // Highlight the selected node
        console.log('Node selected:', x, y);
  
        // Draw connections or perform any other actions
        if (this.lastSelectedNode) {
          this.drawConnections();
          this.resetSelection(); // Reset for the next connection
        }
      }
    }
  }   
  private drawEdge(
    startPos: { x: number; y: number },
    endPos: { x: number; y: number },
    direction: string,
    startNodeId: string,
    endNodeId: string
  ): void {
    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(startPos.x, canvas.height - startPos.y); // Start point (flip Y-axis)
      ctx.lineTo(endPos.x, canvas.height - endPos.y); // End point (flip Y-axis)
  
      // Change color based on direction
      if (direction === 'uni') {
        ctx.strokeStyle = 'black'; // Uni-directional in black
      } else if (direction === 'bi') {
        ctx.strokeStyle = 'green'; // Bi-directional in green
      }
      ctx.lineWidth = 2;
      ctx.stroke();  
      this.drawArrowhead(ctx, startPos, endPos, direction);
  
      if (direction === 'bi') {
        // Draw the reverse arrow for bi-directional
        this.drawArrowhead(ctx, endPos, startPos, direction);
      }
  
      // Draw edge ID in the middle of the line
      const midX = (startPos.x + endPos.x) / 2;
      const midY = (canvas.height - startPos.y + canvas.height - endPos.y) / 2;
  
      ctx.font = '12px Arial'; // Font size and type
      ctx.fillStyle = 'black'; // Text color
      ctx.textAlign = 'center'; // Center align text
      ctx.textBaseline = 'top'; // Position text below the edge
      ctx.fillText(`${startNodeId} to ${endNodeId}`, midX, midY + 5); // Draw edge ID text
    }
  }
  private drawArrowhead(
    ctx: CanvasRenderingContext2D,
    from: { x: number; y: number },
    to: { x: number; y: number },
    direction: string
  ): void {
    const headLength = 10; // Length of the arrowhead
    const offset = 5; // Distance to move the arrowhead away from the node
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
  
    // Calculate the offset position for the arrowhead
    const offsetX = offset * Math.cos(angle);
    const offsetY = offset * Math.sin(angle);
  
    // Adjust the end position of the arrowhead by the offset
    const adjustedToX = to.x - offsetX;
    const adjustedToY = to.y - offsetY;
  
    ctx.beginPath();
    ctx.moveTo(
      adjustedToX,
      this.overlayCanvas.nativeElement.height - adjustedToY
    );
    ctx.lineTo(
      adjustedToX - headLength * Math.cos(angle - Math.PI / 6),
      this.overlayCanvas.nativeElement.height -
        (adjustedToY - headLength * Math.sin(angle - Math.PI / 6))
    );
    ctx.lineTo(
      adjustedToX - headLength * Math.cos(angle + Math.PI / 6),
      this.overlayCanvas.nativeElement.height -
        (adjustedToY - headLength * Math.sin(angle + Math.PI / 6))
    );
    ctx.lineTo(
      adjustedToX,
      this.overlayCanvas.nativeElement.height - adjustedToY
    );
  
    // Change arrowhead color based on direction
    if (direction === 'uni') {
      ctx.fillStyle = 'black'; // Uni-directional arrowhead in black
    } else if (direction === 'bi') {
      ctx.fillStyle = 'green'; // Bi-directional arrowhead in green
    }
  
    ctx.fill();
  }
  updateEdge() {
    if (this.currentEdge) {
      this.edges = this.edges.map((edge) => {
        if (this.currentEdge.edgeId === edge.edgeId) {
          // Preserve color and direction
          edge = this.currentEdge;
          // return { ...edge, ...this.currentEdge };
        }
        return edge;
      });
      this.redrawCanvas();
    }
    console.log(this.edges);
    
  } 
  resetSelection(): void {
    this.firstNode = null;
    this.secondNode = null;
    this.direction = null;
  }
  private deselectNode(): void {
    if (this.selectedNode) {
      // Redraw the previously selected node as deselected (transparent or default color)
      this.drawNode(this.selectedNode, 'blue', false); // Using 'blue' for non-selected nodes
      this.selectedNode = null;
    }
  }
  private isNodeClicked(node: Node, mouseX: number, mouseY: number): boolean {
    const radius = 6; // Node radius
    const canvas = this.overlayCanvas.nativeElement;
    const transformedY = canvas.height - node.pos.y; // Flip the Y-axis for node.y

    const dx = mouseX - node.pos.x;
    const dy = mouseY - transformedY; // Use transformed Y-coordinate
    return dx * dx + dy * dy <= radius * radius;
  }
  private plotAsset(x: number, y: number, assetType: string): void {
    const ctx = this.overlayCanvas.nativeElement.getContext('2d');
    const image = this.assetImages[assetType];
    if (image && ctx) {
      const imageSize = 50; // Set image size
      ctx.drawImage(
        image,
        x - imageSize / 2,
        y - imageSize / 2,
        imageSize,
        imageSize
      );
    }

    this.assets = this.assets.map(asset =>{
      if(this.selectedAsset?.id === asset.id)
        asset.orientation = this.orientationAngle;
      return asset
    })

    this.overlayCanvas.nativeElement.addEventListener( 'mousemove', this.onMouseMove.bind(this) );
    this.overlayCanvas.nativeElement.addEventListener( 'mouseup', this.onMouseUp.bind(this) );
  }
  startZonePlotting(): void {
    this.toggleOptionsMenu();
    this.isZonePlottingEnabled = true;
    this.plottedPoints = []; // Reset previously plotted points
  }
  plotZonePoint(x: number, y: number): void {
    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw outer black stroke
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw inner violet circle
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
    } else {
      console.error('Failed to get canvas context');
    }
  }
  drawLayer(): void {
    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx && this.plottedPoints.length >= 3 && this.zoneType) {
      ctx.beginPath();
      ctx.moveTo(this.plottedPoints[0].x, this.plottedPoints[0].y);

      // Draw lines between points to form a polygon
      for (let i = 1; i < this.plottedPoints.length; i++) {
        ctx.lineTo(this.plottedPoints[i].x, this.plottedPoints[i].y);
      }

      ctx.closePath();

      // Set the fill color based on the selected zone type
      const zoneColor = this.zoneColors[this.zoneType];
      ctx.fillStyle = zoneColor;
      ctx.fill();
      this.plottedPoints = [];
    } else {
      console.error('Insufficient points or zone type not selected');
    }
  }
  private isZoneOverlapping(newZonePoints: any[]): boolean {
    for (const existingZone of this.zones) {
      if (this.isPolygonOverlap(existingZone.pos, newZonePoints)) {
        return true;
      }
    }
    return false;
  }
  private isPolygonOverlap(polygon1: any[], polygon2: any[]): boolean {
    const [minX1, minY1, maxX1, maxY1] = this.getBoundingBox(polygon1);
    const [minX2, minY2, maxX2, maxY2] = this.getBoundingBox(polygon2);

    return !(minX1 > maxX2 || maxX1 < minX2 || minY1 > maxY2 || maxY1 < minY2);
  }
  private getBoundingBox(polygon: any[]): number[] {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    for (const point of polygon) {
      if (point.x < minX) minX = point.x;
      if (point.y < minY) minY = point.y;
      if (point.x > maxX) maxX = point.x;
      if (point.y > maxY) maxY = point.y;
    }

    return [minX, minY, maxX, maxY];
  }
  onZoneTypeSelected(zoneType: ZoneType): void {
    this.zoneType = zoneType;

    if (this.isZoneOverlapping(this.plottedPoints)) {
      alert('Zone overlaps with an existing zone!');
      return; // Do not allow drawing
    }

    let zone: Zone;
    zone = {
      id: this.zoneCounter.toString(),
      pos: this.plottedPoints,
      type: this.zoneType,
    };
    this.zones.push(zone);
    this.zoneCounter++;

    this.isPopupVisible = false; // Hide the popup
    this.drawLayer(); // Draw the layer with the selected zone color
  }
  isRobotClicked(robo: Robo, x: number, y: number): boolean {
    const imageSize = 25;
    return (
      x >= robo.x - imageSize / 2 &&
      x <= robo.x + imageSize / 2 &&
      y >= robo.y - imageSize / 2 &&
      y <= robo.y + imageSize / 2
    );
  }
  onCancel(): void {
    // Clear the plotted points and reset the zone plotting state
    this.plottedPoints = [];
    this.isZonePlottingEnabled = false;
    this.isPopupVisible = false;
    this.firstPlottedPoint = null;

    // Redraw the canvas to remove the temporary zone points
    this.redrawCanvas();
  }
  removeRobots(): void {
    // Remove selected robots
    this.robos = this.robos.filter(
      (robo) => robo.roboDet.id !== this.selectedRobo?.roboDet.id
    );
    this.redrawCanvas();
  }
  showZoneTypePopup(): void {
    this.isPopupVisible = true;
  }
  openRobotPopup(): void {
    this.isRobotPopupVisible = true;
  }
  closeRobotPopup(): void {
    this.isRobotPopupVisible = false;
  }
  placeRobots(selectedRobots: any[]): void {
    if (!this.overlayCanvas) return;

    selectedRobots.forEach((robot) => {
      const x = 0 + this.roboInitOffset;
      const y = 100;

      if (this.robos.some((robo) => robo.roboDet.id === robot.id)) {
        alert('Robot already in map!');
        return;
      }

      const robo: Robo = { roboDet: robot, x: x, y: y };
      this.robos.push(robo);

      this.roboInitOffset += 60;
      this.plotRobo(x, y);
    });
  }
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (this.overlayCanvas && this.overlayCanvas.nativeElement) {
      const rect = this.overlayCanvas.nativeElement.getBoundingClientRect();
      const x = (event.clientX - rect.left) * (this.overlayCanvas.nativeElement.width / rect.width);
      const y = (event.clientY - rect.top) * (this.overlayCanvas.nativeElement.height / rect.height);

      if (this.isZonePlottingEnabled) {
        // Plot the point
        if (this.firstPlottedPoint) {
          let radius = 6;
          if (
            Math.abs(x - this.firstPlottedPoint.x) <= radius &&
            Math.abs(y - this.firstPlottedPoint.y) <= radius
          ) {
            if (this.plottedPoints.length < 3) {
              alert('should at least minimum 3 zone points to plot!');
              return;
            }
            this.isZonePlottingEnabled = false;
            this.showZoneTypePopup(); // Show zone type popup after completing the polygon
            this.firstPlottedPoint = null;
            return;
          }
        }

        this.plotZonePoint(x, y);
        // Add the point to the array of plotted points
        this.plottedPoints.push({ id: this.zonePosCounter, x, y });
        this.zonePosCounter++;
        // this.plottedPoints[0];
        if (this.firstPlottedPoint === null)
          this.firstPlottedPoint = { id: this.zonePosCounter, x, y };
        // If six points are plotted, form the layer (polygon)
        // if (this.plottedPoints.length >= this.maxZonePoints) {  //
      }

      if (this.selectedAssetType) {
        let asset: asset;
        asset = {
          id: this.assetCounter,
          x: x,
          y: y,
          type: this.selectedAssetType,
          orientation : 0,
          undockingDistance : 0,
          desc : ''
        };
        this.selectedAsset = asset;
        this.assets.push(asset);
        
        this.plotAsset(x, y, this.selectedAssetType);
        if(this.selectedAssetType === 'docking'){ 
          this.isDrawingLine = true; //..
          this.lineStartX = x;
          this.lineStartY = y;
        }
        this.selectedAssetType = null; // Reset after plotting
        this.assetCounter++;
        return;
      }
      // Check if an asset is clicked for dragging
      for (const asset of this.assets) {
        // assuming `this.assets` is an array holding your plotted assets
        if (this.isAssetClicked(asset, x, y)) {
          this.selectedAsset = asset;
          this.draggingAsset = true;
          break;
        }
      }
      for (const robo of this.robos) {
        if (this.isRobotClicked(robo, x, y)) {
          this.selectedRobo = robo;
          this.draggingRobo = true;
          this.redrawCanvas();

          // Clear any existing timeout
          if (this.deselectTimeout) {
            clearTimeout(this.deselectTimeout);
          }

          // Set a timeout to deselect the robot after the specified duration
          this.deselectTimeout = setTimeout(() => {
            this.selectedRobo = null;
            this.redrawCanvas(); // Redraw the canvas to remove the highlight
          }, this.highlightDuration);
          return;
        }
      }

      let nodeClicked = false;
      for (const node of this.nodes) {
        if (this.isNodeClicked(node, x, y)) {
          this.onNodeClick(node.pos.x, node.pos.y);
          nodeClicked = true;
          break;
        }
      }

      if (!nodeClicked && this.isPlottingEnabled) {
        if (this.plottingMode === 'single') {
          this.plotSingleNode(x, y);
        }
        if (this.plottingMode === 'multi') {
          this.plotMultiNode(x, y);
        }
      }
    }
  }
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const canvas = this.overlayCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);

    if (this.draggingAsset && this.selectedAsset) {
      // Update the position of the selected asset
      this.redrawCanvas(); // Clear the canvas
      this.plotAsset(x, y, this.selectedAsset.type); // Draw the asset at the new position
      // this.selectedAsset = { x, y, type: this.selectedAsset.type }; // Update position
      this.selectedAsset.x = x;
      this.selectedAsset.y = y;
    }

    if (this.isDrawingLine) {
      this.lineEndX = (event.clientX - rect.left) * (canvas.width / rect.width);
      this.lineEndY = (event.clientY - rect.top) * (canvas.height / rect.height);

      // Redraw the canvas to show the line preview
      this.redrawCanvas();
      if (this.lineStartX !== null && this.lineStartY !== null) {
        this.drawArrowLine(
          this.lineStartX,
          this.lineStartY,
          this.lineEndX,
          this.lineEndY
        );
      }
    }

    if (this.draggingRobo && this.selectedRobo) {
      this.redrawCanvas();
      this.plotRobo(x, y);

      this.selectedRobo.x = x;
      this.selectedRobo.y = y;
    }
  }
  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    const canvas = this.overlayCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);

    if (
      this.isDrawingLine &&
      this.lineStartX !== null &&
      this.lineStartY !== null
    ) {
      this.isDrawingLine = false;
      const transformedY = canvas.height - y; // Flip the Y-axis
      // Finalize the line drawing
      this.drawArrowLine(
        this.lineStartX!,
        this.lineStartY!,
        this.lineEndX!,
        this.lineEndY!
      );
      setTimeout(() => {
        // Clear the canvas section where the arrow was drawn
        this.redrawCanvas(); // Ensure this redraws all existing elements except for the arrow
      }, 1500);
      // Reset the start and end positions
      this.lineStartX = this.lineStartY = this.lineEndX = this.lineEndY = null;

      // Remove the mousemove and mouseup event listeners
      this.overlayCanvas.nativeElement.removeEventListener(
        'mousemove',
        this.onMouseMove.bind(this)
      );
      this.overlayCanvas.nativeElement.removeEventListener(
        'mouseup',
        this.onMouseUp.bind(this)
      );
    }

    if (this.draggingAsset && this.selectedAsset) {
      // Finalize asset position
      this.draggingAsset = false;
      // const canvas = this.overlayCanvas.nativeElement;
      // const rect = canvas.getBoundingClientRect();
      // const x = (event.clientX - rect.left) * (canvas.width / rect.width);
      // const y = (event.clientY - rect.top) * (canvas.height / rect.height);
      if (this.selectedAssetType) {
        // let asset : asset;
        this.assets = this.assets.map((asset) => {
          if (this.selectedAsset?.id === asset.id) {
            asset.x = x;
            asset.y = y;
            asset.type = this.selectedAsset.type;
            return asset;
          }
          return asset;
        });

        this.plotAsset(x, y, this.selectedAssetType);
        this.selectedAssetType = null; // Reset after plotting
        this.updateAssetPosition(this.selectedAsset.id, x, y);
        this.selectedAsset = null;
        return;
      }
      // Update asset position
      this.updateAssetPosition(this.selectedAsset.id, x, y);
      this.selectedAsset = null;
    }

    if (this.draggingRobo && this.selectedRobo) {
      this.robos = this.robos.map((robo) => {
        if (robo.roboDet.id === this.selectedRobo?.roboDet.id) {
          robo.x = x;
          robo.y = y;
          return robo;
        }
        return robo;
      });
      this.draggingRobo = false;
      // this.updateRoboPosition(this.selectedRobo.roboDet.id, x, y);
      // this.selectedRobo = null;
    }
  }
  private isAssetClicked(
    asset: { x: number; y: number; type: string },
    mouseX: number,
    mouseY: number
  ): boolean {
    const radius = 25; // Adjust radius to match asset size
    const dx = mouseX - asset.x;
    const dy = mouseY - asset.y;
    return dx * dx + dy * dy <= radius * radius;
  }
  private updateRoboPosition(id: number, x: number, y: number): void {
    const robo = this.robos.find((robo) => robo.roboDet.id === id);
    if (robo) {
      robo.x = x;
      robo.y = y;
      this.redrawCanvas(); // Redraw canvas to show the updated position
    }
  }
  private updateAssetPosition(id: number, x: number, y: number): void {
    // Implement logic to update asset position in your data structure
    // Example: Find and update asset in this.assets
    const asset = this.assets.find((asset) => asset.id === id);
    if (asset) {
      asset.x = x;
      asset.y = y;
      this.redrawCanvas(); // Redraw canvas to show the updated position
    }
  }
  private redrawCanvas(): void {
    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      this.cdRef.detectChanges;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Draw nodes
      this.nodes.forEach((node) => this.drawNode(node, 'blue', false));
  
      // Draw edges using the stored edge color and type
      this.edges.forEach((edge) => {
        const fromNode = this.nodes.find(
          (node) => node.id === edge.startNodeId
        );
        const toNode = this.nodes.find((node) => node.id === edge.endNodeId);
  
        if (fromNode && toNode) {
          // Pass the stored direction (either 'uni' or 'bi') to the drawEdge function
          this.drawEdge(
            fromNode.pos,
            toNode.pos,
            edge.direction === 'UN_DIRECTIONAL' ? 'uni' : 'bi', // Ensure correct direction is passed
            fromNode.id,
            toNode.id
          );
        }
      });
  
      // Draw assets, zones, and robots
      this.assets.forEach((asset) => this.plotAsset(asset.x, asset.y, asset.type));
      this.zones.forEach((zone) => {
        this.plottedPoints = zone.pos;
        this.zoneType = zone.type;
        this.drawLayer();
        this.plottedPoints = [];
      });
      this.robos.forEach((robo) => this.plotRobo(robo.x, robo.y, this.selectedRobo === robo));
    }
  }
  drawConnections(): void {
    if (!this.selectedNode || !this.lastSelectedNode) {
      console.log('Not enough nodes or mode is not set');
      return; // Ensure both nodes and a mode are selected
    }

    const fromId = this.getNodeId(this.lastSelectedNode);
    const toId = this.getNodeId({
      x: this.selectedNode.pos.x,
      y: this.selectedNode.pos.y,
    });

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
    ctx.lineTo(this.selectedNode.pos.x, this.selectedNode.pos.y);
    ctx.stroke();
  }
  private getNodeId(node: { x: number; y: number }): number {
    const foundNode = this.nodes.find(
      (n) => n.pos.x === node.x && n.pos.y === node.y
    );
    return foundNode ? parseInt(foundNode.id) : -1; // Return -1 if the node is not found
  }
  toggleOptionsMenu(): void {
    this.isOptionsMenuVisible = !this.isOptionsMenuVisible;
  }
  hideCalibrationLayer(): void {
    this.isOptionsMenuVisible = false;
  }
  isPointOnEdge(edge: Edge, x: number, y: number): boolean {
    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return false;
  
    const startNode = this.nodes.find(node => node.id === edge.startNodeId);
    const endNode = this.nodes.find(node => node.id === edge.endNodeId);
    
    if (!startNode || !endNode) return false;
  
    const startPos = { x: startNode.pos.x, y: canvas.height - startNode.pos.y };
    const endPos = { x: endNode.pos.x, y: canvas.height - endNode.pos.y };
    
    // Calculate distance from point (x, y) to the line segment
    const lineLength = Math.sqrt(Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2));
    const projection = ((x - startPos.x) * (endPos.x - startPos.x) + (y - startPos.y) * (endPos.y - startPos.y)) / Math.pow(lineLength, 2);
    
    const closestPoint = {
      x: startPos.x + projection * (endPos.x - startPos.x),
      y: startPos.y + projection * (endPos.y - startPos.y)
    };
    
    const distance = Math.sqrt(Math.pow(x - closestPoint.x, 2) + Math.pow(y - closestPoint.y, 2));
    
    // Define a threshold distance for "close enough" to the line segment
    const threshold = 10; // Adjust this threshold as needed
  
    return distance < threshold;
  }

  submitEdgeDetails(): void {
    // Handle form submission, e.g., save edge details
    this.showPopup = false;
  }

  hidePopup(): void {
    this.showPopup = false;
  }
  // Method to delete the edge
  deleteEdge(): void {
    if (this.currentEdge) {
      // Remove the edge from the edges array
      this.edges = this.edges.filter(edge => edge.edgeId !== this.currentEdge?.edgeId);

      // Redraw the canvas
      this.redrawCanvas();

      // Hide the popup
      this.hidePopup();
    }
  }
  
}
