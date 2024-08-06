import { Component } from '@angular/core';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  // Add methods and properties as needed
  addRobot() {
    console.log('Add robot button clicked');
  }

  editRobot() {
    console.log('Edit button clicked');
  }

  deleteRobot() {
    console.log('Delete button clicked');
  }

  searchRobot(query: string) {
    console.log('Searching for:', query);
  }
}
