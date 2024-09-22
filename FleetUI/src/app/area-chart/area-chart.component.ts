import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexFill,
  ApexDataLabels,
  ApexYAxis,
  ApexTooltip,
  ApexGrid,
  ApexStroke,
  ChartComponent,
} from 'ng-apexcharts';
import { environment } from '../../environments/environment.development';
import { ProjectService } from '../services/project.service';

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
  styleUrls: ['./area-chart.component.css'],
})
export class AreaChartComponent implements OnInit {
  currentFilter: string = 'today'; // To track the selected filter

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: ChartOptions;
  selectedMetric: string = 'Throughput'; // Default value
  selectedMap: any | null = null;
  [key: string]: any; // index signature..

  throughputArr: number[] = [0];
  throughputXaxisSeries: string[] = [];

  starvationArr: number[] = [0];
  starvationXaxisSeries: string[] = [];

  pickAccuracyArr: number[] = [0];
  pickAccXaxisSeries: string[] = [];

  errRateArr: number[] = [0];
  errRateXaxisSeries: string[] = [];

  throuputTimeInterval: any | null = null;
  starvationTimeInterval: any | null = null;
  taskAllocationTimeInterval: any | null = null;
  pickAccTimeInterval: any | null = null;
  errRateTimeInterval: any | null = null;

  intervals: string[] = [
    'throuputTimeInterval',
    'starvationTimeInterval',
    'pickAccTimeInterval',
    'errRateTimeInterval',
  ];

