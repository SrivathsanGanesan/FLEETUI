import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  ViewEncapsulation,
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
import { MessageService } from 'primeng/api';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormBuilder } from '@angular/forms';
import { v4 as uuid } from 'uuid';

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
  styleUrls: ['./configuration.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom, // Use shadow DOM to isolate styles
})
export class ConfigurationComponent implements AfterViewInit {
  @ViewChild(EnvmapComponent) envmapComponent!: EnvmapComponent;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('uploadedCanvas', { static: false })
  uploadedCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('overlayLayer', { static: false }) overlayLayer!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
  isSimulating: boolean = false;
  isPagination: boolean = false;
  searchTerm: string = '';
  filteredEnvData: any[] = [];
  filteredipData: any[] = [];
  filteredRobotData: any[] = [];

  addForm: any;
  isPopupOpen: boolean = false;
  isScanning = false;
  EnvData: any[] = []; // map details..
  currentRoboDet: any | null = null;
  isRoboInEdit: boolean = false;
  currEditRobo: any | null = null;

  currEditMap: boolean = false;
  currEditMapDet: any | null = null;
  agvKinematicsOptions: any[] = [
    { name: 'DIFF', value: 'DIFF' },
    { name: 'OMNI', value: 'OMNI' },
    { name: 'THREEWHEEL', value: 'THREEWHEEL' },
  ];
  agvClassOptions: any[] = [
    { name: 'NOT_SET', value: 'NOT_SET' },
    { name: 'FORKLIFT', value: 'FORKLIFT' },
    { name: 'CONVEYOR', value: 'CONVEYOR' },
    { name: 'TUGGER', value: 'TUGGER' },
    { name: 'CARRIER', value: 'CARRIER' },
  ];
  localizationTypes: any[] = [
    { name: 'NATURAL', value: 'NATURAL' },
    { name: 'REFLECTOR', value: 'REFLECTOR' },
    { name: 'RFID', value: 'RFID' },
    { name: 'DMC', value: 'DMC' },
    { name: 'SPOT', value: 'SPOT' },
    { name: 'GRID', value: 'GRID' },
  ];
  navigationTypes: any[] = [
    { name: 'PHYSICAL_LINE_GUIDED', value: 'PHYSICAL_LINE_GUIDED' },
    { name: 'VIRTUAL_LINE_GUIDED', value: 'VIRTUAL_LINE_GUIDED' },
    { name: 'AUTONOMOUS', value: 'AUTONOMOUS' },
  ];

