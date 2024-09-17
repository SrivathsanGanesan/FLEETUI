import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-robot-dashboard',
  templateUrl: './robot-dashboard.component.html',
  styleUrls: ['./robot-dashboard.component.css']
})
export class RobotDashboardComponent implements OnInit {

  robotActivities = [
    { id: 1, name: 'AMR-001', task: 'Transporting materials', progress: 85, status: 'Actively Working' },
    { id: 2, name: 'AMR-001', task: 'Transporting materials', progress: 85, status: 'Actively Working' },
    { id: 3, name: 'AMR-001', task: 'Transporting materials', progress: 85, status: 'Actively Working' },
    { id: 3, name: 'AMR-001', task: 'Transporting materials', progress: 85, status: 'Actively Working' },
    { id: 1, name: 'AMR-001', task: 'Transporting materials', progress: 85, status: 'Actively Working' },
    { id: 2, name: 'AMR-001', task: 'Transporting materials', progress: 85, status: 'Actively Working' },
    { id: 3, name: 'AMR-001', task: 'Transporting materials', progress: 85, status: 'Actively Working' },
    { id: 3, name: 'AMR-001', task: 'Transporting materials', progress: 85, status: 'Actively Working' },
    { id: 1, name: 'AMR-001', task: 'Transporting materials', progress: 85, status: 'Actively Working' },
    { id: 2, name: 'AMR-001', task: 'Transporting materials', progress: 85, status: 'Actively Working' },
    { id: 3, name: 'AMR-001', task: 'Transporting materials', progress: 85, status: 'Actively Working' },
    { id: 3, name: 'AMR-001', task: 'Transporting materials', progress: 85, status: 'Actively Working' },
  ];

  notifications = [
    { message: 'Low Battery - AMR-001', timestamp: '2024-08-16 14:32' },
    { message: 'Task Assigned - AMR-002', timestamp: '2024-08-16 14:32' },
    { message: 'Obstacle Detected - AMR-003', timestamp: '2024-08-16' },
    { message: 'Obstacle Detected - AMR-003', timestamp: '2024-08-16' },
    { message: 'Low Battery - AMR-001', timestamp: '2024-08-16 14:32' },
    { message: 'Task Assigned - AMR-002', timestamp: '2024-08-16 14:32' },
    { message: 'Obstacle Detected - AMR-003', timestamp: '2024-08-16' },
    { message: 'Obstacle Detected - AMR-003', timestamp: '2024-08-16' },
    { message: 'Low Battery - AMR-001', timestamp: '2024-08-16 14:32' },
    { message: 'Task Assigned - AMR-002', timestamp: '2024-08-16 14:32' },
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
  currentView: string = 'robot';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.navigate(['/statistics/robot']);
  }

  setView(view: string): void {
    this.currentView = view;
    if (view === 'robot') {
      this.router.navigate(['/statistics/robot']);
    } else {
      this.router.navigate(['/statistics/operation']);
    }
  }
}
