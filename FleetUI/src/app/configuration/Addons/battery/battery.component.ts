import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';
import { environment } from '../../../../environments/environment.development';

interface DB {
  name: string;
  code: string;
}
@Component({
  selector: 'app-battery',
  templateUrl: './battery.component.html',
  styleUrl: './battery.component.css',
})
export class BatteryComponent {
  selectedMap: any | null = null;
  batteryForm: any = {
    minBattery: 0,
    maxBattery: 0,
    warningBattery: 0,
    warningVoltage: 0,
    minimumVoltage: 0,
  };

  constructor(private fb: FormBuilder, private projectService: ProjectService) {
    /* this.batteryForm = this.fb.group({
      battery: [
        50,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ], // Default to 50%
    }); */
  }

  ngOnInit() {
    this.selectedMap = this.projectService.getMapData();
  }

  async saveBatteryParams() {
    // console.log(this.batteryForm); // handle here..
    let response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/config-fleet-params/battery`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mapId: this.selectedMap.id,
          batteryParams: this.batteryForm,
        }),
      }
    );

    let data = await response.json();
    console.log(data);
    if (data.isSet) console.log('configured!');
  }

  onBatteryChange() {
    // Additional logic on battery percentage change if needed
  }
}
