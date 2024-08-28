import { Component, ViewChild, Input } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ChartComponent,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
};

@Component({
  selector: 'app-uptime',
  templateUrl: './uptime.component.html',
  styleUrls: ['./uptime.component.css'],
})
export class UptimeComponent {
  @ViewChild('chart') chart!: ChartComponent;
  @Input() ONBtn!: boolean;
  public chartOptions: Partial<ChartOptions>;

  uptimePercentage: number = 0;

  constructor() {
    this.chartOptions = {
      series: [this.uptimePercentage],
      chart: {
        width: 280, // Increased width
        height: 320, // Increased height
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          offsetY: -15,
          offsetX: -20,
          startAngle: -90,
          endAngle: 90,
          hollow: {
            size: '70%', // Adjust the hollow size to reduce the bar width
          },
          track: {
            background: '#e7e7e7',
            strokeWidth: '70%',
            margin: 1, // margin is in pixels
          },
          dataLabels: {
            name: {
              show: true,
              offsetY: 45, // Adjusted to fit the larger chart size
              fontSize: '16px', // Increased font size
              color: '#FF3333',
            },
            value: {
              offsetY: 0, // Adjusted to fit the larger chart size
              fontSize: '40px', // Increased font size
              color: '#FF3333',
            },
          },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          shadeIntensity: 0.4,
          gradientToColors: ['#FFB3B3'],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
          colorStops: [
            {
              offset: 0,
              color: '#FFB3B3',
              opacity: 1,
            },
            {
              offset: 100,
              color: '#FF3333',
              opacity: 1,
            },
          ],
        },
      },
      labels: ['Average Time'],
    };
  }

  ngOnInit() {}

  getUptime() {
    if (this.ONBtn) {
      // alter the logic, cz of toggling function in button..
      this.chartOptions.series = [0];
      return;
    }
    fetch('http://localhost:3000/dashboard/uptime/map123')
      .then((response) => response.json())
      .then((data) => {
        this.chartOptions.series = [data.percentage];
      })
      .catch((error) => console.log(error));

    // console.log(this.uptimePercentage);
  }
}
