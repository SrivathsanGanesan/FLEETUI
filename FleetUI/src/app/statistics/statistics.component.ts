import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent {
  currentView: string = 'operation'; // Default to 'operation'
  operationPie: number[] = [0, 0, 0, 0, 0];
  selectedMap: any;

  robotActivities = [
    {
      id: 1,
      name: 'saibala ',
      task: 'Transporting materials',
      progress: 15,
      status: 'Actively Working',
    },
    {
      id: 2,
      name: 'AMR-002',
      task: 'Transporting materials',
      progress: 42,
      status: 'Actively Working',
    },
    {
      id: 3,
      name: 'AMR-003',
      task: 'Transporting materials',
      progress: 90,
      status: 'Actively Working',
    },
    {
      id: 4,
      name: 'AMR-003',
      task: 'Transporting materials',
      progress: 90,
      status: 'Actively Working',
    },
    {
      id: 5,
      name: 'AMR-002',
      task: 'Transporting materials',
      progress: 42,
      status: 'Actively Working',
    },
    {
      id: 6,
      name: 'AMR-003',
      task: 'Transporting materials',
      progress: 90,
      status: 'Actively Working',
    },
    {
      id: 7,
      name: 'AMR-003',
      task: 'Transporting materials',
      progress: 90,
      status: 'Actively Working',
    },
    {
      id: 8,
      name: 'AMR-003',
      task: 'Transporting materials',
      progress: 90,
      status: 'Actively Working',
    },
    {
      id: 9,
      name: 'AMR-003',
      task: 'Transporting materials',
      progress: 90,
      status: 'Actively Working',
    },
  ];

  notifications = [
    { message: 'Low Battery - AMR-001', timestamp: '2024-08-16 14:32' },
    { message: 'Task Assigned - AMR-002', timestamp: '2024-08-16 14:32' },
    { message: 'Obstacle Detected - AMR-003', timestamp: '2024-08-16' },
    { message: 'Obstacle Detected - AMR-003', timestamp: '2024-08-16' },
    { message: 'Obstacle Detected - AMR-003', timestamp: '2024-08-16' },
    { message: 'Obstacle Detected - AMR-003', timestamp: '2024-08-16' },
    { message: 'Obstacle Detected - AMR-003', timestamp: '2024-08-16' },
  ];

  filteredRobotActivities = this.robotActivities;
  filteredNotifications = this.notifications;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private cdRef: ChangeDetectorRef
  ) {
    if (!this.selectedMap) this.selectedMap = this.projectService.getMapData();
  }

  setView(view: string): void {
    this.currentView = view;
    if (view === 'robot') {
      this.router.navigate(['/statistics/robot']);
    } else {
      this.router.navigate(['/statistics/operation']);
    }
  }

  ngOnInit(): void {
    this.operationPie = [1, 2, 3, 4, 5];
    this.router.navigate(['/statistics/operation']); // Default to operation view
    this.selectedMap = this.projectService.getMapData();
    if (!this.selectedMap) return;
    fetch(
      `http://${environment.API_URL}:${environment.PORT}/stream-data/get-tasks-status/${this.selectedMap.id}`,
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({}),
      }
    )
      .then((response) => {
        // if(!response.ok) throw new Error(`Error occured with status code of : ${response.status}`)
        return response.json();
      })
      .then((data) => {
        if (data.error) return;
        if (!data.map) {
          alert(data.msg);
          return;
        }
        this.operationPie = data.tasksStatus;
        this.cdRef.detectChanges();
        console.log(this.operationPie, data.tasksStatus);
      })
      .catch((error) => {
        console.log('Err occured while getting tasks status : ', error);
      });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase();
    this.filteredRobotActivities = this.robotActivities.filter(
      (activity) =>
        activity.name.toLowerCase().includes(query) ||
        activity.task.toLowerCase().includes(query) ||
        activity.status.toLowerCase().includes(query)
    );
  }

  onSearchNotifications(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase();
    this.filteredNotifications = this.notifications.filter((notification) =>
      notification.message.toLowerCase().includes(query)
    );
  }
}
