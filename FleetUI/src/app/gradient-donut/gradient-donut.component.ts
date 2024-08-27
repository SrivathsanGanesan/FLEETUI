import { Component, OnInit, Input } from '@angular/core';
import { 
  ApexNonAxisChartSeries, 
  ApexResponsive, 
  ApexChart, 
  ApexPlotOptions, 
  ApexDataLabels, 
  ApexFill, 
  ApexLegend, 
  ApexTitleSubtitle 
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  legend: ApexLegend;
  labels: string[];
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-gradient-donut',
  templateUrl: './gradient-donut.component.html',
  styleUrls: ['./gradient-donut.component.css']
})
export class GradientDonutComponent implements OnInit {
  @Input() series: ApexNonAxisChartSeries = [];
  @Input() labels: string[] = ["Approved", "Pending", "Under review", "Rejected"];  // Labels for each segment
  @Input() chartWidth: number = 430;
  @Input() startAngle: number = -90;
  @Input() endAngle: number = 270;
  @Input() dataLabelsEnabled: boolean = false;
  @Input() fillType: string = 'gradient';
  @Input() titleText: string = 'Total activities';
  @Input() legendFontSize: string = '17px'; // New input for legend font size
  @Input() dataLabelFontSize: string = '14px'; // New input for data label font size
  @Input() responsive: ApexResponsive[] = [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }];
  @Input() legendFormatter: (val: string, opts: any) => string = (val: string, opts: any) => {
    return val + " - " + opts.w.globals.series[opts.seriesIndex];
  };

  public chartOptions: Partial<ChartOptions> | any;

  constructor() {
    this.chartOptions = {};
  }

  ngOnInit(): void {
    this.chartOptions = {
      series: this.series,
      chart: {
        width: this.chartWidth,
        type: 'donut'
      },
      plotOptions: {
        pie: {
          startAngle: this.startAngle,
          endAngle: this.endAngle,
        }
      },
      dataLabels: {
        enabled: this.dataLabelsEnabled,
        style: {
          fontSize: this.dataLabelFontSize, // Set font size for data labels
        }
      },
      fill: {
        type: this.fillType
      },
      legend: {
        fontSize: this.legendFontSize, // Set font size for legend labels
        formatter: this.legendFormatter
      },
      labels: this.labels, // Assigning the labels here
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      title: {
        text: this.titleText
      }
    };
  }
}
