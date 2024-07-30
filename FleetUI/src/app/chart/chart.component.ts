import { Component, ViewChild } from "@angular/core";
import { ChartComponent as ApexChartComponent } from "ng-apexcharts";
import { ApexNonAxisChartSeries, ApexResponsive, ApexChart, ApexFill, ApexStroke, ApexLegend, ApexPlotOptions } from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: string[];
  fill: ApexFill;
  stroke: ApexStroke;
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.css"]
})
export class ChartComponent {
  @ViewChild("chart") chart!: ApexChartComponent;
  public chartOptions: Partial<ChartOptions> | any;

  constructor() {
    const totalRobots = 100;
    const activeRobots = 64; // Update this value as needed

    this.chartOptions = {
      series: [activeRobots, totalRobots - activeRobots],
      chart: {
        type: "donut"
      },
      labels: ["Active Robots", "Inactive Robots"],
      colors: ["#ff7373", "#7E7777"], // Active robots and inactive robots colors
      
      fill: {
        colors: ["#ff7373", "#7E7777"],
        type: 'solid' // Ensures the color fill is solid
      },
      
      stroke: {
        show: false
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Robots',
                formatter: () => totalRobots.toString(),
                color: '#000000',
                fontSize: '10px'
              }
            },
            dropShadow: {
              enabled: true,
              top: 2,
              left: 2,
              blur: 5,
              opacity: 0.5
            }
          }
        }
      },
      legend: {
        show: false // Hide legend
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              show: false // Hide legend for responsive too
            }
          }
        }
      ]
    };
  }
}
