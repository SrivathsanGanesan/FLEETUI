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
    this.chartOptions = {
      series: [65],
      chart: {
        width:250,
        height: 250,
        type: "radialBar",
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        radialBar: {
          offsetY: -15,
          startAngle: -200,
          endAngle: 200,
          hollow: {
            margin: 1,
            size: "70%",
            background: "#fff",
            image: undefined,
            position: "front",
            // dropShadow: {
            //   enabled: true,
            //   top: 5,
            //   left: 0,
            //   blur: 4,
            //   opacity: 0.24
            // }
          },
          track: {
            background: "#ffe5e5",
            strokeWidth: "70%",
            margin: -8, // margin is in pixels
            // dropShadow: {
            //   enabled: true,
            //   top: -3,
            //   left: 0,
            //   blur: 4,
            //   opacity: 0.35
            // }
          },

          dataLabels: {
            show: true,
            name: {
              offsetY: 30,
              show: true,
              color: "#FF7373",
              fontSize: "10px"
            },
            value: {
              formatter: function(val) {
                return parseInt(val.toString(), 10).toString();
              },
              offsetY: -15,
              color: "#FF7373",
              fontSize: "40px",
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
          shadeIntensity: 0.5,
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
              color: "#D30000",
              opacity: 1
            }
          ]
        }
      },
      stroke: {
        lineCap: "round"
      },
      labels: ["Active Robots"]
    };
  }
}
