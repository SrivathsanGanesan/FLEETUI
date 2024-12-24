import { Injectable } from '@angular/core';
import HeatMap from 'heatmap-ts';

@Injectable({
  providedIn: 'root',
})
export class HeatmapService {
  private heatmapInstances: Map<string, any> = new Map();

  constructor() {}

  createHeatmap(id: string, container: HTMLElement, config: any): void {
    const heatmapInstance = new HeatMap({ ...config, container });
    this.heatmapInstances.set(id, heatmapInstance);
  }

  getHeatmapInstance(id: string): HeatMap | undefined {
    return this.heatmapInstances.get(id);
  }

  addHeatmapData(id: string, data: any): void {
    const heatmapInstance = this.heatmapInstances.get(id);
    if (heatmapInstance) {
      heatmapInstance.setData(data);
    }
  }

  updateHeatmapData(id: string, points: any[]): void {
    const heatmapInstance = this.heatmapInstances.get(id);
    if (heatmapInstance) {
      heatmapInstance.addData(points);
    }
  }

  resizeHeatmap(id: string, width: number, height: number): void {
    const heatmapInstance = this.heatmapInstances.get(id);
    if (heatmapInstance) {
      const canvas = heatmapInstance.getCanvas();
      canvas.width = width;
      canvas.height = height;
      heatmapInstance.repaint();
    }
  }
}
