import { Component, ViewChild } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ApexStroke,
  ChartComponent
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
  selector: 'app-chart1',
  templateUrl: './chart1.component.html',
  styleUrls: ['./chart1.component.css']
})
export class Chart1Component {
  @ViewChild("chart") chart!: ChartComponent;
  
  public chartOptions: Partial<ChartOptions>;
  public activeRobots: number = 63; // Example active robots count
  public totalRobots: number = 100; // Example total robots count

  constructor() {
    const activeToTotal = `${this.activeRobots} / ${this.totalRobots}`; // Format as 'activeRobots / totalRobots'

    this.chartOptions = {
      series: [this.activeRobots], // Display active robots value as the radial bar value
      chart: {
        width: 270,
        height: 270,
        type: "radialBar",
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: 0,
          endAngle: 360,
          hollow: {
            margin: 0,
            size: "50%",
            background: "#fff",
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              blur: 4,
              opacity: 0.24
            }
          },
          track: {
            background: "#FFE5E5",
            strokeWidth: "100%",
            margin: 0
          },
          dataLabels: {
            show: true,
            name: {
              offsetY: 80,
              show: false,  // Hide the name label
            },
            value: {
              formatter: function(val) {
                return activeToTotal;  // Display 'activeRobots/totalRobots'
              },
              offsetY: 10,
              color: "#F71717",
              fontSize: "22px",
              fontWeight: "semibold",  // Make the text bold
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
              color: "#D30000",
              opacity: 1
            },
            {
              offset: 80,
              color: "#FF8585",
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
