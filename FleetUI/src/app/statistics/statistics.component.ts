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
  {id: 1, name: 'AMR-001', task: 'Transporting materials', progress: 15, status: 'Actively Working' },
  {id: 2, name: 'AMR-002', task: 'Transporting materials', progress: 42, status: 'Actively Working' },
  {id: 3, name: 'AMR-003', task: 'Transporting materials', progress: 90, status: 'Actively Working' },
  {id: 4, name: 'AMR-003', task: 'Transporting materials', progress: 90, status: 'Actively Working' },
  {id: 5, name: 'AMR-002', task: 'Transporting materials', progress: 42, status: 'Actively Working' },
  {id: 6, name: 'AMR-003', task: 'Transporting materials', progress: 90, status: 'Actively Working' },
  {id: 7, name: 'AMR-003', task: 'Transporting materials', progress: 90, status: 'Actively Working' },
];

notifications = [
  { message:'Low Battery - AMR-001', timestamp: '2024-08-16 14:32' },
  { message: 'Task Assigned - AMR-002', timestamp: '2024-08-16 14:32' },
  { message: 'Obstacle Detected - AMR-003', timestamp: '2024-08-16' },
  { message: 'Obstacle Detected - AMR-003', timestamp: '2024-08-16' },
  { message: 'Obstacle Detected - AMR-003', timestamp: '2024-08-16' },
  { message: 'Obstacle Detected - AMR-003', timestamp: '2024-08-16' },
  { message: 'Obstacle Detected - AMR-003', timestamp: '2024-08-16' },
];

filteredRobotActivities = this.robotActivities;
  filteredNotifications = this.notifications;

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase();
    this.filteredRobotActivities = this.robotActivities.filter(activity =>
      activity.name.toLowerCase().includes(query) ||
      activity.task.toLowerCase().includes(query) ||
      activity.status.toLowerCase().includes(query)
    );
  }

  onSearchNotifications(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase();
    this.filteredNotifications = this.notifications.filter(notification =>
      notification.message.toLowerCase().includes(query)
    );
  }

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
