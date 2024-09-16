import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexMarkers,
  ApexTooltip,
  ApexFill,
  ApexStroke,
} from 'ng-apexcharts';
import { ProjectService } from '../services/project.service';
import { environment } from '../../environments/environment.development';
import { timeStamp } from 'console';
import { timestamp } from 'rxjs';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis?: ApexYAxis;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: ApexTooltip;
  fill: ApexFill;
  stroke: ApexStroke;
  grid?: any;
};

@Component({
  selector: 'app-chart-timeline',
  templateUrl: './chart-timeline.component.html',
  styleUrls: ['./chart-timeline.component.css'],
})
export class ChartTimelineComponent implements OnInit {
  // @ViewChild('chart') chart: ChartComponent | undefined;
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: ChartOptions;

  selectedMetric: string = 'CPU Utilization';
  selectedMap: any | null = null;

  // Updated data sets..
  cpuUtilArr: number[] = [0];
  cpuXaxisSeries: string[] = [];

  roboUtilArr: number[] = [0];
  roboXaxisSeries: string[] = [];

  batteryArr: number[] = [0];
  batteryXaxisSeries: string[] = [];

  memoryArr: number[] = [0];
  memoryXaxisSeries: string[] = [];

  networkArr: number[] = [0];
  networkXaxisSeries: string[] = [];

  idleTimeArr: number[] = [0];
  idleTimeXaxisSeries: string[] = [];

  errorArr: number[] = [0];
  errRateXaxisSeries: string[] = [];

  cpuUtilTimeInterval: any | null = null;
  roboUtilTimeInterval: any | null = null;
  batteryTimeInterval: any | null = null;
  memoryTimeInterval: any | null = null;
  networkTimeInterval: any | null = null;
  idleTimeInterval: any | null = null;
  errTimeInterval: any | null = null;

  constructor(
    private projectService: ProjectService,
    private cdRef: ChangeDetectorRef
  ) {
    // this.chartOptions = this.getChartOptions(this.cpuUtilArr, 'CPU Utilization');
    this.chartOptions = {
      series: [
        {
          name: '',
          data: this.cpuUtilArr,
        },
      ],
      chart: {
        id: 'area-datetime',
        type: 'area',
        height: 230,
        zoom: {
          autoScaleYaxis: true,
        },
      },
      // colors: ['#77B6EA', '#545454'],
      dataLabels: {
        enabled: true,
      },
      markers: {
        size: 0,
      },
      xaxis: {
        type: 'datetime',
        tickAmount: 6,
      },
      yaxis: {},
      tooltip: {
        x: {
          format: 'dd MMM yyyy',
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          colorStops: [
            {
              offset: 0,
              color: '#7854f7',
              opacity: 0.7,
            },
            {
              offset: 100,
              color: '#7854f7',
              opacity: 0.2,
            },
          ],
        },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        colors: ['#7854f7'],
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
    };
  }

  ngOnInit() {
    this.selectedMap = this.projectService.getMapData();
    this.updateChart('data1', 'CPU Utilization');
  }

  updateChart(dataKey: string, metricName: string): void {
    this.selectedMetric = metricName; // Update the displayed metric name

    switch (dataKey) {
      case 'data1':
        this.updateCpuUtil();
        break;
      case 'data2':
        this.updateRoboUtil();
        break;
      case 'data3':
        this.updateBattery();
        break;
      case 'data4':
        this.updateMemory();
        break;
      case 'data5':
        this.updateNetwork();
        break;
      case 'data6':
        this.updateIdleTime();
        break;
      case 'data7':
        this.updateErr();
        break;
    }
  }

  async fetchSeriesData(apiKey: string): Promise<any> {
    try {
      const response = await fetch(
        `http://${environment.API_URL}:${environment.PORT}/graph/${apiKey}/${this.selectedMap.id}`,
        {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({
            timeStamp1: '',
            timeStamp2: '',
          }),
        }
      );
      const data = await response.json();
      if (data.error || !data.map) {
        console.log(data);
        return;
      }
      return data;
    } catch (err) {
      console.log('Err occured :', err);
      return;
    }
  }

  async updateCpuUtil() {
    let temp = [];
    let tempTime = [];
    let data;
    setInterval(async () => {
      data = await this.fetchSeriesData('cpu-utilization'); // data.cpuUtil..
      this.cpuUtilArr.push(data.cpuUtil);
      tempTime.push(new Date().toLocaleTimeString()); // yet to take..
      if (this.cpuUtilArr.length > 12) temp = this.cpuUtilArr.slice(-12);
      else temp = [...this.cpuUtilArr];

      this.chartOptions.series = [{ data: temp }];
      this.chart.updateOptions(
        {
          xaxis: {
            categories: tempTime.length > 12 ? tempTime.slice(-12) : tempTime,
          },
        },
        false,
        true
      );
    }, 1000 * 2);
  }
  async updateRoboUtil() {
    let data = await this.fetchSeriesData('robo-utilization');
    console.log(data);
  }
  async updateBattery() {
    let data = await this.fetchSeriesData('battery');
    console.log(data);
  }
  async updateMemory() {
    let data = await this.fetchSeriesData('memory');
    console.log(data);
  }
  async updateNetwork() {
    let data = await this.fetchSeriesData('network');
    console.log(data);
  }
  async updateIdleTime() {
    let data = await this.fetchSeriesData('idle-time');
    console.log(data);
  }
  async updateErr() {
    let data = await this.fetchSeriesData('robo-err');
    console.log(data);
  }
}
