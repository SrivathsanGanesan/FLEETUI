import { Component, AfterViewInit } from '@angular/core';
import html2canvas from 'html2canvas';
import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  ONBtn = false;
  showDashboard = false; // Property to manage dashboard visibility
  selectedFloor = 'Floor 1';
  floors = ['Floor 1'];
  zoomLevel = 1.1; // Initial zoom level
  isPanning = false; // Track panning state
  lastX = 0; // Last x coordinate for panning
  lastY = 0; // Last y coordinate for panning
  offsetX = 0; // Current offset x
  offsetY = 0; // Current offset y

  recording = false;
  private recorder: any;

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
        this.drawImageScaled(ctx, img);
      };
    }
  }

  drawImageScaled(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();
    ctx.translate(canvasWidth / 2 + this.offsetX, canvasHeight / 2 + this.offsetY);
    ctx.scale(this.zoomLevel, this.zoomLevel);
    ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
    ctx.restore();
  }

  getFloorMap(floor: string): string {
    switch (floor) {
      case 'Floor 1':
        return '../../assets/maps/Map1.svg';
      default:
        return '../../assets/maps/Map1.svg';
    }
  }

  onFloorChange(event: Event) {
    this.loadCanvas();
  }

  zoomIn() {
    this.zoomLevel *= 1.2;
    this.loadCanvas();
  }

  zoomOut() {
    this.zoomLevel /= 1.2;
    this.loadCanvas();
  }

  panStart(event: MouseEvent) {
    if (this.isPanning) {
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      document.addEventListener('mousemove', this.panMove);
      document.addEventListener('mouseup', this.panEnd);
      document.body.style.cursor = 'grabbing'; // Change cursor to grabbing
    }
  }

  panMove = (event: MouseEvent) => {
    if (this.isPanning) {
      const deltaX = event.clientX - this.lastX;
      const deltaY = event.clientY - this.lastY;
      this.lastX = event.clientX;
      this.lastY = event.clientY;

      // Adjust the offsets by the amount moved, considering the zoom level
      this.offsetX += deltaX / this.zoomLevel;
      this.offsetY += deltaY / this.zoomLevel;

      this.loadCanvas();
    }
  };

  panEnd = () => {
    document.removeEventListener('mousemove', this.panMove);
    document.removeEventListener('mouseup', this.panEnd);
    if (this.isPanning) {
      document.body.style.cursor = 'grab'; // Reset cursor to grab if panning is still enabled
    } else {
      document.body.style.cursor = 'default'; // Reset cursor to default if panning is disabled
    }
  };

  togglePan() {
    this.isPanning = !this.isPanning;
    document.body.style.cursor = this.isPanning ? 'grab' : 'default';
  }

  captureCanvas() {
    html2canvas(document.body).then(canvas => {
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create a link element
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'page_capture.png';
      
      // Append the link to the document and trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  toggleDashboard() {
    this.showDashboard = !this.showDashboard;
  }

  toggleRecording() {
    this.recording = !this.recording;
    if (this.recording) {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  async startRecording() {
    try {
      const displayMediaOptions: MediaStreamConstraints = {
        video: {
          //@ts-ignore
          mediaSource: 'screen'
        }
      };

      const stream = await (navigator.mediaDevices as any).getDisplayMedia(displayMediaOptions);
      this.recorder = new RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/webm'
      });
      this.recorder.startRecording();
    } catch (error) {
      console.error('Error starting screen recording:', error);
      this.recording = false;
    }
  }

  stopRecording() {
    this.recorder.stopRecording(() => {
      const blob = this.recorder.getBlob();
      invokeSaveAsDialog(blob);
    });
  }
}
