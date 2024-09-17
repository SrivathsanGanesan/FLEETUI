import { Component, OnInit } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexDataLabels
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  labels: string[];
};

@Component({
  selector: 'app-radial-chart',
  templateUrl: './radial-chart.component.html',
  styleUrls: ['./radial-chart.component.css']
})
export class RadialChartComponent implements OnInit {
  public chartOptions!: Partial<ChartOptions>;

  constructor() {}

  ngOnInit(): void {
    this.chartOptions = {
      series: [44, 55, 67],
      chart: {
        height: 320,
        type: 'radialBar'
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '22px'
            },
            value: {
              fontSize: '16px'
            },
            total: {
              show: true,
              label: 'Total',
              formatter: () => {
                return '249';
              }
            }
          }
        }
      },
      labels: ['Healthy', 'Inactive', 'Error', ]
    };
  }
}
