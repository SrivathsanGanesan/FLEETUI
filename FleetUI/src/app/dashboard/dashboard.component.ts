import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import domtoimage from 'dom-to-image-more';
import RecordRTC from 'recordrtc';
import { ProjectService } from '../services/project.service';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit {
  ONBtn = false;
  showDashboard = false;
  selectedFloor = 'Floor 1';
  floors = ['Floor 1'];
  zoomLevel = 1.1;
  isPanning = false;
  lastX = 0;
  lastY = 0;
  offsetX = 0;
  offsetY = 0;

  showChart2 = true; // Controls blur effect for Chart2
  showChart3 = true;

  recording = false;
  private recorder: any;
  private stream: MediaStream | null = null; // Store the MediaStream here

  constructor(
    private projectService: ProjectService,
    private cdRef: ChangeDetectorRef
  ) {
    if (!this.projectService.getIsMapSet()) this.onInitMapImg();
  }

  async onInitMapImg() {
    let mapData = this.projectService.getSelectedProject().sites;
    let mapArr = [];
    mapArr = mapData
      .map((sites: any) => {
        for (let map of sites.maps) {
          return {
            id: map.mapId,
            mapName: map.mapName,
            siteName: sites.siteName,
          };
        }
        return null;
      })
      .filter((item: any) => item !== null);

    if (!mapArr.length) return;
    const response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/dashboard/maps/${mapArr[0].mapName}`
    );
    if (!response.ok)
      console.error('Error while fetching map data : ', response.status);
    let data = await response.json();

    this.projectService.setMapData({
      ...mapArr[0],
      imgUrl: data.map.imgUrl,
    });
  }

  toggleONBtn() {
    this.ONBtn = !this.ONBtn;
  }

  getOnBtnImage(): string {
    return this.ONBtn
      ? '../../assets/icons/off.svg'
      : '../../assets/icons/on.svg';
  }

  ngAfterViewInit() {
    this.loadCanvas();
  }

  // guess no need..
  ngOnInit() {
    this.loadCanvas();
  }

  loadCanvas() {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const img = new Image();
      // img.src = this.getFloorMap(this.selectedFloor);
      let imgName = this.projectService.getMapData();
      img.src = `http://${imgName.imgUrl}`;

      img.onload = () => {
        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height =
          canvas.parentElement?.clientHeight || window.innerHeight;
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
    ctx.translate(
      canvasWidth / 2 + this.offsetX,
      canvasHeight / 2 + this.offsetY
    );
    ctx.scale(this.zoomLevel, this.zoomLevel);
    ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
    ctx.restore();
  }

  getFloorMap(floor: string): string {
    switch (floor) {
      case 'Floor 1':
        return '../../assets/maps/Map3.svg';
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
      document.body.style.cursor = 'grabbing';
    }
  }

  panMove = (event: MouseEvent) => {
    if (this.isPanning) {
      const deltaX = event.clientX - this.lastX;
      const deltaY = event.clientY - this.lastY;
      this.lastX = event.clientX;
      this.lastY = event.clientY;

      this.offsetX += deltaX / this.zoomLevel;
      this.offsetY += deltaY / this.zoomLevel;

      this.loadCanvas();
    }
  };

  panEnd = () => {
    document.removeEventListener('mousemove', this.panMove);
    document.removeEventListener('mouseup', this.panEnd);
    if (this.isPanning) {
      document.body.style.cursor = 'grab';
    } else {
      document.body.style.cursor = 'default';
    }
  };

  togglePan() {
    this.isPanning = !this.isPanning;
    document.body.style.cursor = this.isPanning ? 'grab' : 'default';
  }

  captureCanvas() {
    const element = document.getElementsByClassName('container')[0];
    if (element) {
      domtoimage
        .toPng(element)
        .then((dataUrl: string) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'page_capture.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error: Error) => {
          console.error('Error capturing page:', error);
        });
    }
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
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'application', // This may help to limit to the application window
        },
        audio: false,
      });
      this.recorder = new RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/webm',
      });
      this.recorder.startRecording();
      this.stream = stream; // Store the stream reference
    } catch (error) {
      console.error('Error starting screen recording:', error);
      this.recording = false;
    }
  }

  stopRecording() {
    if (this.recorder) {
      this.recorder.stopRecording(() => {
        const blob = this.recorder.getBlob();
        const mp4Blob = new Blob([blob], { type: 'video/mp4' });
        this.invokeSaveAsDialog(mp4Blob, 'recording.mp4');
      });
    }

    // Stop all tracks in the stream to stop sharing
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null; // Clear the stream reference
    }
  }

  invokeSaveAsDialog(blob: Blob, fileName: string) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }
}
