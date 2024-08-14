import { Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexFill,
  ApexDataLabels
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.css']
})
export class AreaChartComponent implements OnInit {
  public chartOptions: ChartOptions;

  constructor() {
    // Initialize the chartOptions with default values
    this.chartOptions = {
      series: [{
        name: "Series 1",
        data: [45, 52, 38, 45, 19, 23, 2]
      }],
      chart: {
        height: 280,
        type: "area"
      },
      xaxis: {
        categories: ["01 Jan", "02 Jan", "03 Jan", "04 Jan", "05 Jan", "06 Jan", "07 Jan"]
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100]
        }
      },
      dataLabels: {
        enabled: false
      }
    };
  }

  ngOnInit(): void {
    // Any additional logic can go here
  }
}
