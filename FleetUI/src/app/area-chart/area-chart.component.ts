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
}
setTimeout(() => {
  const paths = document.querySelectorAll('.apexcharts-area-series path');
  paths.forEach((path: any) => {
    path.setAttribute('stroke', '#FF0000');
  });
}, 500); // Ensure the chart has fully rendered before manipulating


