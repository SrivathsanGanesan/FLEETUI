import { Component } from '@angular/core';

@Component({
  selector: 'app-operation-pie',
  templateUrl: './operation-pie.component.html',
  styleUrls: ['./operation-pie.component.css']
})
export class OperationPieComponent {
  isDropdownOpen = false;
  selectedPeriod = 'Today';

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectPeriod(period: string) {
    this.selectedPeriod = period;
    this.isDropdownOpen = false;
    // Add logic here to update your chart or data based on the selected period
  }
}
