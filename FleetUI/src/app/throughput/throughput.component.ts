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
  styles:  string[];
};

@Component({
  selector: 'app-throughput',
  templateUrl: './throughput.component.html',
  styleUrls: ['./throughput.component.css']
})
export class ThroughputComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    const seriesData = {
      monthDataSeries1: {
        picks: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        datestime: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-20T00:00:00.000Z",
          "2018-09-21T00:00:00.000Z",
          "2018-09-22T00:00:00.000Z",
          "2018-09-23T00:00:00.000Z",
          "2018-09-24T00:00:00.000Z",
          "2018-09-25T00:00:00.000Z",
          "2018-09-26T00:00:00.000Z",
          "2018-09-27T00:00:00.000Z"
        ]
      }
    };

    this.chartOptions = {
      series: [
        {
          name: "Picks",
          data: seriesData.monthDataSeries1.picks,
          color: "#ff7373" // Set the color here
        }
      ],
      chart: {
        type: "area",
        height: 280,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "ThroughPut",
        align: "left",
        style: {
          fontFamily: "Arial",
          fontSize: "16px", // Adjust font size as needed
          fontWeight: "bolder"
        }
      },
      subtitle: {
        text: "Picks Per Day",
        align: "left",
        style: {
          fontFamily: "Arial",
          fontSize: "12px", // Adjust font size as needed
          fontWeight: "normal"
        }
      },
      labels: seriesData.monthDataSeries1.datestime,
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            fontFamily: "Arial",
            fontSize: "12px", // Adjust font size as needed
            fontWeight: "normal"
          }
        }
      },
      yaxis: {
        opposite: true,
        labels: {
          style: {
            fontFamily: "Arial",
            fontSize: "12px", // Adjust font size as needed
            fontWeight: "normal"
          }
        }
      },
      legend: {
        horizontalAlign: "left",
        
      }
    };
  }
}
