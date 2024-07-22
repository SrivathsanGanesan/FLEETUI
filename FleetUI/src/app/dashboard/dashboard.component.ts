// dashboard.component.ts
import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  ONBtn = false;

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
      img.src = '../../assets/maps/Map1.svg';

      img.onload = () => {
        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  }
}