  constructor(
    private projectService: ProjectService,
    private cdRef: ChangeDetectorRef
  ) {
    this.chartOptions = {
      series: [
        {
          name: '',
          data: this.throughputArr,
        },
      ],
      chart: {
        height: 250,
        type: 'area',
        background: '#FFFFFF',
      },
      xaxis: {
        categories: [], // Your default categories
        labels: {
          style: {
            colors: '#9aa0ac',
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#9aa0ac',
            fontSize: '12px',
          },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0.9,
          stops: [0, 100],
          colorStops: [
            {
              offset: 0,
              color: '#32CD32',
              opacity: 0.5,
            },
            {
              offset: 100,
              color: '#32CD3200',
              opacity: 0.1,
            },
          ],
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        colors: ['#32CD32'], // This is the key change: making sure the stroke is red
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        x: {
          format: 'dd MMM',
        },
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
    };
  }

  ngOnInit(): void {
    this.selectedMap = this.projectService.getMapData();
    this.updateChart('data1', 'Throughput');
  }

  updateChart(dataKey: string, metricName: string): void {
    this.selectedMetric = metricName; // Update the displayed metric name

    switch (dataKey) {
      case 'data1':
        this.updateThroughput();
        break;
      case 'data2':
        this.updateStarvationRate();
        break;
      case 'data3':
        this.updatePickAccuracy();
        break;
      case 'data4':
        this.updateErrorRate();
        break;
    }
  }

  applyFilter(event: any) {
    this.currentFilter = event.target.value.toLowerCase();

    // this.intervals.forEach((interval) => {
    //   if (this[interval]) {
    if (this.selectedMetric === 'Throughput')
      this.updateChart('data1', this.selectedMetric);
    else if (this.selectedMetric === 'Starvation rate')
      this.updateChart('data2', this.selectedMetric);
    else if (this.selectedMetric === 'Pick accuracy')
      this.updateChart('data3', this.selectedMetric);
    else if (this.selectedMetric === 'Erorr rate')
      this.updateChart('data4', this.selectedMetric);
    // return;
    // }
    // });
  }

  plotChart(seriesName: string, data: any[], time: any[], limit: number = 12) {
    const limitedData = data.length > limit ? data.slice(-limit) : data;
    const limitedTime = time.length > limit ? time.slice(-limit) : time;

    // this.chartOptions.series = [{ name: seriesName, data: limitedData }];
    this.chart.updateOptions(
      {
        series: [{ name: seriesName, data: limitedData }],
        xaxis: { categories: limitedTime },
      },
      false, // Don't replot the entire chart
      true // Smooth transitions
    );
  }

  async fetchChartData(
    endpoint: string,
    timeSpan: string,
    startTime: string, // alter to date..
    endTime: string
  ) {
    const response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/graph/${endpoint}/${this.selectedMap.id}`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeSpan: timeSpan, // e.g. 'Daily' or 'Weekly'
          startTime: startTime,
          endTime: endTime,
        }),
      }
    );
    return await response.json();
  }

  async updateThroughput() {
    // this.chartOptions.xaxis.range = 12; // get use of it..
    if (this.currentFilter === 'week' || this.currentFilter === 'month') {
      clearInterval(this.throuputTimeInterval);
      const data = await this.fetchChartData(
        'throughput',
        this.currentFilter,
        '',
        ''
      );
      let seriesData = [];
      let seriesTime = [];

      if (data.throughput) {
        seriesData = data.throughput.map((stat: any) => stat.rate);
        seriesTime = data.throughput.map((stat: any) => stat.time);
      }
      this.plotChart('Throughput', seriesData, seriesTime, 30);
      return;
    }

    if (!this.selectedMap && this.throuputTimeInterval) return;

    const data = await this.fetchChartData(
      'throughput',
      this.currentFilter,
      '',
      ''
    );

    if (data.throughput) {
      this.throughputArr = data.throughput.map((stat: any) => stat.rate);
      this.throughputXaxisSeries = data.throughput.map(
        (stat: any) => stat.time
      );
    }
    this.plotChart(
      'Throughput',
      this.throughputArr,
      this.throughputXaxisSeries
    ); // this.selectedMetric..

    this.throuputTimeInterval = setInterval(async () => {
      const data = await this.fetchChartData(
        'throughput',
        this.currentFilter,
        '',
        ''
      );
      if (data.throughput) {
        this.throughputArr = data.throughput.map((stat: any) => stat.rate);
        this.throughputXaxisSeries = data.throughput.map(
          (stat: any) => stat.time
        );
      }
      this.plotChart(
        'Throughput',
        this.throughputArr,
        this.throughputXaxisSeries
      );
    }, 1000 * 2);
  }

  async updateStarvationRate() {
    // this.chartOptions.xaxis.range = 12;
    let startTime = new Date().setHours(0, 0, 0, 0); // set current time to starting time of the current day..
    let endTime = new Date().setMilliseconds(0); // time in milliseconds..
    if (this.currentFilter === 'week' || this.currentFilter === 'month') {
      clearInterval(this.starvationTimeInterval);
      const data = await this.fetchChartData(
        'starvationrate',
        this.currentFilter,
        '',
        ''
      );
      let seriesData = [];
      let seriesTime = [];

      if (data.starvation) {
        seriesData = data.starvation.map((stat: any) => stat.rate);
        seriesTime = data.starvation.map((stat: any) => stat.time);
      }
      this.plotChart('Starvation rate', seriesData, seriesTime, 30);
      return;
    }

    if (!this.selectedMap && this.starvationTimeInterval) return;

    const data = await this.fetchChartData(
      'starvationrate',
      this.currentFilter,
      '',
      ''
    );
    if (data.starvation) {
      this.starvationArr = data.starvation.map((stat: any) => stat.rate);
      this.starvationXaxisSeries = data.starvation.map(
        (stat: any) => stat.time
      );
    }
    this.plotChart(
      'Starvation rate',
      this.starvationArr,
      this.starvationXaxisSeries
    ); // this.selectedMetric..

    if (this.currentFilter !== 'daily') return;
    this.starvationTimeInterval = setInterval(async () => {
      const data = await this.fetchChartData(
        'starvationrate',
        this.currentFilter,
        '',
        ''
      );
      if (data.starvation) {
        this.starvationArr = data.starvation.map((stat: any) => stat.rate);
        this.starvationXaxisSeries = data.starvation.map(
          (stat: any) => stat.time
        );
      }
      this.plotChart(
        'Starvation rate',
        this.starvationArr,
        this.starvationXaxisSeries
      );
    }, 1000 * 2);
  }

  async updatePickAccuracy() {
    let startTime = new Date().setHours(0, 0, 0, 0); // set current time to starting time of the current day..
    let endTime = new Date().setMilliseconds(0); // time in milliseconds..
    if (this.currentFilter === 'week' || this.currentFilter === 'month') {
      clearInterval(this.pickAccTimeInterval);
      const data = await this.fetchChartData(
        'pickaccuracy',
        this.currentFilter,
        '',
        ''
      );
      let seriesData = [];
      let seriesTime = [];

      if (data.pickAccuracy) {
        seriesData = data.pickAccuracy.map((stat: any) => stat.rate);
        seriesTime = data.pickAccuracy.map((stat: any) => stat.time);
      }
      this.plotChart('Pick accuracy', seriesData, seriesTime, 30);
      return;
    }

    if (!this.selectedMap && this.pickAccTimeInterval) return;

    const data = await this.fetchChartData(
      'pickaccuracy',
      this.currentFilter,
      '',
      ''
    );
    if (data.pickAccuracy) {
      this.pickAccuracyArr = data.pickAccuracy.map((stat: any) => stat.rate);
      this.pickAccXaxisSeries = data.pickAccuracy.map((stat: any) => stat.time);
    }
    this.plotChart(
      'Pick accuracy',
      this.pickAccuracyArr,
      this.pickAccXaxisSeries
    );

    if (this.currentFilter !== 'daily') return;
    this.pickAccTimeInterval = setInterval(async () => {
      const data = await this.fetchChartData(
        'pickaccuracy',
        this.currentFilter,
        '',
        ''
      );
      if (data.pickAccuracy) {
        this.pickAccuracyArr = data.pickAccuracy.map((stat: any) => stat.rate);
        this.pickAccXaxisSeries = data.pickAccuracy.map(
          (stat: any) => stat.time
        );
      }
      this.plotChart(
        'Pick accuracy',
        this.pickAccuracyArr,
        this.pickAccXaxisSeries
      );
    }, 1000 * 2);
  }

  async updateErrorRate() {
    let startTime = new Date().setHours(0, 0, 0, 0); // set current time to starting time of the current day..
    let endTime = new Date().setMilliseconds(0); // time in milliseconds..
    if (this.currentFilter === 'week' || this.currentFilter === 'month') {
      clearInterval(this.errRateTimeInterval);
      const data = await this.fetchChartData(
        'err-rate',
        this.currentFilter,
        '',
        ''
      );
      let seriesData = [];
      let seriesTime = [];

      if (data.errRate) {
        seriesData = data.errRate.map((stat: any) => stat.rate);
        seriesTime = data.errRate.map((stat: any) => stat.time);
      }
      this.plotChart('Error rate', seriesData, seriesTime, 30);
      return;
    }

    if (!this.selectedMap && this.errRateTimeInterval) return;

    try {
      const data = await this.fetchChartData(
        'err-rate',
        this.currentFilter,
        '',
        ''
      );
      if (data.errRate) {
        this.errRateArr = data.errRate.map((stat: any) => stat.rate);
        this.errRateXaxisSeries = data.errRate.map((stat: any) => stat.time);
      }
      this.plotChart('Error rate', this.errRateArr, this.errRateXaxisSeries); // this.selectedMetric..

      if (this.currentFilter !== 'daily') return;
      this.errRateTimeInterval = setInterval(async () => {
        const data = await this.fetchChartData(
          'err-rate',
          this.currentFilter,
          '',
          ''
        );
        if (data.errRate) {
          this.errRateArr = data.errRate.map((stat: any) => stat.rate);
          this.errRateXaxisSeries = data.errRate.map((stat: any) => stat.time);
        }
        this.plotChart('Error rate', this.errRateArr, this.errRateXaxisSeries);
      }, 1000 * 2);
    } catch (err) {
      console.log('Err occured here : ', err);
    }
  }

  clearAllIntervals(currInterval: any) {
    this.intervals.forEach((interval) => {
      if (currInterval !== this[interval]) {
        clearInterval(this[interval]);
        this[interval] = 0;
      }
    });
  }
}
