import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import DataModule from 'highcharts/modules/data';
import ExportingModule from 'highcharts/modules/exporting';
import ExportDataModule from 'highcharts/modules/export-data';
import FullScreenModule from 'highcharts/modules/full-screen';

DataModule(Highcharts);
ExportingModule(Highcharts);
ExportDataModule(Highcharts);
FullScreenModule(Highcharts);

@Component({
  selector: 'app-robot-chart',
  templateUrl: './robot-chart.component.html',
  styleUrls: ['./robot-chart.component.css']
})
export class RobotChartComponent implements OnInit {

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  defaultData: string = 'https://demo-live-data.highcharts.com/time-data.csv';
  urlInput: string = this.defaultData;
  pollingEnabled: boolean = true;
  pollingTime: number = 1;

  constructor() { }

  ngOnInit(): void {
    this.createChart();
  }

  createChart(): void {
    Highcharts.chart(this.chartContainer.nativeElement, {
      chart: {
        type: 'areaspline'
      },
      title: {
        text: 'Live Data'
      },
      accessibility: {
        announceNewData: {
          enabled: true,
          minAnnounceInterval: 15000,
          announcementFormatter: (_allSeries: any, _newSeries: any, newPoint: { y: string; }) => {
            if (newPoint) {
              return 'New point added. Value: ' + newPoint.y;
            }
            return false;
          }
        }
      },
      plotOptions: {
        areaspline: {
          color: '#32CD32',
          fillColor: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, '#32CD32'],
              [1, '#32CD3200']
            ]
          },
          threshold: null,
          marker: {
            lineWidth: 1,
            lineColor: null,
            fillColor: 'white'
          }
        }
      },
      data: {
        csvURL: this.urlInput || this.defaultData,
        enablePolling: this.pollingEnabled,
        dataRefreshRate: Math.max(1, this.pollingTime || 1)
      },
      exporting: {
        enabled: true, // Enable exporting options
        buttons: {
          contextButton: {
            menuItems: [
              'viewFullscreen',
              'printChart',
              'separator',
              'downloadPNG',
              'downloadJPEG',
              'downloadPDF',
              'downloadSVG',
              'separator',
              'downloadCSV',
              'downloadXLS'
            ]
          }
        }
      },
      fullscreen: {
        enabled: true // Enable fullscreen mode
      }
    } as unknown as Highcharts.Options);
  }

  onPollingChange(): void {
    if (this.pollingTime < 1 || !this.pollingTime) {
      this.pollingTime = 1;
    }
    this.createChart();
  }

  onUrlChange(): void {
    this.createChart();
  }

  onPollingToggle(): void {
    this.createChart();
  }
}
