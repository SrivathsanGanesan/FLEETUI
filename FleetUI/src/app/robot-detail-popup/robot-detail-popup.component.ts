import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface Robot {
networksrength: any;
currentMap: any;
currentTask: any;
batteryDistance: any;
currentSpeed: any;
averageSpeed: any;
distanceLeft: string;
  batteryPercentage: string;
  averageChargingTime: string;
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
}

@Component({
  selector: 'app-robot-detail-popup',
  templateUrl: './robot-detail-popup.component.html',
  styleUrls: ['./robot-detail-popup.component.css']
})
export class RobotDetailPopupComponent {
  
  metrics: { title: string; value: string; icon: string }[] = [];
  batteryData: any[] = [];  // Array to store battery data for each robot
robot: any;

  constructor(
    public dialogRef: MatDialogRef<RobotDetailPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Robot
  ) {
    
  }

 

  
 
  onClose(): void {
    this.dialogRef.close();
  }
}