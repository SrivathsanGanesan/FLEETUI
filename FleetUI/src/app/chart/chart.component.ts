import { Component, ViewChild } from "@angular/core";

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
};

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.css"]
})
export class ChartComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [74, 55, 100],
      chart: {
        height: 275,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "20px"
            },
            value: {
              fontSize: "12px"
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "12px",
              formatter: function(w) {
                return "100";
              }
            }
          }
        }
      },
      labels: ["Active Robots", "InActive Robots", "Total Robots"],
      fill: {
        colors: ["#ff7373", "#911515", "#FFFFFF"] // Custom colors for each segment
      }
    };
  }
}
