import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { ProjectService } from '../services/project.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent {
  currentView: string = 'operation'; // Default to 'operation'
  operationPie: number[] = [0, 0, 0, 0, 0];
  selectedMap: any | null = null;
  operationActivities: any[] = [];

  // this.operationActivities = [
  // { taskId: 9, taskName: 'AMR-003', task: 'Transporting materials', progress: 90, status: 'Actively Working', },
  // ];

  notifications = [
    { message: 'Low Battery - AMR-001', timestamp: '2024-08-16 14:32' },
    { message: 'Task Assigned - AMR-002', timestamp: '2024-08-16 14:32' },
    { message: 'Obstacle Detected - AMR-003', timestamp: '2024-08-16' },
    { message: 'Obstacle Detected - AMR-003', timestamp: '2024-08-16' },
    { message: 'Obstacle Detected - AMR-003', timestamp: '2024-08-16' },
    { message: 'Obstacle Detected - AMR-003', timestamp: '2024-08-16' },
    // { message: 'Obstacle Detected - AMR-003', timestamp: '2024-08-16' },
  ];

  statisticsData: any = {
    systemThroughput: 0,
    systemThroughputChange: 3.5,
    systemUptime: 0,
    systemUptimeChange: 0.2,
    successRate: 0,
    successRateChange: -1.5,
    responsiveness: 0,
    responsivenessChange: 5.2,
  }; // Initialize the array with mock data

  filteredOperationActivities = this.operationActivities;
  filteredNotifications = this.notifications;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private cdRef: ChangeDetectorRef
  ) {
    if (!this.selectedMap) this.selectedMap = this.projectService.getMapData();
  }

  onViewAllClick() {
    this.router.navigate(['/tasks']); // Navigate to tasks page
  }

  setView(view: string): void {
    this.currentView = view;
    if (view === 'robot') {
      this.router.navigate(['/statistics/robot']);
    } else {
      this.router.navigate(['/statistics/operation']);
    }
  }

  async ngOnInit() {
    this.router.navigate(['/statistics/operation']); // Default to operation view
    this.selectedMap = this.projectService.getMapData();
    if (!this.selectedMap) return;
    this.getGrossStatus();
    this.operationPie = await this.fetchTasksStatus();
    setInterval(async () => {
      this.operationPie = await this.fetchTasksStatus();
    }, 1000 * 2);
    this.operationActivities = await this.fetchCurrTasksStatus();
    this.filteredOperationActivities = this.operationActivities;
    setInterval(async () => {
      let currTasks = await this.fetchCurrTasksStatus();
      this.filteredOperationActivities.push(currTasks[0]);
      // console.log(this.operationActivities);
      // this.filteredOperationActivities = [
      //   ...this.filteredNotifications,
      //   currTasks[0],
      // ];
    }, 1000 * 10);
  }

  async fetchFleetStatus(endpoint: string, bodyData = {}): Promise<any> {
    const response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/fleet-gross-status/${endpoint}`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      }
    );

    return await response.json();
  }

  // async to synchronous...
  async getGrossStatus() {
    const mapId = this.selectedMap.id;

    let throughputData = await this.fetchFleetStatus('system-throughput', {
      mapId: mapId,
    });
    if (throughputData.systemThroughput)
      this.statisticsData.systemThroughput = throughputData.systemThroughput;
    let uptime = await this.fetchFleetStatus('system-uptime', { mapId: mapId });
    if (uptime.systemUptime)
      this.statisticsData.systemUptime = uptime.systemUptime;
    let successRate = await this.fetchFleetStatus('success-rate', {
      mapId: mapId,
    });
    if (successRate.successRate)
      this.statisticsData.successRate = successRate.successRate;
    let responsiveness = await this.fetchFleetStatus('system-responsiveness', {
      mapId: mapId,
    });
    if (responsiveness.systemResponsiveness)
      this.statisticsData.responsiveness = responsiveness.systemResponsiveness;
  }

  async fetchCurrTasksStatus(): Promise<number[]> {
    let response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/fleet-tasks/curr-task-activities`,
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
    if (data.tasks) return data.tasks;
    return [];
  }

  async fetchTasksStatus(): Promise<number[]> {
    let response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/stream-data/get-tasks-status/${this.selectedMap.id}`,
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({}),
      }
    );
    // if(!response.ok) throw new Error(`Error occured with status code of : ${response.status}`)
    let data = await response.json();
    if (data.error) {
      console.log('Err occured while getting tasks status : ', data.error);
      return [0, 0, 0, 0, 0];
    }
    if (!data.map) {
      alert(data.msg);
      return [0, 0, 0, 0, 0];
    }
    if (data.tasksStatus) return data.tasksStatus;
    return [0, 0, 0, 0, 0];
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase();
    this.filteredOperationActivities = this.operationActivities.filter(
      (activity) =>
        activity.taskName.toLowerCase().includes(query) ||
        activity.taskId.toString().toLowerCase().includes(query) ||
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
