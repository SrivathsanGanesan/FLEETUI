import { Component, OnInit } from '@angular/core';
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

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Series 1',
          data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47, 33], // Your default data
        },
      ],
      chart: {
        height: 230,
        type: 'area',
        background: '#FFFFFF', // Setting the background color to white
      },
      xaxis: {
        categories: [
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
        ], // Your default categories
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
    // Any additional logic can go here
  }

  updateChart(dataKey: string, metricName: string): void {
    this.selectedMetric = metricName; // Update the displayed metric name

    switch (dataKey) {
      case 'data1':
        this.chartOptions.series = [
          {
            name: 'Series 1',
            data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47, 33],
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
        break;
      case 'data2':
        this.chartOptions.series = [
          {
            name: 'Series 2',
            data: [60, 75, 50, 80, 55, 70, 45, 60, 55, 75, 65],
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
        break;
      case 'data3':
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
        break;
      case 'data4':
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
        break;
      case 'data5':
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
        break;
    }
  }
}
