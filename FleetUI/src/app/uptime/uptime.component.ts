import { Component, ViewChild } from "@angular/core";
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ApexAnnotations,
  ChartComponent
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  annotations: ApexAnnotations;
};

@Component({
  selector: 'app-uptime',
  templateUrl: './uptime.component.html',
  styleUrls: ['./uptime.component.css']
})
export class UptimeComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> & {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    plotOptions: ApexPlotOptions;
    fill: ApexFill;
    annotations: ApexAnnotations;
  };

  constructor() {
    this.chartOptions = {
      series: [74],
      chart: {
        type: "radialBar",
        height: 300, // Chart height
        width: 300, // Chart width
        offsetY: 0
      },
      plotOptions: {
        radialBar: {
          startAngle: -100,
          endAngle: 100,
          track: {
            background: "#7E7777",
            strokeWidth: "100%",
            margin: 0,
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              opacity: 0.31,
              blur: 5
            }
          },
          dataLabels: {
            name: {
              show: true, // Show the name
              offsetY: -10,
              fontSize: "15px" // Adjust font size
            },
            value: {
              offsetY: 20, // Adjust position to below the chart
              fontSize: "30px",
              color: "#ff7373", // Color of the value text
              formatter: function(val) {
                return val + "%"; // Add percentage symbol
              }
            }
          }
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          shadeIntensity: 0.4,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 53, 91],
          colorStops: [
            {
              offset: 0,
              color: "#ff7373",
              opacity: 1
            },
            {
              offset: 100,
              color: "#ff7373",
              opacity: 1
            }
          ]
        }
      },
      labels: [""],
      annotations: {
        yaxis: [
          {
            y: 0,
            borderColor: "#ff7373",
            label: {
              borderColor: "#ff7373",
              style: {
                color: "#fff",
                background: "#ff7373",
                fontSize: "12px" // Reduced font size
              },
              text: "0%",
              offsetX: -10 // Move the label to the left
            }
          },
          {
            y: 100,
            borderColor: "#ff7373",
            label: {
              borderColor: "#ff7373",
              style: {
                color: "#fff",
                background: "#ff7373",
                fontSize: "12px" // Reduced font size
              },
              text: "100%",
              offsetX: 10 // Move the label to the right
            }
          }
        ]
      }
    };
  }
}
