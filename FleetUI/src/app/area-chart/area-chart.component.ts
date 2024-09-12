import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexFill,
  ApexDataLabels,
  ApexYAxis,
  ApexTooltip,
  ApexGrid,
  ApexStroke,
} from 'ng-apexcharts';
import { environment } from '../../environments/environment.development';
import { ProjectService } from '../services/project.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  grid: ApexGrid;
};

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.css'],
})
export class AreaChartComponent implements OnInit {
  public chartOptions: ChartOptions;
  selectedMetric: string = 'Throughput'; // Default value
  selectedMap: any | null = null;

  throughputArr: number[] = [0];
  throughputXaxisSeries: string[] = [];

  starvationArr: number[] = [0];
  starvationXaxisSeries: string[] = [];

  throuputTimeInterval: any | null = null;
  starvationTimeInterval: any | null = null;
  taskAllocationTimeInterval: any | null = null;
  pickAccTimeInterval: any | null = null;
  errRateTimeInterval: any | null = null;

  constructor(
    private projectService: ProjectService,
    private cdRef: ChangeDetectorRef
  ) {
    this.chartOptions = {
      series: [
        {
          name: '',
          data: this.throughputArr,
        },
      ],
      chart: {
        height: 230,
        type: 'area',
        background: '#FFFFFF',
      },
      xaxis: {
        categories: [], // Your default categories
        labels: {
          style: {
            colors: '#9aa0ac',
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#9aa0ac',
            fontSize: '12px',
          },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0.9,
          stops: [0, 100],
          colorStops: [
            {
              offset: 0,
              color: '#32CD32',
              opacity: 0.5,
            },
            {
              offset: 100,
              color: '#32CD3200',
              opacity: 0.1,
            },
          ],
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        colors: ['#32CD32'], // This is the key change: making sure the stroke is red
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        x: {
          format: 'dd MMM',
        },
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

  ngOnInit(): void {
    this.selectedMap = this.projectService.getMapData();
    this.updateChart('data1', 'Throughput');
  }

  updateChart(dataKey: string, metricName: string): void {
    this.selectedMetric = metricName; // Update the displayed metric name

    switch (dataKey) {
      case 'data1':
        this.updateThroughput();
        break;
      case 'data2':
        this.updateStarvationRate();
        break;
      case 'data3':
        this.updateTaskAllocation();
        break;
      case 'data4':
        this.updatePickAccuracy();
        break;
      case 'data5':
        this.updateErrorRate();
        break;
    }
  }

  async updateThroughput() {
    if (!this.selectedMap || this.throuputTimeInterval) return;
    this.clearAllIntervals(this.throuputTimeInterval);

    const response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/graph/throughput/${this.selectedMap.id}`,
      {
        method: 'POST',
        credentials: 'include',
      }
    );
    const data = await response.json();

    if (data.throughput && data.throughput.Stat)
      this.throughputArr = data.throughput.Stat.map((stat: any) => {
        let time = new Date(stat.TimeStamp).toLocaleString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        });

        this.throughputXaxisSeries = [...this.throughputXaxisSeries, time];
        // this.throughputXaxisSeries.push(time);
        return stat.TotalThroughPutPerHour;
      });

    this.chartOptions.series = [{ data: this.throughputArr }];
    this.chartOptions.xaxis = { categories: this.throughputXaxisSeries };

    // this.cdRef.detectChanges();
  }

  async updateStarvationRate() {
    if (!this.selectedMap || this.starvationTimeInterval) return;
    this.clearAllIntervals(this.starvationTimeInterval);
    try {
      this.starvationTimeInterval = setInterval(async () => {
        let response = await fetch(
          `http://${environment.API_URL}:${environment.PORT}/graph/starvationrate/${this.selectedMap.id}`,
          {
            method: 'POST',
            credentials: 'include',
          }
        );
        let data = await response.json();
        if (!data.map) {
          clearInterval(this.starvationTimeInterval);
          return;
        }
        this.starvationArr.push(data.starvation);
        this.starvationXaxisSeries = [
          ...this.starvationXaxisSeries,
          new Date().toDateString(),
        ];
        if (this.starvationArr.length > 5) {
          this.starvationArr.shift();
          this.starvationXaxisSeries.shift();
        }

        this.chartOptions.series = [{ data: this.starvationArr }];
        this.chartOptions.xaxis.categories = this.starvationXaxisSeries;

        // this.cdRef.detectChanges();
      }, 1000 * 1.5);
    } catch (err) {
      console.log('Err occured here : ', err);
    }
  }

  async updateTaskAllocation() {
    if (!this.selectedMap || this.taskAllocationTimeInterval) return;
    this.clearAllIntervals(this.taskAllocationTimeInterval);
    this.chartOptions.series = [
      {
        name: 'Series 3',
        data: [35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
      },
    ];
    this.chartOptions.xaxis.categories = [
      'Dec 01',
      'Dec 02',
      'Dec 03',
      'Dec 04',
      'Dec 05',
      'Dec 06',
      'Dec 07',
      'Dec 08',
      'Dec 09',
      'Dec 10',
      'Dec 11',
    ];
  }

  updatePickAccuracy() {
    this.chartOptions.series = [
      {
        name: 'Series 4',
        data: [50, 60, 55, 70, 65, 80, 75, 85, 90, 95, 100],
      },
    ];
    this.chartOptions.xaxis.categories = [
      'Dec 01',
      'Dec 02',
      'Dec 03',
      'Dec 04',
      'Dec 05',
      'Dec 06',
      'Dec 07',
      'Dec 08',
      'Dec 09',
      'Dec 10',
      'Dec 11',
    ];
  }

  updateErrorRate() {
    this.chartOptions.series = [
      {
        name: 'Series 5',
        data: [25, 35, 45, 55, 65, 75, 85, 95, 100, 110, 120],
      },
    ];
    this.chartOptions.xaxis.categories = [
      'Dec 01',
      'Dec 02',
      'Dec 03',
      'Dec 04',
      'Dec 05',
      'Dec 06',
      'Dec 07',
      'Dec 08',
      'Dec 09',
      'Dec 10',
      'Dec 11',
    ];
  }

  clearAllIntervals(currInterval: any) {
    if (currInterval !== this.throuputTimeInterval) {
      clearInterval(this.throuputTimeInterval);
      this.throuputTimeInterval = 0;
    }
    if (currInterval !== this.starvationTimeInterval) {
      clearInterval(this.starvationTimeInterval);
      this.starvationTimeInterval = 0;
    }
    if (currInterval !== this.taskAllocationTimeInterval) {
      clearInterval(this.taskAllocationTimeInterval);
      this.taskAllocationTimeInterval = 0;
    }
    if (currInterval !== this.pickAccTimeInterval) {
      clearInterval(this.pickAccTimeInterval);
      this.pickAccTimeInterval = 0;
    }
    if (currInterval !== this.errRateTimeInterval) {
      clearInterval(this.errRateTimeInterval);
      this.errRateTimeInterval = 0;
    }
  }
}
