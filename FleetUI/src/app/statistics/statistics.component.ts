import { Component } from '@angular/core';

interface Robot {
  name: string;
  imageUrl: string;
  capacity: string;
  speed: string;
  accuracy: string;
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  robots: Robot[] = [
    {
      name: 'Forklift AGV',
      imageUrl: 'path/to/image1.jpg',
      capacity: '2000 kg',
      speed: '2.7m/s (5.21mph)',
      accuracy: '± 10mm/±0.5’'
    },
    {
      name: 'Forklift AGV',
      imageUrl: 'path/to/image2.jpg',
      capacity: '4000 kg',
      speed: '2.0m/s (4.47mph)',
      accuracy: '± 10mm/±0.5’'
    },
    {
      name: 'Autonomous tank',
      imageUrl: 'path/to/image3.jpg',
      capacity: '4000 kg',
      speed: '2.0m/s (4.47mph)',
      accuracy: '± 10mm/±0.5’'
    },
    {
      name: 'Autonomous tank',
      imageUrl: 'path/to/image4.jpg',
      capacity: '4000 kg',
      speed: '2.0m/s (4.47mph)',
      accuracy: '± 10mm/±0.5’'
    },
    {
      name: 'Autonomous tank',
      imageUrl: 'path/to/image5.jpg',
      capacity: '4000 kg',
      speed: '2.0m/s (4.47mph)',
      accuracy: '± 10mm/±0.5’'
    }
  ];

  showPopup = false;
  newRobot: Robot = { name: '', imageUrl: '', capacity: '', speed: '', accuracy: '' };
  centerIndex = Math.floor(this.robots.length / 2);

  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  addRobot() {
    this.robots.push({ ...this.newRobot });
    this.newRobot = { name: '', imageUrl: '', capacity: '', speed: '', accuracy: '' };
    this.togglePopup();
    this.centerIndex = Math.floor(this.robots.length / 2); // Update centerIndex after adding a new robot
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }
}
