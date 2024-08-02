import { Component, ViewChild } from "@angular/core";

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
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
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.css"]
})
export class ChartComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    const totalRobots = 100; // Define the total number of robots
    const activeRobots = 65; // Define the active robots

    this.chartOptions = {
      series: [activeRobots],
      chart: {
        width: 230,
        height: 250,
        type: "radialBar",
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        radialBar: {
          offsetY: -25,
          startAngle: -200,
          endAngle: 200,
          hollow: {
            margin: 1,
            size: "60%",
            background: "#fff",
            image: undefined,
            position: "front",
          },
          track: {
            background: "#ffe5e5",
            strokeWidth: "70%",
            margin: -5,
          },
          dataLabels: {
            show: true,
            name: {
              offsetY: 85,
              show: true,
              color: "#FF3333",
              fontSize: "10px"
            },
            value: {
              formatter: function(val) {
                return `${activeRobots}/${totalRobots}`;
              },
              offsetY: -5,
              color: "#FF3333",
              fontSize: "25px",
              show: true
            }
          }
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          shadeIntensity: 0.1,
          gradientToColors: ["#FFFFFF"],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
          colorStops: [
            {
              offset: 0,
              color: "#FFB3B3",
              opacity: 1
            },
            {
              offset: 80,
              color: "#FF3333",
              opacity: 1
            }
          ]
        }
      },
      stroke: {
        lineCap: "round"
      },
      labels: ["Number of Active Robots"]
    };
  }
}
