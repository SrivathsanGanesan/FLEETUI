import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface Robot {
  id: number;
  name: string;
  imageUrl: string;
  capacity: string;
  speed: string;
  accuracy: string;
  status: string;
  battery: string;
  serialNumber: string;
}

@Component({
  selector: 'app-robot-detail-popup',
  templateUrl: './robot-detail-popup.component.html',
  styleUrls: ['./robot-detail-popup.component.css']
})
export class RobotDetailPopupComponent {

  batteryClass: string;

  constructor(
    public dialogRef: MatDialogRef<RobotDetailPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Robot
  ) {
    this.batteryClass = this.getBatteryClass(this.data.battery);
  }

  getBatteryClass(batteryLevel: string): string {
    const batteryPercentage = parseInt(batteryLevel, 10);
    if (batteryPercentage >= 75) {
      return 'battery-high';
    } else if (batteryPercentage >= 50) {
      return 'battery-medium';
    } else if (batteryPercentage >= 25) {
      return 'battery-low';
    } else {
      return 'battery-critical';
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
