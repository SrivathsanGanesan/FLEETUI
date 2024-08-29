import { Component, OnInit, ViewChild } from '@angular/core';
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
  ApexStroke
} from 'ng-apexcharts';

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
  styleUrls: ['./chart-timeline.component.css']
})
export class ChartTimelineComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent | undefined;
  public chartOptions: ChartOptions;

  selectedMetric: string = 'CPU Utilization';

  // Sample data for each metric
  cpuData = [
    { x: new Date(2024, 0, 1), y: 30 },
    { x: new Date(2024, 0, 2), y: 65 },
    { x: new Date(2024, 0, 3), y: 75 }
  ];

  robotUtilizationData = [
    { x: new Date(2024, 0, 1), y: 60 },
    { x: new Date(2024, 0, 2), y: 55 },
    { x: new Date(2024, 0, 3), y: 60 }
  ];

  batteryData = [
    { x: new Date(2024, 0, 1), y: 90 },
    { x: new Date(2024, 0, 2), y: 85 },
    { x: new Date(2024, 0, 3), y: 80 }
  ];

  memoryData = [
    { x: new Date(2024, 0, 1), y: 10 },
    { x: new Date(2024, 0, 2), y: 45 },
    { x: new Date(2024, 0, 3), y: 42 }
  ];

  networkData = [
    { x: new Date(2024, 0, 1), y: 30 },
    { x: new Date(2024, 0, 2), y: 35 },
    { x: new Date(2024, 0, 3), y: 32 }
  ];

  idleTimeData = [
    { x: new Date(2024, 0, 1), y: 20 },
    { x: new Date(2024, 0, 2), y: 25 },
    { x: new Date(2024, 0, 3), y: 22 }
  ];

  errorData = [
    { x: new Date(2024, 0, 1), y: 5 },
    { x: new Date(2024, 0, 2), y: 10 },
    { x: new Date(2024, 0, 3), y: 7 }
  ];

  constructor() {
    this.chartOptions = this.getChartOptions(this.cpuData, 'CPU Utilization');
  }

  ngOnInit(): void {}

  updateChart(data: any[], metricName: string): void {
    this.selectedMetric = metricName;
    this.chartOptions = this.getChartOptions(data, metricName);
  }

  getChartOptions(data: any[], metricName: string): ChartOptions {
    return {
      series: [{
        name: metricName,
        data: data
      }],
      chart: {
        id: 'area-datetime',
        type: 'area',
        height: 280,
        zoom: {
          autoScaleYaxis: true
        }
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
      },
      xaxis: {
        type: 'datetime',
        tickAmount: 6
      },
      yaxis: {},  // Ensuring yaxis is always defined
      tooltip: {
        x: {
          format: 'dd MMM yyyy'
        }
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
              color: '#FF0000',
              opacity: 0.7
            },
            {
              offset: 100,
              color: '#FF6666',
              opacity: 0.2
            }
          ]
        }
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        colors: ['#DA2127'], // This is the key change: making sure the stroke is red
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    };
  }
}