  robotData: any[] = [];
  paginatedData: any[] = [];
  paginatedData1: any[] = [];
  paginatedData2: any[] = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private projectService: ProjectService,
    public dialog: MatDialog, // Inject MatDialog
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.filteredEnvData = [...this.EnvData];
    // this.filteredRobotData = [...this.robotData];
    // this.filteredRobotData = this.robotData;
    this.addForm = this.fb.group({
      robotName: '',
      manufacturer: '',
      serialNumber: '',
      typeSpecification: {
        seriesName: '',
        seriesDescription: '',
        agvKinematic: '',
        agvClass: undefined as any | undefined,
        maxLoadMass: 0,
        localizationTypes: '',
        navigationTypes: '',
      },
      protocolLimits: {
        maxStringLens: '',
        maxArrayLens: '',
        timing: '',
      },
      protocolFeatures: {
        optionalParameters: '',
        actionScopes: '',
        actionParameters: '',
        resultDescription: '',
      },
      agvGeometry: {
        wheelDefinitions: '',
        envelopes2d: '',
        envelopes3d: '',
      },
      loadSpecification: {
        loadPositions: '',
        loadSets: '',
      },
      localizationParameters: {
        type: '',
        description: '',
      },
    });
  }

  ngOnInit() {
    this.loadData();
    this.setPaginatedData();
    this.selectFirstMapIfNoneSelected();
    this.filteredEnvData = [...this.EnvData];
    this.filteredRobotData = [...this.robotData];
    this.cdRef.detectChanges();
    const today = new Date();
    const pastFiveYears = new Date();
    pastFiveYears.setFullYear(today.getFullYear() - 5);

    this.minDate = this.formatDate(pastFiveYears);
    this.maxDate = this.formatDate(today);
    let currMapData = this.projectService.getMapData();
    if (currMapData) {
      this.selectedMap = currMapData;
      this.setPaginatedData();
    }

    this.mapData = this.projectService.getSelectedProject(); // _id
    if (!this.mapData) return;
    fetch(
      `http://${environment.API_URL}:${environment.PORT}/fleet-project/${this.mapData._id}`,
      { credentials: 'include' }
    )
      .then((response) => {
        if (!response.ok) throw new Error(`Error code of ${response.status}`);
        return response.json();
      })
      .then(async (data) => {
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
        this.filteredEnvData = [...this.EnvData];
        // this.EnvData = this.filteredEnvData;
        this.setPaginatedData();
        this.cdRef.detectChanges();
        if (!this.projectService.getIsMapSet()) {
          this.selectedMap = this.EnvData[0];
          let imgUrl = '';
          if (this.EnvData[0]) {
            imgUrl = await this.getMapImgUrl(this.selectedMap);
            this.projectService.setMapData({
              ...this.EnvData[0],
              imgUrl: imgUrl,
            });
            this.projectService.setIsMapSet(true);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });

    this.fetchRobos(); // fetch all robots..

    if (!this.EnvData.length) return;

    // fetch(
    //   `http://${environment.API_URL}:${environment.PORT}/dashboard/maps/${this.EnvData[0]?.mapName}`
    // )
    //   .then((response) => {
    //     if (!response.ok) {
    //       console.error('Error while fetching map data : ', response.status);
    //       throw new Error('Error while fetching map data');
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     if (!this.projectService.getMapData())
    //       // yet to remove..
    //       this.projectService.setMapData({
    //         ...this.EnvData[0],
    //         imgUrl: data.map.imgUrl,
    //       });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    // this.filteredEnvData = this.EnvData;
    // this.setPaginatedData();
    this.searchTerm = '';
    this.searchTermChanged();
  }

  reloadTable() {
    this.loadData(); // Ensure data is reloaded properly
    this.setPaginatedData(); // Ensure the paginated data is set correctly after loading
    this.filterData(); // Optional if you are applying filters
    // this.resetFilters();
  }

  onChanges() {
    this.loadData();
    this.reloadTable();
    this.filterData();
    // this.setPaginatedData();
    console.log('data added');
  }

  onPopupSave() {
    this.resetFilters();
  }

  // Simulation
  async startSimulation() {
    if (!this.selectedMap) return;
    try {
      this.selectedRobots = this.paginatedData1.filter(
        (item) => item.isSimMode
      );

      if (!this.selectedRobots.length) {
        alert('no robos to sim');
        return;
      }

      // customize your filter here..
      let simRobots = this.selectedRobots.map((robo) => {
        return {
          ipAdd: robo.ipAdd,
          amrId: robo.amrId,
          uuid: robo.uuid,
          roboName: robo.roboName,
        };
      });
      await this.updateSimInMap(simRobots);

      this.paginatedData1.forEach(async (robo: any) => {
        let isSim = simRobots.some(
          (simRobo: any) => simRobo.roboName === robo.roboName
        );
        await this.updateSimInRobo(robo.roboName, isSim);
      });

      this.isSimulating = true;
      alert('Robos in sim mode!');
    } catch (error) {
      console.log('Error while simulating : ', error);
    }
  }

  async updateSimInMap(simRobots: any) {
    let editedMap = {
      simMode: simRobots,
    };
    let response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/dashboard/maps/update-map/${this.selectedMap.mapName}`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedMap),
      }
    );
    let data = await response.json();
    // console.log(data);
  }

  async updateSimInRobo(roboName: any, isSim: boolean) {
    let response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/robo-configuration/${roboName}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roboName: null,
          isSimMode: isSim, // here it is..
        }),
      }
    );

    let data = await response.json();
    // console.log(data);
  }

  async fetchRobos() {
    let mapData = this.projectService.getMapData();
    // this.filteredRobotData = this.mapData;
    if (!mapData) return;
    try {
      let response = await fetch(
        `http://${environment.API_URL}:${environment.PORT}/robo-configuration/get-robos/${mapData.id}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      if (response.status == 422) {
        console.log('Invalid map id, which request to fetch robots');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid map id, which request to fetch robots',
          life: 4000,
        });
        return;
      }
      let data = await response.json();

      // console.log(data);
      // this.filteredRobotData = data.populatedRobos;
      // this.messageService.add({
      //   severity: 'success',
      //   summary: 'Success',
      //   detail: 'Robots Fetched Successfully',
      //   life: 4000,
      // });

      if (data.error) return;
      if (data.populatedRobos) this.robotData = data.populatedRobos;
      this.filteredRobotData = this.robotData;
      this.setPaginatedData();
      // console.log(this.filteredRobotData)
      // this.filteredRobotData = data.populatedRobos;
    } catch (error) {
      console.log(error);
    }
  }

  // edit robo..
  editRobo(robo: any) {
    // console.log(robo);
    this.formData = robo.grossInfo;
    this.isPopupOpen = !this.isPopupOpen;
    this.isRoboInEdit = !this.isRoboInEdit;
    this.currEditRobo = robo;
    // this.newItem = { ...item }; // Initialize with the clicked item's data
    // this.cdRef.detectChanges();
  }

  async updateRobo() {
    if (!this.currEditRobo.roboName) {
      alert('seems robo not selected');
      return;
    }
    let response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/robo-configuration/${this.currEditRobo.roboName}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roboName:
            this.formData.robotName === this.currEditRobo.roboName
              ? null
              : this.formData.robotName,
          grossInfo: this.formData,
        }),
      }
    );

    let data = await response.json();
    console.log(data);
    if (data.roboExists === true) {
      alert('robo with this name already exists!');
      // return;
    } else if (data.updatedData) {
      // alert('robo updated');
      this.messageService.add({
        severity: 'success',
        summary: 'Updated',
        detail: 'Robo Details Udated Successfully',
        life: 4000,
      });
      // return;
    }
    this.closeroboPopup();
    this.ngOnInit();
  }

  deleteRobo(robo: any) {
    let project = this.projectService.getSelectedProject();
    let map = this.projectService.getMapData();
    let roboInfo = {
      roboId: robo._id,
      projectName: project.projectName,
      mapName: map.mapName,
    };

    fetch(
      `http://${environment.API_URL}:${environment.PORT}/robo-configuration`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roboInfo),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.isRoboExists) {
          this.fetchRobos();
          // this.loadData();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Robot deleted successfully!',
          });
          this.loadData();
          this.reloadTable();
          this.setPaginatedData();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete the robot.',
          });
        }
      })
      .catch((error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while deleting the robot.',
        });
      });
    this.loadData();
    this.reloadTable();
    this.setPaginatedData();
  }

  trackByTaskId(index: number, item: any): number {
    return item.taskId; // or any unique identifier like taskId
  }

  // setPaginatedData() {
  //   if (this.currentTable === 'Environment') {
  //     // Step 1: Ensure that data is loaded and available
  //     if (!this.EnvData || this.EnvData.length === 0) {
  //       return; // Prevent setting paginated data if no data is available
  //     }

  //     // Step 2: Handle small datasets (<= 5 items)
  //     if (this.filteredEnvData.length <= 5) {
  //       this.paginatedData = [...this.filteredEnvData]; // Show all data without pagination
  //     } else if (this.paginator?.pageIndex !== undefined && this.paginator?.pageSize !== undefined) {
  //       // Step 3: Handle larger datasets (use pagination)
  //       const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
  //       this.paginatedData = this.filteredEnvData.slice(startIndex, startIndex + this.paginator.pageSize);
  //     }
  //   } else if (this.currentTable === 'robot') {
  //     // Same logic for the robot table
  //     if (!this.filteredRobotData || this.filteredRobotData.length === 0) {
  //       return;
  //     }

  //     if (this.filteredRobotData.length <= 5) {
  //       this.paginatedData1 = this.filteredRobotData;
  //     } else if (this.paginator?.pageIndex !== undefined && this.paginator?.pageSize !== undefined) {
  //       const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
  //       this.paginatedData1 = this.filteredRobotData.slice(startIndex, startIndex + this.paginator.pageSize);
  //     }
  //   }
  // }

  setPaginatedData() {
    if (this.currentTable === 'Environment') {
      const pageSize = this.paginator?.pageSize || 5; // Default pageSize to 5 if paginator is not yet available
      const pageIndex = this.paginator?.pageIndex || 0; // Default pageIndex to 0 (first page)

      // Paginate the data based on current page and page size
      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;

      this.paginatedData = this.filteredEnvData.slice(startIndex, endIndex);
      // this.paginatedData1 = this.filteredRobotData.slice(startIndex,endIndex);
      // console.log(this.filteredEnvData);
      // console.log(this.filteredRobotData);

      // Optionally, ensure that the paginator reflects the right page size and length
      if (this.paginator) {
        this.paginator.length = this.filteredEnvData.length;
        // this.paginator.length  = this.filteredRobotData.length;
        // console.log(this.filteredEnvData);
        // console.log(this.filteredRobotData);
      }
    } else if (this.currentTable === 'robot') {
      const pageSize = this.paginator?.pageSize || 5; // Default pageSize to 5 if paginator is not yet available
      const pageIndex = this.paginator?.pageIndex || 0; // Default pageIndex to 0 (first page)

      // Paginate the data based on current page and page size
      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;

      // this.paginatedData = this.filteredEnvData.slice(startIndex, endIndex);
      this.paginatedData1 = this.filteredRobotData.slice(startIndex, endIndex);
      // console.log(this.filteredEnvData);
      // console.log(this.filteredRobotData);

      // Optionally, ensure that the paginator reflects the right page size and length
      if (this.paginator) {
        // this.paginator.length = this.filteredEnvData.length;

        this.paginator.length = this.filteredRobotData.length;
        // console.log(this.filteredEnvData);
        // console.log(this.filteredRobotData);
      }
    }
  }

  // Ensure pagination is triggered on page change
  onPageChange(event: PageEvent) {
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.pageSize = event.pageSize;
    this.setPaginatedData(); // Update paginated data on page change
  }

  //Commit Changed
  // Search method
  onSearch(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value.toLowerCase();

    if (!inputValue) {
      this.filteredEnvData = this.EnvData;
      this.filteredRobotData = this.robotData;
    } else {
      this.filteredEnvData = this.EnvData.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(inputValue)
        )
      );
      this.filteredRobotData = this.robotData.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(inputValue)
        )
      );
    }

    // Reset the paginator after filtering
    if (this.paginator) {
      this.paginator.firstPage();
    }

    this.setPaginatedData(); // Update paginated data after filtering
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
    await this.loadMapData(map);

    // Store the selected map in localStorage or service
    if (this.selectedMap) {
      localStorage.setItem('selectedMapId', this.selectedMap.id);
      this.messageService.add({
        severity: 'success',
        summary: 'Map Selected',
        detail: `Successfully loaded map: ${map.mapName}`,
      });
    } else {
      localStorage.removeItem('selectedMapId');
    }
  }

  private async loadMapData(map: any) {
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
  // This method can be called when the component is initialized or when a new map is created
  private selectFirstMapIfNoneSelected() {
    if (!this.selectedMap && this.EnvData.length > 0) {
      this.selectMap(this.EnvData[0]);
    }
  }
  //   async selectMap(map: any) {
  //     if (this.selectedMap?.id === map.id) {
  //         // Deselect if the same map is clicked again
  //         this.projectService.clearMapData();
  //         this.projectService.setIsMapSet(false);
  //         if (!this.EnvData.length) return;

  //         // Automatically select the first item after deselection
  //         this.selectedMap = this.EnvData[0];
  //         const response = await fetch(
  //           `http://${environment.API_URL}:${environment.PORT}/dashboard/maps/${this.EnvData[0]?.mapName}`
  //         );
  //         if (!response.ok)
  //             console.error('Error while fetching map data : ', response.status);

  //         let data = await response.json();
  //         this.projectService.setMapData({
  //             ...this.EnvData[0],
  //             imgUrl: data.map.imgUrl,
  //         });

  //         this.projectService.setIsMapSet(true);
  //         return;
  //     }

  //     // Select a new map
  //     this.selectedMap = map;
  //     if (!this.EnvData.length) return;
  //     this.projectService.clearMapData();
  //     const response = await fetch(
  //       `http://${environment.API_URL}:${environment.PORT}/dashboard/maps/${map?.mapName}`
  //     );
  //     if (!response.ok)
  //         console.error('Error while fetching map data : ', response.status);

  //     let data = await response.json();
  //     this.projectService.setMapData({
  //         ...map,
  //         imgUrl: data.map.imgUrl,
  //     });

  //     this.projectService.setIsMapSet(true);
  // }

  // // This method can be called when the component is initialized or when a new map is created
  // private selectFirstMapIfNoneSelected() {
  //     if (!this.selectedMap && this.EnvData.length > 0) {
  //         this.selectMap(this.EnvData[0]);
  //     }
  // }

  // // Call this method in ngOnInit to ensure the first map is selected when the component is initialized
  // // ngOnInit() {
  // //     this.selectFirstMapIfNoneSelected();
  // //     // Other initialization logic
  // // }

  async getMapImgUrl(map: any): Promise<any> {
    const response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/dashboard/maps/${map?.mapName}`
    );
    if (!response.ok)
      console.error('Error while fetching map data : ', response.status);
    let data = await response.json();
    if (!data.error) return data.map.imgUrl;
  }

  isButtonDisabled(item: any): boolean {
    return this.selectedMap?.id === item.id;
  }

  ngOnChanges() {
    this.filterData();
  }

  isTypeSpecificationFormVisible = false;
  isProtocolLimitsFormVisible = false;
  isProtocolFeaturesFormVisible = false;
  isAGVGeometryFormVisible = false;
  isLoadSpecificationFormVisible = false;
  isLocalizationParametersFormVisible = false;

  // toggleTypeSpecificationForm($event:any) {
  //   // this.resetFormVisibility();
  //   this.isTypeSpecificationFormVisible = !this.isTypeSpecificationFormVisible;
  // }

  // toggleProtocolLimitsForm($event:any) {
  //   // this.resetFormVisibility();
  //   this.isProtocolLimitsFormVisible = !this.isProtocolLimitsFormVisible;
  // }

  // toggleProtocolFeaturesForm($event:any) {
  //   // this.resetFormVisibility();
  //   this.isProtocolFeaturesFormVisible = !this.isProtocolFeaturesFormVisible;
  // }

  // toggleAGVGeometryForm($event:any) {
  //   // this.resetFormVisibility();
  //   this.isAGVGeometryFormVisible = !this.isAGVGeometryFormVisible;
  // }

  // toggleLoadSpecificationForm($event:any) {
  //   // this.resetFormVisibility();
  //   this.isLoadSpecificationFormVisible = !this.isLoadSpecificationFormVisible;
  // }

  // toggleLocalizationParametersForm($event:any) {
  //   // this.resetFormVisibility();
  //   this.isLocalizationParametersFormVisible = !this.isLocalizationParametersFormVisible;
  // }

  // // Resets all form visibility to false (hide all forms)
  // resetFormVisibility() {
  //   this.isTypeSpecificationFormVisible = false;
  //   this.isProtocolLimitsFormVisible = false;
  //   this.isProtocolFeaturesFormVisible = false;
  //   this.isAGVGeometryFormVisible = false;
  //   this.isLoadSpecificationFormVisible = false;
  //   this.isLocalizationParametersFormVisible = false;
  // }

  // Utility function to remove the time part of a date
  // normalizeDate(date: Date): Date {
  //   return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  // }
  normalizeDate(date: Date): string {
    return this.formatDate(date); // Strips time information, returns 'YYYY-MM-DD'
  }

  selectedrobotData = [
    { column1: '192.168.XX.XX', column2: ' ' },
    { column1: '192.168.XX.XX', column2: ' ' },
  ];
  ipScanData: any[] = [];

  loadData() {
    // Fetch or initialize data here
    // this.EnvData = []; // Replace with actual data fetching
    this.setPaginatedData(); //changes made for Realoading the Data
    this.filterData(); // Initial filter application
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.setPaginatedData(); // Safe to access paginator here
    }
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
  eventSource!: EventSource;
  startIP: string = '';
  EndIP: string = '';
  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.paginatedData1.forEach((item) => (item.selected = isChecked));
  }

  async startScanning() {
    this.ipScanData = [];

    if (this.startIP === '' || this.EndIP === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Enter valid IP',
      });
      return;
    }

    const ipv4Regex =
      /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipv4Regex.test(this.startIP) || !ipv4Regex.test(this.EndIP)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Not valid IP. Try again',
      });
      return;
    }

    const URL = `http://${environment.API_URL}:${environment.PORT}/fleet-config/scan-ip/${this.startIP}-${this.EndIP}`;

    const response = await fetch(URL, { method: 'GET' });

    if (response.status === 422) {
      // alert(`Ip range is too large`);
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Ip range is too large',
      });
      return;
    }

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
        // this.ipScanData = this.filteredipData;
        // this.setPaginatedData();
        this.cdRef.detectChanges();
      } catch (error) {
        console.error('Error parsing SSE data:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Error parsing SSE data ${error}`,
        });
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      this.eventSource.close();
      this.messageService.add({
        severity: 'success',
        summary: 'Completed',
        detail: 'Scanning Completed',
      });
      this.isScanning = false;
      this.cdRef.detectChanges();
    };
    this.isScanning = true;
    if (this.isScanning)
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Started scanning',
      });
  }
  stopScanning() {
    this.isScanning = false;
    this.eventSource.close();
    this.messageService.add({
      severity: 'error',
      summary: 'Info',
      detail: 'Scanning Stopped',
    });
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
    // Reset the search filters
    this.startDate = null;
    this.endDate = null;
    this.searchTerm = ''; // If you have a search term, reset it as we
    this.showImageUploadPopup = true;
    this.setPaginatedData();
    this.filterData();
    this.resetFilters();
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
    this.setPaginatedData();
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
    this.filterData();
    this.setPaginatedData();
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

  startDate: Date | null = null;
  endDate: Date | null = null;
  minDate!: string;
  maxDate!: string;

  // yet to work..
  showTable(table: string) {
    this.currentTable = table;
    this.setPaginatedData();
    this.filterData();
    this.searchTerm = ''; // Clear the search term
    this.startDate = null; // Clear the start date
    this.endDate = null; // Clear the end date

    // Clear filtered data based on the current table
    if (this.currentTable === 'environment') {
      this.filteredEnvData = [...this.EnvData]; // Reset to the original data
    } else if (this.currentTable === 'robot') {
      this.filteredRobotData = [...this.robotData]; // Reset to the original data
      this.fetchRobos();
    }
    // this.filterData();
  }
  searchTermChanged() {
    this.filterData();
  }

  filterData() {
    const term = this.searchTerm.toLowerCase();

    if (this.currentTable === 'Environment') {
      this.filteredEnvData = this.EnvData.filter((item) => {
        const date = new Date(item.date);
        const normalizedDate = this.normalizeDate(date); // Normalize the item's date
        const withinDateRange =
          (!this.startDate ||
            normalizedDate >= this.normalizeDate(this.startDate)) &&
          (!this.endDate || normalizedDate <= this.normalizeDate(this.endDate)); // Normalize the end date

        return (
          (item.mapName.toLowerCase().includes(term) ||
            item.siteName.toLowerCase().includes(term) ||
            item.date.toLowerCase().includes(term)) &&
          withinDateRange
        );
      });
      // console.log(this.startDate);
      // console.log(this.endDate);

      // Reset paginator to the first page and update paginated data
      if (this.paginator) {
        this.paginator.pageIndex = 0; // Reset to the first page after filtering
      }
      // this.ngOnInit();
      this.setPaginatedData(); // Trigger pagination logic after filtering
    }
  }

  resetFilters() {
    this.searchTerm = ''; // Reset search term
    this.startDate = null; // Reset start date
    this.endDate = null; // Reset end date
    this.filteredEnvData = [...this.EnvData]; // Reset environment data filter
    this.filteredRobotData = [...this.robotData]; // Reset robot data filter
  }
  // onDateFilterChange(event: Event): void {
  //   const selectElement = event.target as HTMLSelectElement;
  //   const filter = selectElement?.value || '';
  //   // Implement your date filter logic here
  // }

  // Function to format date to 'YYYY-MM-DD' format for input type="date"
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  // onDateChange(event: any) { old
  //   const input = event.target as HTMLInputElement;
  //   const id = input.id;
  //   const value = input.value;

  //   if (id === 'start-date' ) {
  //     this.startDate = value ? new Date(value) : null;
  //   } else if (id === 'end-date') {
  //     this.endDate = value ? new Date(value) : null;
  //   }

  //   this.filterData(); // Apply filters whenever the date changes
  // }
  onDateChange(value: string, field: 'start' | 'end') {
    //new
    if (field === 'start') {
      this.startDate = value ? new Date(value) : null;
    } else if (field === 'end') {
      this.endDate = value ? new Date(value) : null;
    }
    this.filterData(); // Call filter logic after date change
  }

  // onDateChange(event: any) {  //recent
  //   const selectedDate = event.target.value;  // This is in 'YYYY-MM-DD' format
  //   if (event.target.id === 'start-date') {
  //     this.startDate = selectedDate;
  //   } else if (event.target.id === 'end-date') {
  //     this.endDate = selectedDate;
  //   }
  //   this.filterData();  // Call your filter function after setting the date
  // }
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
  onCurrEditMapChange(currEditMap: boolean) {
    this.currEditMap = currEditMap;
  }
  editItem(item: any) {
    fetch(
      `http://${environment.API_URL}:${environment.PORT}/dashboard/maps/${item.mapName}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (!data.map) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Map does not exist.',
          });
          return;
        }
        if (data.error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Error fetching map: ${data.error}`,
          });
          return;
        }

        const { map } = data;
        this.currEditMapDet = {
          mapName: map.mapName,
          siteName: item.siteName,
          ratio: map.mpp,
          imgUrl: `http://${map.imgUrl}`,
          origin: map.origin,
          nodes: map.nodes,
          edges: map.edges,
          assets: map.stations,
          zones: map.zones,
          robos: map.roboPos,
        };
        this.currEditMap = true;
        this.showImageUploadPopup = true;

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Map data loaded successfully.',
        });
      })
      .catch((err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while fetching map data.',
        });
      });
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
      console.error('Error occurred: ', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while deleting the map.',
      });
      return false;
    }
  }

  deleteItem(item: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    let isDeleted = false;

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) isDeleted = await this.deleteMap(item);
      if (isDeleted) {
        if (item.id === this.projectService.getMapData().id) {
          this.projectService.setIsMapSet(false);
          this.projectService.clearMapData();
          // this.ngOnInit();
        }
        // Assuming currentTable determines which data array to modify
        if (this.currentTable === 'Environment') {
          this.EnvData = this.EnvData.filter((i) => i !== item);
          this.filteredEnvData = this.EnvData;
          this.cdRef.detectChanges();
        } else if (this.currentTable === 'robot') {
          this.filteredRobotData = this.robotData.filter((i) => i !== item);
          this.reloadTable();
          this.setPaginatedData();
        }
        this.ngOnInit();
        this.reloadTable();
        console.log('Item deleted:', item);
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Item successfully deleted!',
        });
      }
    });
  }

  addItem(item: any) {
    console.log('Add item:', item);
    this.messageService.add({
      severity: 'info',
      summary: 'Add Item',
      detail: 'Item added successfully.',
    });
  }

  blockItem(item: any) {
    console.log('Block item:', item);
    this.messageService.add({
      severity: 'warn',
      summary: 'Block Item',
      detail: 'Item blocked.',
    });
  }

  isPPPopupOpen: boolean = false;
  newItem: any = {};
  isPhysicalParametersFormVisible: boolean = false;
  // isTypeSpecificationFormVisible = false;
  // isProtocolLimitsFormVisible = false;
  // isProtocolFeaturesFormVisible = false;
  // isAGVGeometryFormVisible = false;
  // isLoadSpecificationFormVisible = false;
  // isLocalizationParametersFormVisible = false;

  formData = {
    robotName: '',
    manufacturer: '',
    serialNumber: '',
    typeSpecification: {
      seriesName: '',
      seriesDescription: '',
      agvKinematic: '',
      agvClass: undefined as any | undefined,
      maxLoadMass: 0,
      localizationTypes: '',
      navigationTypes: '',
    },
    protocolLimits: {
      maxStringLens: '',
      maxArrayLens: '',
      timing: '',
    },
    protocolFeatures: {
      optionalParameters: '',
      actionScopes: '',
      actionParameters: '',
      resultDescription: '',
    },
    agvGeometry: {
      wheelDefinitions: '',
      envelopes2d: '',
      envelopes3d: '',
    },
    loadSpecification: {
      loadPositions: '',
      loadSets: '',
    },
    localizationParameters: {
      type: '',
      description: '',
    },
  };
  reset() {
    this.formData = {
      robotName: '',
      manufacturer: '',
      serialNumber: '',
      typeSpecification: {
        seriesName: '',
        seriesDescription: '',
        agvKinematic: '',
        agvClass: undefined as any | undefined,
        maxLoadMass: 0,
        localizationTypes: '',
        navigationTypes: '',
      },
      protocolLimits: {
        maxStringLens: '',
        maxArrayLens: '',
        timing: '',
      },
      protocolFeatures: {
        optionalParameters: '',
        actionScopes: '',
        actionParameters: '',
        resultDescription: '',
      },
      agvGeometry: {
        wheelDefinitions: '',
        envelopes2d: '',
        envelopes3d: '',
      },
      loadSpecification: {
        loadPositions: '',
        loadSets: '',
      },
      localizationParameters: {
        type: '',
        description: '',
      },
    };
  }
  // cities: any[] | undefined;

  // selectedCity: DB | undefined;

  // Method to close all forms
  closeAllForms(): void {
    this.isTypeSpecificationFormVisible = false;
    this.isProtocolLimitsFormVisible = false;
    this.isProtocolFeaturesFormVisible = false;
    this.isAGVGeometryFormVisible = false;
    this.isLoadSpecificationFormVisible = false;
    this.isLocalizationParametersFormVisible = false;
  }

  // Toggle Type Specification Form
  toggleTypeSpecificationForm(event: Event): void {
    event.preventDefault();
    this.closeAllForms();
    this.isTypeSpecificationFormVisible = !this.isTypeSpecificationFormVisible;
    this.cdRef.detectChanges();
  }

  // Toggle Protocol Limits Form
  toggleProtocolLimitsForm(event: Event): void {
    event.preventDefault();
    this.closeAllForms();
    this.isProtocolLimitsFormVisible = !this.isProtocolLimitsFormVisible;
    this.cdRef.detectChanges();
  }

  // Toggle Protocol Features Form
  toggleProtocolFeaturesForm(event: Event): void {
    event.preventDefault();
    this.closeAllForms();
    this.isProtocolFeaturesFormVisible = !this.isProtocolFeaturesFormVisible;
    this.cdRef.detectChanges();
  }

  // Toggle AGV Geometry Form
  toggleAGVGeometryForm(event: Event): void {
    event.preventDefault();
    this.closeAllForms();
    this.isAGVGeometryFormVisible = !this.isAGVGeometryFormVisible;
    this.cdRef.detectChanges();
  }

  // Toggle Load Specification Form
  toggleLoadSpecificationForm(event: Event): void {
    event.preventDefault();
    this.closeAllForms();
    this.isLoadSpecificationFormVisible = !this.isLoadSpecificationFormVisible;
    this.cdRef.detectChanges();
  }

  // Toggle Localization Parameters Form
  toggleLocalizationParametersForm(event: Event): void {
    event.preventDefault();
    this.closeAllForms();
    this.isLocalizationParametersFormVisible =
      !this.isLocalizationParametersFormVisible;
    this.cdRef.detectChanges();
  }

  // Close form methods (if needed individually)
  closeTypeSpecificationForm(): void {
    this.isTypeSpecificationFormVisible = false;
    this.cdRef.detectChanges();
  }

  closeProtocolLimitsForm(): void {
    this.isProtocolLimitsFormVisible = false;
    this.cdRef.detectChanges();
  }

  closeProtocolFeaturesForm(): void {
    this.isProtocolFeaturesFormVisible = false;
    this.cdRef.detectChanges();
  }

  closeAGVGeometryForm(): void {
    this.isAGVGeometryFormVisible = false;
    this.cdRef.detectChanges();
  }

  closeLoadSpecificationForm(): void {
    this.isLoadSpecificationFormVisible = false;
    this.cdRef.detectChanges();
  }

  closeLocalizationParametersForm(): void {
    console.log('Close icon clicked');
    this.isLocalizationParametersFormVisible = false;
    this.cdRef.detectChanges();
  }

  // Save methods for each form
  saveTypeSpecification(): void {
    console.log('Type Specification saved:', this.formData.typeSpecification);
    this.closeTypeSpecificationForm();
    // this.cdRef.detectChanges();
  }

  saveProtocolLimits(): void {
    console.log('Protocol Limits saved:', this.formData.protocolLimits);
    this.closeProtocolLimitsForm();
    this.cdRef.detectChanges();
  }

  saveProtocolFeatures(): void {
    console.log('Protocol Features saved:', this.formData.protocolFeatures);
    this.closeProtocolFeaturesForm();
    this.cdRef.detectChanges();
  }

  saveAGVGeometry(): void {
    console.log('AGV Geometry saved:', this.formData.agvGeometry);
    this.closeAGVGeometryForm();
    this.cdRef.detectChanges();
  }

  saveLoadSpecification(): void {
    console.log('Load Specification saved:', this.formData.loadSpecification);
    this.closeLoadSpecificationForm();
    this.cdRef.detectChanges();
  }

  saveLocalizationParameters(): void {
    console.log(
      'Localization Parameters saved:',
      this.formData.localizationParameters
    );
    this.closeLocalizationParametersForm();
    this.cdRef.detectChanges();
  }

  saveItem(): void {
    this.isPopupOpen = false;
    this.addForm.reset();
    this.cdRef.detectChanges();
  }

  // handle the data here..
  saveRoboInfo(): void {
    // roboName | serial Number, ip add, mac add, grossInfo
    let project = this.projectService.getSelectedProject();
    let currMap = this.projectService.getMapData();
    if (!project || !currMap) {
      alert('map not selected');
      return;
    }
    if (this.isRoboInEdit) {
      this.updateRobo();
      return;
    }
    let amrId = 0;
    if (this.robotData.length)
      amrId = this.robotData[this.robotData.length - 1].amrId + 1;
    const roboDetails = {
      projectName: project.projectName,
      mapId: currMap.id,
      mapName: currMap.mapName,
      roboName: this.formData.robotName,
      amrId: amrId,
      uuid: uuid(),
      // isSimMode : false,
      ipAdd: this.currentRoboDet.ip,
      macAdd: this.currentRoboDet.mac,
      grossInfo: this.formData,
    };
    if (roboDetails.roboName === '' || this.formData.manufacturer === '') {
      alert('Manufacturer or roboname should be there');
      return;
    }
    fetch(
      `http://${environment.API_URL}:${environment.PORT}/robo-configuration`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(roboDetails),
      }
    )
      .then((response) => {
        if (response.status === 422)
          console.log(
            'Error while inserting reference Id in server, unprocessable entity'
          );
        // if (!response.ok)
        //   throw new Error(`Err with status code of ${response.status}`);
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        if (data.error) return;
        else if (data.isIpMacExists) {
          console.log(data.msg);
          alert('Ip | Mac seems already exists!');
          return;
        } else if (data.exists) {
          alert('Robo Name already exists');
          return;
        }
        if (data.robo) {
          this.robotData = [...this.robotData, data.robo];
          this.ngOnInit();
          // this.filteredRobotData = [...this.robotData];
          // this.cdRef.detectChanges();
          // alert('robo Added to db');
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Robo Added to Database Successfully!.',
          });
          return;
        }
      });
    this.isPopupOpen = false;
    this.ngOnInit();
    this.cdRef.detectChanges();
  }

  closeroboPopup(): void {
    this.isPopupOpen = false;
    this.cdRef.detectChanges();
  }

  openPopup(item: any) {
    this.currentRoboDet = item;
    this.isPopupOpen = !this.isPopupOpen;
    this.addForm.reset();
    this.reset();
    // this.newItem = { ...item }; // Initialize with the clicked item's data
    this.cdRef.detectChanges();
  }
  closePPPopup() {
    this.isPhysicalParametersFormVisible =
      !this.isPhysicalParametersFormVisible;
  }
  savePPItem() {
    this.isPhysicalParametersFormVisible =
      !this.isPhysicalParametersFormVisible;
  }
}
