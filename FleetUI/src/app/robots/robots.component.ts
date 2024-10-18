import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RobotDetailPopupComponent } from '../robot-detail-popup/robot-detail-popup.component';
import { environment } from '../../environments/environment.development';
import { ProjectService } from '../services/project.service';

export interface Robot {
  isCharging: boolean;
  networksrength: any;
  currentMap: any;
  currentTask: any;
  batteryDistance: any;
  currentSpeed: any;
  averageSpeed: any;
  distanceLeft: string;
  isConnected: boolean;

  id: number;
  name: string;
  imageUrl: string;
  capacity: string;
  speed: string;
  accuracy: string;
  status: string;
  battery: string;
  serialNumber: string;
  temperature: string;
  networkstrength: string;
  robotutilization: string;
  cpuutilization: string;
  memory: string;
  totalPicks: string;
  totalDrops: string;
  SignalStrength: string;
  error: number;
  batteryPercentage: number;
  averagedischarge: number;
  averageChargingTime: string;
  currentspeed: string;
  averagespeed: string;
  maximumspeed: string;
  averagetransfertime: string;
  averagedockingtime: string;
}

@Component({
  selector: 'app-robots',
  templateUrl: './robots.component.html',
  styleUrls: ['./robots.component.scss'],
})
export class RobotsComponent implements OnInit {
  robotImages: string[] = [
    'agv1.png',
    'agv2.png',
    'agv3.png',
    // Add more images from assets/robots
  ];

  currentSignalClass: string = 'none'; // Default class
  robots: Robot[] = [];
  // robots: any[] = [];
  liveRobos: any[] = [];
  searchQuery: string = ''; // To hold the search input
  filteredRobots: Robot[] = []; // To store filtered robots
  initialRoboInfos: Robot[] = []; // to store data of initial robo details..

  mapDetails: any | null = null;
  showPopup = false;

  menuOpenIndex: number | null = null;
  editIndex: number | null = null;
  centerIndex: any;

  constructor(
    public dialog: MatDialog,
    private projectService: ProjectService
  ) {
    // this.mapDetails = this.projectService.getMapData();
  }

  async ngOnInit() {
    // this.setSignalStrength('Weak'); // Change this value to test different signals
    this.mapDetails = this.projectService.getMapData();
    if (!this.mapDetails) return;
    let grossFactSheet = await this.fetchAllRobos();
    this.robots = grossFactSheet.map((robo) => {
      robo.imageUrl = '../../assets/robots/agv1.png';
      // robo.networkstrength = `${robo.networkstrength}`;
      if (robo.networkstrength < 20) robo.SignalStrength = 'Weak';
      else if (robo.networkstrength < 40) robo.SignalStrength = 'Medium';
      else if (robo.networkstrength < 80) robo.SignalStrength = 'Full';
      robo.networkstrength = robo.networkstrength.toString() + ' dBm';
      return robo;
    });
    this.filteredRobots = this.robots;
    this.initialRoboInfos = this.robots;
    this.liveRobos = await this.getLiveRoboInfo();
    this.updateLiveRoboInfo();
    setInterval(async () => {
      this.liveRobos = await this.getLiveRoboInfo();
      this.updateLiveRoboInfo();
    }, 1000 * 5);
    // this.robots = grossFactSheet;
  }

