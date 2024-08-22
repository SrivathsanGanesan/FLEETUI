import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RobotDetailPopupComponent } from '../robot-detail-popup/robot-detail-popup.component';

export interface Robot {
  id: number;
  name: string;
  imageUrl: string;
  capacity: string;
  speed: string;
  accuracy: string;
  status: string;
  battery: string;
  serialNumber: string; // Add other fields as needed
}
@Component({
  selector: 'app-robots',
  templateUrl: './robots.component.html',
  styleUrl: './robots.component.css'
})
export class RobotsComponent {
  robots: Robot[] = [
    {
      id: 1,
      serialNumber: '101589', // Example serial number
      name: 'Forklift AGV',
      imageUrl: "../../assets/robots/agv1.png",
      capacity: '2000 kg',
      speed: '2.7m/s (5.21mph)',
      accuracy: '± 10mm/±0.5’',
      status: 'Active',
      battery: '40%'
    },
    {
      id: 2,
      serialNumber: '101589', // Example serial number
      name: 'Forklift AGV',
      imageUrl: "../../assets/robots/agv1.png",
      capacity: '2000 kg',
      speed: '2.7m/s (5.21mph)',
      accuracy: '± 10mm/±0.5’',
      status: 'Active',
      battery: '80%'
    },
    {
      id: 3,
      serialNumber: '101589', // Example serial number
      name: 'Forklift AGV',
      imageUrl: "../../assets/robots/agv1.png",
      capacity: '2000 kg',
      speed: '2.7m/s (5.21mph)',
      accuracy: '± 10mm/±0.5’',
      status: 'Active',
      battery: '80%'
    },
    {
      id: 4,
      serialNumber: '101589', // Example serial number
      name: 'Forklift AGV',
      imageUrl: "../../assets/robots/agv1.png",
      capacity: '2000 kg',
      speed: '2.7m/s (5.21mph)',
      accuracy: '± 10mm/±0.5’',
      status: 'Active',
      battery: '80%'
    },
    {
      id: 5,
      serialNumber: '101589', // Example serial number
      name: 'Forklift AGV',
      imageUrl: "../../assets/robots/agv1.png",
      capacity: '2000 kg',
      speed: '2.7m/s (5.21mph)',
      accuracy: '± 10mm/±0.5’',
      status: 'Active',
      battery: '80%'
    },
    {
      id: 6,
      serialNumber: '101589', // Example serial number
      name: 'Forklift AGV',
      imageUrl: "../../assets/robots/agv1.png",
      capacity: '2000 kg',
      speed: '2.7m/s (5.21mph)',
      accuracy: '± 10mm/±0.5’',
      status: 'Active',
      battery: '80%'
    },
    {
      id: 7,
      serialNumber: '101589', // Example serial number
      name: 'Forklift AGV',
      imageUrl: "../../assets/robots/agv1.png",
      capacity: '2000 kg',
      speed: '2.7m/s (5.21mph)',
      accuracy: '± 10mm/±0.5’',
      status: 'Active',
      battery: '80%'
    },
    // Add more robots with status and battery information...
  ];
 
  showPopup = false;
  isEditPopupOpen = false;
  menuOpenIndex: number | null = null;
 
  newRobot: Robot = {
    id: 0, 
    name: '', 
    imageUrl: '', 
    capacity: '', 
    speed: '', 
    accuracy: '', 
    status: 'Active', 
    battery: '100%',
    serialNumber: ''
  };
  editRobotData: Robot = {
    id: 0, 
    name: '', 
    imageUrl: '', 
    capacity: '', 
    speed: '', 
    accuracy: '', 
    status: 'Active', 
    battery: '100%',
    serialNumber: '' 
  };
  editIndex: number | null = null;
  centerIndex: any;
 
  togglePopup() {
    this.showPopup = !this.showPopup;
  }
 
  toggleMenu(index: number) {
    if (this.menuOpenIndex === index) {
      this.menuOpenIndex = null;
    } else {
      this.menuOpenIndex = index;
    }
  }
 
  closeMenu() {
    this.menuOpenIndex = null;
  }
 
  addRobot() {
    if (this.newRobot.name && this.newRobot.imageUrl && this.newRobot.capacity && this.newRobot.speed && this.newRobot.accuracy) {
      this.newRobot.id = this.robots.length > 0 ? this.robots[this.robots.length - 1].id + 1 : 1;
      this.robots.push({ ...this.newRobot });
      this.newRobot = { id: 0, name: '', imageUrl: '', capacity: '', speed: '', accuracy: '', status: 'Active', battery: '100%',serialNumber: '' };
      this.togglePopup();
    } else {
      alert('Please fill out all fields.');
    }
  }
 
  editRobot(index: number) {
    this.isEditPopupOpen = true;
    this.editIndex = index;
    this.editRobotData = { ...this.robots[index] };
    this.menuOpenIndex = null;
  }
 
  saveRobot() {
    if (this.editIndex !== null) {
      this.robots[this.editIndex] = {
        id: this.editRobotData.id,
        name: this.editRobotData.name,
        imageUrl: this.editRobotData.imageUrl,
        capacity: this.editRobotData.capacity,
        speed: this.editRobotData.speed,
        accuracy: this.editRobotData.accuracy,
        status: this.editRobotData.status,
        battery: this.editRobotData.battery,
        serialNumber: this.editRobotData.serialNumber || 'DefaultSerialNumber'
      };
      this.closeEditPopup();
    }
  }
 
  closeEditPopup() {
    this.isEditPopupOpen = false;
    this.editIndex = null;
    this.editRobotData = { 
      id: 0, 
      name: '', 
      imageUrl: '', 
      capacity: '', 
      speed: '', 
      accuracy: '', 
      status: 'Active', 
      battery: '100%',
      serialNumber: '' 
    };
  }

  deleteRobot(index: number) {
    this.robots.splice(index, 1);
    this.updateRobotIds();
    this.menuOpenIndex = null;
  }
 
  updateRobotIds() {
    this.robots.forEach((robot, index) => {
      robot.id = index + 1;
    });
  }
 
  trackByIndex(index: number, obj: any): any {
    return index;
  }
  
  constructor(public dialog: MatDialog) {}

  openRobotDetail(robot: Robot): void {
    this.dialog.open(RobotDetailPopupComponent, {
      width: '70%',
      data: robot
    });
  }

  // @Input() robot: any;
  // @Output() cardClicked = new EventEmitter<any>();

  // openPopup(robot: any) {
  //   this.cardClicked.emit(robot);
  // }
}
