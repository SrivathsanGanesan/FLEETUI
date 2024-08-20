import { Component, OnInit, Input } from '@angular/core';
import { ApexNonAxisChartSeries, ApexResponsive, ApexChart, ApexPlotOptions, ApexDataLabels, ApexFill, ApexLegend, ApexTitleSubtitle } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-gradient-donut',
  templateUrl: './gradient-donut.component.html',
  styleUrls: ['./gradient-donut.component.css']
})
export class GradientDonutComponent implements OnInit {
  @Input() series: ApexNonAxisChartSeries = [44, 55, 41, 17, 15];
  @Input() chartWidth: number = 450;
  @Input() startAngle: number = -90;
  @Input() endAngle: number = 270;
  @Input() dataLabelsEnabled: boolean = false;
  @Input() fillType: string = 'gradient';
  @Input() titleText: string = 'Total activities';
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
          endAngle: this.endAngle
        }
      },
      dataLabels: {
        enabled: this.dataLabelsEnabled
      },
      fill: {
        type: this.fillType
      },
      legend: {
        formatter: this.legendFormatter
      },
      title: {
        text: this.titleText
      },
      responsive: this.responsive
    };
  }
}
