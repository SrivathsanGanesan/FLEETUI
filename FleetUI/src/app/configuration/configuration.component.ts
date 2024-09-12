import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  Input,
  viewChild,
} from '@angular/core';
import { ExportService } from '../export.service';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { RobotParametersPopupComponent } from '../robot-parameters-popup/robot-parameters-popup.component';
import { environment } from '../../environments/environment.development';
import { ProjectService } from '../services/project.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { EnvmapComponent } from '../envmap/envmap.component';

interface Poll {
  ip: string;
  mac: string;
  host: string;
  ping: string;
  Status: string;
}
@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements AfterViewInit {
  // @ViewChild(EnvmapComponent) envmapComponent!: EnvmapComponent; 
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
  selectedMap: any = null;
  mapData: any = null;

  searchTerm: string = '';
  filteredEnvData: any[] = [];
  filteredRobotData: any[] = [];

  isScanning = false;
  EnvData: any[] = []; // map details..

  currEditMap: boolean = false;
  currEditMapDet : any | null = null;

  robotData: any[] = [
    { column1: 'Robot 1', column2: '192.168.XX.XX' },
    { column1: 'Robot 2', column2: '192.168.XX.XX' },
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private projectService: ProjectService,
    public dialog: MatDialog // Inject MatDialog
  ) {
    this.filteredEnvData = this.EnvData;
    this.filteredRobotData = this.robotData;
  }

  ngOnInit() {
    let currMapData = this.projectService.getMapData();
    if (currMapData) this.selectedMap = currMapData;

    this.mapData = this.projectService.getSelectedProject(); // _id
    fetch(
      `http://${environment.API_URL}:${environment.PORT}/fleet-project/${this.mapData._id}`,
      { credentials: 'include' }
    )
      .then((response) => {
        if (!response.ok) throw new Error(`Error code of ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const { sites } = data.project;
        this.EnvData = sites
          .flatMap((sites: any) => {
            return sites.maps.map((map: any) => {
              let date = new Date(map?.createdAt);
              let createdAt = date.toLocaleString('en-IN', {
                month: 'short',
                year: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              });

              return {
                id: map.mapId,
                mapName: map.mapName,
                siteName: sites.siteName,
                date: createdAt,
                createdAt: map.createdAt, // for sorting..
              };
            });
          })
          .filter((item: any) => item !== null); // just to filter out the null from the EnvData array!..
        this.EnvData.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.filteredEnvData = this.EnvData;
        this.cdRef.detectChanges();
        if (!this.projectService.getIsMapSet())
          this.selectedMap = this.EnvData[0];
      })
      .catch((error) => {
        console.log(error);
      });

    if (!this.EnvData.length) return;
    // console.log(this.EnvData);

    fetch(
      `http://${environment.API_URL}:${environment.PORT}/dashboard/maps/${this.EnvData[0]?.mapName}`
    )
      .then((response) => {
        if (!response.ok) {
          console.error('Error while fetching map data : ', response.status);
          throw new Error('Error while fetching map data');
        }
        return response.json();
      })
      .then((data) => {
        this.projectService.setMapData({
          ...this.EnvData[0],
          imgUrl: data.map.imgUrl,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    // this.filteredEnvData = this.EnvData;
    this.filteredRobotData = this.robotData;
    this.searchTerm = '';
    this.searchTermChanged();
  }

  async selectMap(map: any) {
    if (this.selectedMap?.id === map.id) {
      // Deselect if the same map is clicked again
      this.projectService.clearMapData();
      this.projectService.setIsMapSet(false);
      if (!this.EnvData.length) return;
      this.selectedMap = this.EnvData[0];
      const response = await fetch(
        `http://${environment.API_URL}:${environment.PORT}/dashboard/maps/${this.EnvData[0]?.mapName}`
      );
      if (!response.ok)
        console.error('Error while fetching map data : ', response.status);
      let data = await response.json();
      let { map } = data;
      this.ngOnInit();

      if (this.projectService.getIsMapSet()) return;
      this.projectService.setIsMapSet(true);
      return;
    }
    // Select a new map
    this.selectedMap = map;
    if (!this.EnvData.length) return;
    this.projectService.clearMapData();
    const response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/dashboard/maps/${map?.mapName}`
    );
    if (!response.ok)
      console.error('Error while fetching map data : ', response.status);
    let data = await response.json();

    this.projectService.setMapData({
      ...map,
      imgUrl: data.map.imgUrl,
    });

    if (this.projectService.getIsMapSet()) return;
    this.projectService.setIsMapSet(true);
  }

  isButtonDisabled(item: any): boolean {
    if (
      this.selectedMap?.id === item.id &&
      this.selectedMap?.mapName === item.mapName
    )
      return false;
    return true;
    // return this.selectedMap && this.selectedMap !== item;
  }

  ngOnChanges() {
    this.filterData();
  }

  filterData() {
    const term = this.searchTerm.toLowerCase();

    if (this.currentTable === 'Environment') {
      this.filteredEnvData = this.EnvData.filter((item) => {
        const date = new Date(item.date);
        const withinDateRange =
          (!this.startDate || date >= this.startDate) &&
          (!this.endDate || date <= this.endDate);

        return (
          (item.mapName.toLowerCase().includes(term) ||
            item.siteName.toLowerCase().includes(term) ||
            item.date.toLowerCase().includes(term)) &&
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

  selectedrobotData = [
    { column1: '192.168.XX.XX', column2: ' ' },
    { column1: '192.168.XX.XX', column2: ' ' },
  ];
  ipScanData: Poll[] = [];

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
  eventSource!: EventSource;
  startIP: string = '0.0.0.0';
  EndIP: string = '0.0.0.0';

  startScanning() {
    
    this.ipScanData = [];
    this.startIP = (
      document.getElementById('ipRangeFrom') as HTMLInputElement
    ).value;
    this.EndIP = (
      document.getElementById('ipRangeTo') as HTMLInputElement
    ).value;
    if (this.startIP === '' || this.EndIP === '') {
      alert('Enter valid Ip');
      return;
    }
    const ipv4Regex =
      /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipv4Regex.test(this.startIP) || !ipv4Regex.test(this.EndIP)) {
      alert('not valid IP. Try again');
      return;
    }

    const URL = `http://${environment.API_URL}:${environment.PORT}/fleet-config/scan-ip/${this.startIP}-${this.EndIP}`;

    if (this.eventSource) this.eventSource.close();

    this.eventSource = new EventSource(URL);
    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        let poll: Poll = {
          ip: data.ip_address,
          mac:
            data.mac_address === '' || data.mac_address === 'undefined'
              ? '00:00:00:00:00:00'
              : data.mac_address,
          host: data.host,
          ping: data.time,
          // hostname:data.hostname,
          Status: data.status,
        };
        // console.log(poll);

        if (poll.Status === 'online')
          this.ipScanData = [...this.ipScanData, poll];
        this.cdRef.detectChanges();
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      this.eventSource.close();
    };
    this.isScanning = true;
  }
  stopScanning() {
    this.isScanning = false;
    this.eventSource.close();
    return;
  }

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
      // mapName: this.mapName,
      // siteName: this.siteName,
      date: formatDate(new Date(), 'MMM d, yyyy. HH:mm:ss', 'en-US'),
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
  onCurrEditMapChange(currEditMap : boolean){
    this.currEditMap = currEditMap;
  }
  editItem(item: any) {
    fetch(`http://${environment.API_URL}:${environment.PORT}/dashboard/maps/${item.mapName}`, {
      method:'GET',
      credentials:'include'
    }).then((response) =>{
      return response.json()
    }).then((data)=>{
      if(!data.map){
        alert('Seems map not exist');
        return;
      }
      if(data.error) {
        console.log('Error while fetching map : ', data.error);
        return;
      }
      const { map }= data;
      this.currEditMapDet = {
        mapName : map.mapName,
        siteName : item.siteName,
        ratio : map.mpp,
        imgUrl : `http://${map.imgUrl}`,
        nodes : map.nodes,
        edges : map.edges,
        assets : map.stations,
        zones : map.zones
      }
      this.currEditMap = true;
      this.showImageUploadPopup = true;
      // console.log(map.mapName, item.siteName, map.mpp, map.imgUrl);
    }) .catch((err)=>{
      console.log(err);
    })
  }

  async deleteMap(map: any): Promise<boolean> {
    try {
      const response = await fetch(
        `http://${environment.API_URL}:${environment.PORT}/dashboard/maps/${map.mapName}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            projectName: this.mapData?.projectName,
            siteName: map.siteName,
          }),
        }
      );
      // if (!response.ok)
      //   console.error('Error while fetching map data : ', response.status);
      let data = await response.json();
      if (data.isDeleted) return true;
      if (data.isMapExist === false) {
        alert(data.msg);
        return false;
      }
      return false;
    } catch (error) {
      console.log('Err occured : ', error);
      return false;
    }
  }

  deleteItem(item: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    let isDeleted = false;

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) isDeleted = await this.deleteMap(item);
      if (isDeleted) {
        this.projectService.setIsMapSet(false);
        this.projectService.clearMapData();
        this.ngOnInit();
        // Assuming `currentTable` determines which data array to modify
        if (this.currentTable === 'Environment') {
          this.EnvData = this.EnvData.filter((i) => i !== item);
          this.filteredEnvData = this.EnvData;
          this.cdRef.detectChanges();
        } else if (this.currentTable === 'robot') {
          this.filteredRobotData = this.filteredRobotData.filter(
            (i) => i !== item
          );
        }
        console.log('Item deleted:', item);
      }
    });
  }

  addItem(item: any) {
    console.log('Add item:', item);
  }

  blockItem(item: any) {
    console.log('Block item:', item);
  }
}
