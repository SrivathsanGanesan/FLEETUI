import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  currentView: string = 'operation'; // Default to 'operation'

robotActivities = [
  { id: 1, name: 'AMR-001', task: 'Transporting materials', progress: 15, status: 'Actively Working' },
  {id: 2, name: 'AMR-002', task: 'Transporting materials', progress: 42, status: 'Actively Working' },
  {id: 3, name: 'AMR-003', task: 'Transporting materials', progress: 90, status: 'Actively Working' },
];

notifications = [
  { message: 'Low Battery - AMR-001', timestamp: '2024-08-16 14:32' },
  { message: 'Task Assigned - AMR-002', timestamp: '2024-08-16 14:32' },
  { message: 'Obstacle Detected - AMR-003', timestamp: '2024-08-16' },
 
  
];


  constructor(private router: Router) {}

  setView(view: string): void {
    this.currentView = view;
    if (view === 'robot') {
      this.router.navigate(['/statistics/robot']);
    } else {
      this.router.navigate(['/statistics/operation']);
    }
  }

  ngOnInit(): void {
    this.router.navigate(['/statistics/operation']); // Default to operation view
  }
}
