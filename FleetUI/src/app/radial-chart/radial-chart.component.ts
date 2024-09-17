import { Component, OnInit } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexDataLabels,
} from 'ng-apexcharts';
import { ProjectService } from '../services/project.service';
import { environment } from '../../environments/environment.development';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  labels: string[];
};

@Component({
  selector: 'app-radial-chart',
  templateUrl: './radial-chart.component.html',
  styleUrls: ['./radial-chart.component.css'],
})
export class RadialChartComponent implements OnInit {
  public chartOptions!: Partial<ChartOptions>;
  roboStatePie: number[] = [0, 0, 0];
  selectedMap: any | null = null;

  constructor(private projectService: ProjectService) {
    this.chartOptions = {
      series: this.roboStatePie,
      chart: {
        height: 350,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '40px',
            },
            value: {
              fontSize: '30px',
            },
            total: {
              show: true,
              label: 'Total',
              formatter: this.getTotalRoboCounts,
              /* formatter: () => {
              return '249';
            }, */
            },
          },
        },
      },
      labels: ['Healthy', 'Inactive', 'Error'],
    };
  }

  async ngOnInit() {
    if (this.selectedMap) return;
    this.selectedMap = this.projectService.getMapData();
    this.roboStatePie = await this.getRobosStates();
    this.chartOptions.series = this.roboStatePie;
    setInterval(async () => {
      this.roboStatePie = await this.getRobosStates();
      this.chartOptions.series = this.roboStatePie;
    }, 1000 * 3);
  }

  getTotalRoboCounts() {
    return '32';
  }

  async getRobosStates(): Promise<number[]> {
    let response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/stream-data/get-robos-state/${this.selectedMap.id}`,
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
      return [0, 0, 0];
    }
    if (!data.map) {
      alert(data.msg);
      return [0, 0, 0];
    }
    if (data.roboStates) return data.roboStates;
    return [0, 0, 0];
  }
}
