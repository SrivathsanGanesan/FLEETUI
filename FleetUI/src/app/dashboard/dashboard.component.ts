// dashboard.component.ts
import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] // Note the plural 'styleUrls'
})
export class DashboardComponent implements AfterViewInit {
  ngAfterViewInit() {
    this.loadCanvas();
  }

  loadCanvas() {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const img = new Image();
      img.src = '../../assets/maps/Map1.svg'; // Update this to the path of your image

      img.onload = () => {
        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  }
}
