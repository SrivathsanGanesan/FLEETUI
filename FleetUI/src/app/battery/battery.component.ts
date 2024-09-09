import { Component, Input, OnInit } from '@angular/core';

export interface Robot {

  batterypercentage: string;
  
}


@Component({
  selector: 'app-battery',
  templateUrl: './battery.component.html',
  styleUrls: ['./battery.component.css']
})
export class BatteryComponent implements OnInit {

  @Input() batteryPercentage: number = 100; // Input for battery percentage
  @Input() isCharging: boolean = false; // Input for charging state
data: any;

  constructor() { }

  ngOnInit(): void { }

  // Method to return the battery color class based on percentage
  getBatteryColor(): string {
    if (this.batteryPercentage <= 20) {
      return 'low';
    } else if (this.batteryPercentage <= 60) {
      return 'medium';
    } else {
      return 'high';
    }
  }
}
