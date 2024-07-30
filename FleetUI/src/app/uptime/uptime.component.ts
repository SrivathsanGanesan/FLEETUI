import { Component, ViewChild } from "@angular/core";

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ChartComponent,
  ApexStroke
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-uptime',
  templateUrl: './uptime.component.html',
  styleUrls: ['./uptime.component.css']
})
export class UptimeComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [67],
      chart: {
        height: 400,
        type: "radialBar",
        offsetY: -10
      },
      plotOptions: {
        radialBar: {
          startAngle: -125,
          endAngle: 125,
          dataLabels: {
            name: {
              fontSize: "16px",
              color: '#ff7373',
              offsetY: 120,
            },
            value: {
              offsetY: 76,
              fontSize: "30px",
              color: undefined,
              formatter: function(val) {
                return val + "%";
              }
            }
          }
        }
      },
      fill: {
        type: "solid",
        colors: ['#ff7373'] // Solid color
      },
      stroke: {
        dashArray: 3, // Remove dash for solid stroke
        colors: ['#ff7373'], // Stroke color
        width: -30 // Increase stroke width
      },
      labels: ["Percent"]
    };
  }
}
