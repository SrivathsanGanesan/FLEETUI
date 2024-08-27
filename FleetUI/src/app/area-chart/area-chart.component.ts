import { Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexFill,
  ApexDataLabels,
  ApexYAxis,
  ApexTooltip,
  ApexGrid,
  ApexStroke
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  grid: ApexGrid;
};

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.css']
})
export class AreaChartComponent implements OnInit {
  public chartOptions: ChartOptions;
  selectedMetric: string = 'Throughput'; // Default value


  constructor() {
    this.chartOptions = {
      series: [{
        name: "Series 1",
        data: [45, 52, 38, 45, 19, 23, 50]
      }],
      chart: {
        height: 280,
        type: "area",
        background: "#FFFFFF" // Setting the background color to white
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        labels: {
          style: {
            colors: '#9aa0ac',
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#9aa0ac',
            fontSize: '12px'
          }
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0.9,
          stops: [0, 100],
          colorStops: [
            {
              offset: 0,
              color: "#FF0000",
              opacity: 0.5
            },
            {
              offset: 100,
              color: "#FFE5E5",
              opacity: 0.1
            }
          ]
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        colors: ["#DA2127"] // This is the key change: making sure the stroke is red
      },
      tooltip: {
        enabled: true,
        theme: "dark",
        x: {
          format: "dd MMM"
        }
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        }
      }
    };
  }

  ngOnInit(): void {
    // Any additional logic can go here
  }

  updateChart(data: string, metricName: string): void {
    this.selectedMetric = metricName; // Update the displayed metric name

    switch (data) {
      case 'data1':
        this.chartOptions.series = [{ name: "Series 1", data: [45, 52, 38, 45, 19, 23, 50] }];
        this.chartOptions.xaxis.categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
        break;
      case 'data2':
        this.chartOptions.series = [{ name: "Series 2", data: [30, 40, 45, 50, 49, 60, 70] }];
        this.chartOptions.xaxis.categories = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
        break;
      case 'data3':
        this.chartOptions.series = [{ name: "Series 3", data: [20, 29, 37, 36, 44, 45, 50] }];
        this.chartOptions.xaxis.categories = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
        break;
      case 'data4':
        this.chartOptions.series = [{ name: "Series 4", data: [15, 18, 28, 29, 39, 46, 55] }];
        this.chartOptions.xaxis.categories = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
        break;
      case 'data5':
        this.chartOptions.series = [{ name: "Series 5", data: [50, 60, 55, 48, 38, 33, 45] }];
        this.chartOptions.xaxis.categories = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
        break;
    }
  }
}
