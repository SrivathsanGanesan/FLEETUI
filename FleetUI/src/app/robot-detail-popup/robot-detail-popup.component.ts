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
 totalPicks: string;
 totalDrops:string;

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
  


  onEmergencyStop() {
    alert('Emergency Stop Pressed!');
  }

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
  
  wifiClass: string = 'none'; // Default WiFi signal state

  // Update this method to set the class based on signal strength
  updateWifiSignal(signalStrength: string) {
    this.updateWifiSignal('medium');

    this.wifiClass = signalStrength;  // Set values like 'none', 'weak', 'medium', 'full', or 'loading'
  }

  // Example: Call this function to update the WiFi signal strength dynamically
  simulateWifiSignal() {
    setTimeout(() => this.updateWifiSignal('weak'), 1000);
    setTimeout(() => this.updateWifiSignal('medium'), 2000);
    setTimeout(() => this.updateWifiSignal('full'), 3000);
    setTimeout(() => this.updateWifiSignal('none'), 4000);
  }

  

  ngOnInit(): void {

    console.log('Battery Percentage:', this.data.batteryPercentage);
    console.log('Is Charging:', this.data.isCharging);
    this.simulateWifiSignal();
  }
 

  
 
  onClose(): void {
    this.dialogRef.close();
  }
}