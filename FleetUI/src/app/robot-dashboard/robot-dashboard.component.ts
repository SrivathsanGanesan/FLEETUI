import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-robot-dashboard',
  templateUrl: './robot-dashboard.component.html',
  styleUrls: ['./robot-dashboard.component.css'],
})
export class RobotDashboardComponent implements OnInit {
  currentView: string = 'robot';
  selectedMap: any | null = null;
  robotActivities: any[] = [];
  statisticsData: any = {}; // Initialize the array with mock data
  // robotActivities = [

  //   // { id: 2, name: 'AMR-001', task: 'Transporting materials', progress: 85, status: 'Actively Working' },
  // ];

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

  constructor(private router: Router, private projectService: ProjectService) {}

  async ngOnInit() {
    this.router.navigate(['/statistics/robot']);
    this.selectedMap = this.projectService.getMapData();
    if (!this.selectedMap) return;
    this.robotActivities = await this.fetchCurrRoboActivites();
    this.filteredRobotActivities = this.robotActivities;
    setInterval(async () => {
      let currActivities = await this.fetchCurrRoboActivites();
      this.robotActivities.push(currActivities);
      this.filteredRobotActivities = this.robotActivities.flat(); // flat() to convert nested of nested array to single array..
      console.log(this.filteredRobotActivities);

      // this.filteredRobotActivities = [
      //   ...this.filteredRobotActivities,
      //   currActivities[0],
      // ];
    }, 1000 * 10);

    this.statisticsData = {
      averageSpeed: 75,
      averageSpeedchange: 8.5,
      totalDistance: 99.9,
      totalDistanceChange: 0.2,
      robotUtilization: 35,
      robotUtilizationChange: -1.5,
      networkConnection: 100,
      networkConnectionChange: 5.2
    };
  }

  async fetchCurrRoboActivites(): Promise<number[]> {
    let response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/stream-data/get-robo-activities`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mapId: this.selectedMap.id }),
      }
    );
    // if(!response.ok) throw new Error(`Error occured with status code of : ${response.status}`)
    let data = await response.json();
    if (data.error) {
      console.log('Err occured while getting tasks status : ', data.error);
      return [];
    }
    if (data.roboActivities) return data.roboActivities;
    return [];
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase();
    this.filteredRobotActivities = this.robotActivities.filter(
      (activity) =>
        activity.roboId.toString().toLowerCase().includes(query) ||
        activity.roboName.toLowerCase().includes(query) ||
        activity.task.toLowerCase().includes(query)
    );
  }

  onSearchNotifications(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase();
    this.filteredNotifications = this.notifications.filter((notification) =>
      notification.message.toLowerCase().includes(query)
    );
  }

  setView(view: string): void {
    this.currentView = view;
    if (view === 'robot') {
      this.router.navigate(['/statistics/robot']);
    } else {
      this.router.navigate(['/statistics/operation']);
    }
  }

  onViewAllClick() {
    this.router.navigate(['/tasks']); // Navigate to the tasks page
  }
}
