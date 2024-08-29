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

  // Updated data sets
  cpuData = [
    { x: new Date(2024, 0, 1), y: 30 },
    { x: new Date(2024, 0, 2), y: 40 },
    { x: new Date(2024, 0, 3), y: 35 },
    { x: new Date(2024, 0, 4), y: 50 },
    { x: new Date(2024, 0, 5), y: 49 },
    { x: new Date(2024, 0, 6), y: 55 },
    { x: new Date(2024, 0, 7), y: 60 },
    { x: new Date(2024, 0, 8), y: 70 },
    { x: new Date(2024, 0, 9), y: 65 },
    { x: new Date(2024, 0, 10), y: 80 }
  ];
  
  robotUtilizationData = [
    { x: new Date(2024, 0, 1), y: 60 },
    { x: new Date(2024, 0, 2), y: 55 },
    { x: new Date(2024, 0, 3), y: 65 },
    { x: new Date(2024, 0, 4), y: 70 },
    { x: new Date(2024, 0, 5), y: 75 },
    { x: new Date(2024, 0, 6), y: 80 },
    { x: new Date(2024, 0, 7), y: 85 },
    { x: new Date(2024, 0, 8), y: 90 },
    { x: new Date(2024, 0, 9), y: 95 },
    { x: new Date(2024, 0, 10), y: 100 }
  ];
  
  batteryData = [
    { x: new Date(2024, 0, 1), y: 90 },
    { x: new Date(2024, 0, 2), y: 88 },
    { x: new Date(2024, 0, 3), y: 85 },
    { x: new Date(2024, 0, 4), y: 80 },
    { x: new Date(2024, 0, 5), y: 78 },
    { x: new Date(2024, 0, 6), y: 75 },
    { x: new Date(2024, 0, 7), y: 72 },
    { x: new Date(2024, 0, 8), y: 70 },
    { x: new Date(2024, 0, 9), y: 68 },
    { x: new Date(2024, 0, 10), y: 65 }
  ];
  
  memoryData = [
    { x: new Date(2024, 0, 1), y: 10 },
    { x: new Date(2024, 0, 2), y: 20 },
    { x: new Date(2024, 0, 3), y: 30 },
    { x: new Date(2024, 0, 4), y: 40 },
    { x: new Date(2024, 0, 5), y: 50 },
    { x: new Date(2024, 0, 6), y: 60 },
    { x: new Date(2024, 0, 7), y: 70 },
    { x: new Date(2024, 0, 8), y: 80 },
    { x: new Date(2024, 0, 9), y: 90 },
    { x: new Date(2024, 0, 10), y: 100 }
  ];
  
  networkData = [
    { x: new Date(2024, 0, 1), y: 20 },
    { x: new Date(2024, 0, 2), y: 25 },
    { x: new Date(2024, 0, 3), y: 30 },
    { x: new Date(2024, 0, 4), y: 35 },
    { x: new Date(2024, 0, 5), y: 40 },
    { x: new Date(2024, 0, 6), y: 45 },
    { x: new Date(2024, 0, 7), y: 50 },
    { x: new Date(2024, 0, 8), y: 55 },
    { x: new Date(2024, 0, 9), y: 60 },
    { x: new Date(2024, 0, 10), y: 65 }
  ];
  
  idleTimeData = [
    { x: new Date(2024, 0, 1), y: 5 },
    { x: new Date(2024, 0, 2), y: 7 },
    { x: new Date(2024, 0, 3), y: 6 },
    { x: new Date(2024, 0, 4), y: 8 },
    { x: new Date(2024, 0, 5), y: 10 },
    { x: new Date(2024, 0, 6), y: 9 },
    { x: new Date(2024, 0, 7), y: 7 },
    { x: new Date(2024, 0, 8), y: 8 },
    { x: new Date(2024, 0, 9), y: 9 },
    { x: new Date(2024, 0, 10), y: 10 }
  ];
  
  errorData = [
    { x: new Date(2024, 0, 1), y: 1 },
    { x: new Date(2024, 0, 2), y: 2 },
    { x: new Date(2024, 0, 3), y: 3 },
    { x: new Date(2024, 0, 4), y: 4 },
    { x: new Date(2024, 0, 5), y: 5 },
    { x: new Date(2024, 0, 6), y: 4 },
    { x: new Date(2024, 0, 7), y: 3 },
    { x: new Date(2024, 0, 8), y: 2 },
    { x: new Date(2024, 0, 9), y: 1 },
    { x: new Date(2024, 0, 10), y: 0 }
  ];
  


  // You can continue to update the other datasets similarly...

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
      // colors: ['#77B6EA', '#545454'],
        dataLabels: {
          enabled: true,
          
      },
      markers: {
        size: 0,
      },
      xaxis: {
        type: 'datetime',
        tickAmount: 6
      },
      yaxis: {},
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
              color: '#7854f7',
              opacity: 0.7
            },
            {
              offset: 100,
              color: '#7854f7',
              opacity: 0.2
            }
          ]
        }
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
}
