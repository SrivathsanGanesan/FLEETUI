import { Component, ViewChild } from "@angular/core";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
  colors: string[];
};

@Component({
  selector: 'app-throughput',
  templateUrl: './throughput.component.html',
  styleUrls: ['./throughput.component.css']
})
export class ThroughputComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public averagePercentage: number = 0;

  constructor() {
    const seriesData = {
      hourlyDataSeries1: {
        picks: [110, 91, 55, 101, 129, 122, 69, 91, 148],
        datestime: [
          "2024-09-18T00:00:00.000Z",
          "2024-09-18T01:00:00.000Z",
          "2024-09-18T02:00:00.000Z",
          "2024-09-18T03:00:00.000Z",
          "2024-09-18T04:00:00.000Z",
          "2024-09-18T05:00:00.000Z",
          "2024-09-18T06:00:00.000Z",
          "2024-09-18T07:00:00.000Z",
          "2024-09-18T08:00:00.000Z"
        ]
      }
    };
    const totalPicks = seriesData.hourlyDataSeries1.picks.reduce((acc, val) => acc + val, 0);
    const numberOfDataPoints = seriesData.hourlyDataSeries1.picks.length;
    this.averagePercentage = totalPicks / numberOfDataPoints;
    this.chartOptions = {
      series: [
        {
          name: "Picks",
          data: seriesData.hourlyDataSeries1.picks,
          color: "#FF3333" // Set the color here
        }
      ],
      chart: {
        type: "area",
        height: 235,
        width: 595,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth" // Consider changing to 'smooth' for a different look
      },
      title: {
        text: "ThroughPut",
        align: "left",
        style: {
          fontFamily: "Arial, Helvetica, sans-serif",
          fontWeight: "bold",
          fontSize: "18px" // Adjust size as needed
        }
      },
      subtitle: {
        text: "Picks Per Hour",
        align: "left",
        style: {
          fontFamily: "Arial, Helvetica, sans-serif",
          fontWeight: "bold",
          fontSize: "10px" // Adjust size as needed
        }
      },
      labels: seriesData.hourlyDataSeries1.datestime,
      xaxis: {
        type: "datetime",
        tickAmount: 10, // Adjust the number of ticks displayed
        labels: {
          format: "HH:mm" // Format for hourly display
        },
        title: {
          // text: "Time",
          // style: {
          //   fontFamily: "Arial, Helvetica, sans-serif",
          //   fontWeight: "bold",
          //   fontSize: "10px"
          // }
        }
      },
      yaxis: {
        opposite: true,
        title: {
          // text: "Picks",
          // style: {
          //   fontFamily: "Arial, Helvetica, sans-serif",
          //   fontWeight: "bold",
          //   fontSize: "10px"
          // }
        }
      },
      
      legend: {
        horizontalAlign: "left",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontWeight: "bold",
        fontSize: "8px" // Adjust size as needed
      }
    };
  }
}
