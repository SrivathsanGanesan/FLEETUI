import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface Robot {
isCharging: boolean;
networksrength: any;
currentMap: any;
currentTask: any;
batteryDistance: any;
currentSpeed: any;
averageSpeed: any;
distanceLeft: string;
  
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
  cpuutilization: string;
  memory: string;

  error: string;
  batteryPercentage: number;
  
}

@Component({
  selector: 'app-robot-detail-popup',
  templateUrl: './robot-detail-popup.component.html',
  styleUrls: ['./robot-detail-popup.component.css']
})
export class RobotDetailPopupComponent {
  
  metrics: { title: string; value: string; icon: string }[] = [];
  // batteryData: any[] = [];  
  robot: any;

 
  

  getClassForCircle(percentage: number, threshold: number): string {
    return percentage >= threshold ? 'filled' : '';
  }

 // Function to get battery color


// get batteryPercentage(): number {
//   return Number(this.data.batteryPercentage);
// }

// Getter for isCharging status
// get isCharging(): boolean {
//   return this.data.isCharging;
// }


  constructor(
    public dialogRef: MatDialogRef<RobotDetailPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Robot
  ) {
    
    
  }

  getBatteryColor(batteryPercentage: number): string {
    if (batteryPercentage >= 75) {
      return 'high'; // Green for high battery
    } else if (batteryPercentage >= 40) {
      return 'medium';
    } else {
      return 'low'; // Red for low battery
    }
  }
  
  setWifiStatus(signalStrength: string) {
    const circle1 = document.querySelector('.circle1') as HTMLElement;
    const circle2 = document.querySelector('.circle2') as HTMLElement;
    const circle3 = document.querySelector('.circle3') as HTMLElement;
    const circle4 = document.querySelector('.circle4') as HTMLElement;
  
    if (signalStrength === 'full') {
      circle1.style.borderTopColor = 'green';
      circle2.style.borderTopColor = 'green';
      circle3.style.borderTopColor = 'green';
      circle4.style.backgroundColor = 'green';
    } else if (signalStrength === 'medium') {
      circle1.style.borderTopColor = 'green';
      circle2.style.borderTopColor = 'green';
      circle3.style.borderTopColor = 'green';
      circle4.style.backgroundColor = 'grey';
    } else if (signalStrength === 'weak') {
      circle1.style.borderTopColor = 'green';
      circle2.style.borderTopColor = 'grey';
      circle3.style.borderTopColor = 'grey';
      circle4.style.backgroundColor = 'grey';
    } else {
      circle1.style.borderTopColor = 'grey';
      circle2.style.borderTopColor = 'grey';
      circle3.style.borderTopColor = 'grey';
      circle4.style.backgroundColor = 'grey';
    }
  }
  
  

  ngOnInit(): void {

    console.log('Battery Percentage:', this.data.batteryPercentage);
    console.log('Is Charging:', this.data.isCharging);
    
  }
 

  
 
  onClose(): void {
    this.dialogRef.close();
  }
}