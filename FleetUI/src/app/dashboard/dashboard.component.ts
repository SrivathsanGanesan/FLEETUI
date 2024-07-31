import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  ONBtn = false;
  selectedFloor = 'Floor 1';
  floors = ['Floor 1', 'Floor 2', 'Floor 3', 'Floor 4'];

  toggleONBtn() {
    this.ONBtn = !this.ONBtn;
  }

  getOnBtnImage(): string {
    return this.ONBtn ? '../../assets/icons/off.svg' : '../../assets/icons/on.svg';
  }

  ngAfterViewInit() {
    this.loadCanvas();
  }

  loadCanvas() {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const img = new Image();
      img.src = this.getFloorMap(this.selectedFloor);

      img.onload = () => {
        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  }

  getFloorMap(floor: string): string {
    switch(floor) {
      case 'Floor 1':
        return '../../assets/maps/Map1.svg';
      case 'Floor 2':
        return '../../assets/maps/Map2.svg';
      case 'Floor 3':
        return '../../assets/maps/Map3.svg';
        case 'Floor 4':
          return '../../assets/maps/Map4.svg';
      default:
        return '../../assets/maps/Map1.svg';
    }
  }

  onFloorChange(event: Event) {
    this.loadCanvas();
  }
}