  async fetchAllRobos(): Promise<any[]> {
    const response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/stream-data/get-fms-amrs`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mapId: this.mapDetails.id,
        }),
      }
    );
    // if (!response.ok)
    //   throw new Error(`Err with status code of ${response.status}`);
    const data = await response.json();
    console.log(data);
    if (data.robots) return data.robots;
    return [];
  }

  async getLiveRoboInfo(): Promise<any[]> {
    const response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/stream-data/get-live-robos/${this.mapDetails.id}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    const data = await response.json();
    console.log(data);
    if (!data.map || data.error) return [];
    return data.robos;
  }

  updateLiveRoboInfo() {
    if (!('robots' in this.liveRobos)) {
      this.robots = this.initialRoboInfos;
      return;
    }
    let { robots }: any = this.liveRobos;
    if (!robots.length) this.robots = this.initialRoboInfos;
    this.robots = this.robots.map((robo) => {
      robots.forEach((liveRobo: any) => {
        if (robo.id == liveRobo.id) {
          robo.error = 0;
          robo.battery = liveRobo.battery.toFixed(2);
          robo.batteryPercentage = liveRobo.battery.toFixed(2);
          robo.currentTask = liveRobo.current_task;
          robo.status = liveRobo.isConnected ? 'ACTIVE' : 'INACTIVE';
          robo.isConnected = liveRobo.isConnected;
          if ('EMERGENCY STOP' in liveRobo.robot_errors)
            robo.error += liveRobo.robot_errors['EMERGENCY STOP'].length;
          if ('LIDAR_ERROR' in liveRobo.robot_errors)
            robo.error += liveRobo.robot_errors['LIDAR_ERROR'].length;
        }
      });
      return robo;
    });
    this.filteredRobots = this.robots;
  }

  filterRobots(): void {
    const query = this.searchQuery.toLowerCase();

    this.filteredRobots = this.robots.filter((robot) => {
      const idMatch = robot.id.toString().includes(query);
      const serialNumberMatch = robot.serialNumber
        .toLowerCase()
        .includes(query);
      const nameMatch = robot.name.toLowerCase().includes(query);

      return idMatch || serialNumberMatch || nameMatch;
    });
  }

  getImagePath(imageName: string): string {
    return `../../assets/robots/${imageName}`;
  }

  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  toggleMenu(index: number) {
    console.log('Toggling menu for index:', index); // Debugging log
    if (this.menuOpenIndex === index) {
      this.menuOpenIndex = null;
    } else {
      this.menuOpenIndex = index;
    }
  }

  closeMenu() {
    this.menuOpenIndex = null;
  }

  @ViewChild('cardContainer') cardContainer!: ElementRef; // Assure TypeScript this will be assigned.

  ngAfterViewInit() {
    const cardContainers = document.querySelectorAll('.card-container'); // Update to 'card-container' class
    const nextBtns = document.querySelectorAll('.nxt-btn');
    const prevBtns = document.querySelectorAll('.pre-btn');
    console.log('clicked');

    cardContainers.forEach((cardContainer, i) => {
      const containerWidth = cardContainer.getBoundingClientRect().width;

      // Add event listener for next button if it exists
      if (nextBtns[i]) {
        nextBtns[i].addEventListener('click', () => {
          cardContainer.scrollLeft += containerWidth;
        });
      }

      // Add event listener for previous button if it exists
      if (prevBtns[i]) {
        prevBtns[i].addEventListener('click', () => {
          cardContainer.scrollLeft -= containerWidth;
        });
      }
    });
  }

  // addRobot() {
  //   if (this.newRobot.name && this.newRobot.imageUrl && this.newRobot.serialNumber && this.newRobot.status && this.newRobot.battery) {
  //     this.newRobot.id = this.robots.length > 0 ? this.robots[this.robots.length - 1].id + 1 : 1;
  //     this.robots.push({ ...this.newRobot });
  //     this.newRobot = { id: 0, name: '', imageUrl: '',  serialNumber: '',  status: 'Active', battery: '100%' };
  //     this.togglePopup();
  //   } else {
  //     alert('Please fill out all fields.');
  //   }
  // }

  // editRobot(index: number) {
  //   this.isEditPopupOpen = true;
  //   this.editIndex = index;
  //   this.editRobotData = { ...this.robots[index] };
  //   this.menuOpenIndex = null;
  // }

  // saveRobot() {
  //   if (this.editIndex !== null) {
  //     this.robots[this.editIndex] = {
  //       id: this.editRobotData.id,
  //       name: this.editRobotData.name,
  //       imageUrl: this.editRobotData.imageUrl,
  //       serialNumber: this.editRobotData.serialNumber || 'DefaultSerialNumber',

  //       status: this.editRobotData.status,
  //       battery: this.editRobotData.battery,

  //     };
  //     this.closeEditPopup();
  //   }
  // }

  // closeEditPopup() {
  //   this.isEditPopupOpen = false;
  //   this.editIndex = null;
  //   this.editRobotData = {
  //     id: 0,
  //     name: '',
  //     imageUrl: '',
  //     serialNumber: '' ,
  //     status: 'Active',
  //     battery: '100%',

  //   };
  // }

  deleteRobot(index: number) {
    // yet to do..
    // this.robots.splice(index, 1);
    this.updateRobotIds();
    this.menuOpenIndex = null;
  }

  updateRobotIds() {
    // this.robots.forEach((robot, index) => {
    //   robot.id = index + 1;
    // });
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  openRobotDetail(robot: Robot): void {
    this.dialog.open(RobotDetailPopupComponent, {
      width: '50%',
      data: robot,
    });
  }

  // fetchSignalStrength(): void {
  //   // Replace with your API endpoint
  //   const apiUrl = 'https://api.example.com/signal-strength';

  //   this.http.get<{ signal: string }>(apiUrl).subscribe(response => {
  //     this.currentSignalClass = this.mapSignalToClass(response.signal);
  //   });
  // }

  setSignalStrength(signal: string): void {
    this.currentSignalClass = this.mapSignalToClass(signal);
    console.log('Current Signal Class: ', this.currentSignalClass); // Debug log
  }

  mapSignalToClass(signal: string): string {
    switch (signal) {
      case 'no signal':
        return 'none';
      case 'weak':
        return 'weak';
      case 'medium':
        return 'medium';
      case 'full':
        return 'full';
      case 'searching':
        return 'loading';
      default:
        return 'loading';
    }
  }

  getBatteryColor(batteryPercentage: number): string {
    if (batteryPercentage >= 20) {
      return 'high'; // Green for high battery
    } else if (batteryPercentage >= 40) {
      return 'medium';
    } else {
      return 'low'; // Red for low battery
    }
  }
}
