import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Input,
} from '@angular/core';
import { HeatmapService } from '../services/heatmap-service.service';
import HeatMap from 'heatmap-ts';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrl: './heatmap.component.css',
})
export class HeatmapComponent {
  @ViewChild('heatmapContainer', { static: true }) containerRef!: ElementRef;
  @Input() height: number | undefined;
  @Input() width: number | undefined;

  heatmapInstance: any | null = null;
  private heatmapId = 'heatMap';

  constructor(private heatmapService: HeatmapService) {}

  ngOnInit() {
    const container = this.containerRef.nativeElement;

    this.heatmapService.createHeatmap(this.heatmapId, container, {
      maxOpacity: 0.6,
      radius: 20,
      blur: 0.9,
      width: this.width,
      height: this.height,
      // width: container.offsetWidth,
      // height: container.offsetHeight,
    });

    this.heatmapService.addHeatmapData(
      this.heatmapId,
      this.generateRandomData(500)
    );
  }

  // ngAfterViewInit(): void {
  // const container = this.containerRef.nativeElement;
  // this.heatmapService.createHeatmap('mainHeatmap', container, {
  //   blur: 0.9,
  //   opacity: 0.5,
  //   visible: true,
  // });
  // // Set random data
  // this.heatmapInstance =
  //   this.heatmapService.getHeatmapInstance('mainHeatmap');
  // }

  private generateRandomData(len: number): any {
    const max = 10;
    const min = 1;
    const maxX = this.containerRef.nativeElement.offsetWidth; // Width of the container
    const maxY = this.containerRef.nativeElement.offsetHeight; // Height of the container
    const data = [];
    while (len--) {
      data.push({
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY),
        value: 5,
      });
    }
    return { max, min, data };
  }

  private resizeHeatmap(): void {
    const container = this.containerRef.nativeElement;
    this.heatmapService.resizeHeatmap(
      this.heatmapId,
      container.offsetWidth,
      container.offsetHeight
    );
  }
}
