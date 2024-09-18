import {
  Component,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  
} from '@angular/core';
import domtoimage from 'dom-to-image-more';
import RecordRTC from 'recordrtc';
import { ProjectService } from '../services/project.service';
import { environment } from '../../environments/environment.development';
import { UptimeComponent } from '../uptime/uptime.component';
import { ThroughputComponent } from '../throughput/throughput.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild(UptimeComponent) UptimeComponent!: UptimeComponent;
  @ViewChild(ThroughputComponent) throughputComponent!: ThroughputComponent;

  eventSource!: EventSource;
  ONBtn = false;
  showDashboard = false;
  selectedFloor = 'Floor 1';
  floors = ['Floor 1'];
  zoomLevel = 0.9;
  isPanning = false;
  lastX = 0;
  lastY = 0;
  offsetX = 0;
  offsetY = 0;
  mapDetails:any | null = null;
  nodes:any[]= [];
  edges:any[]=[];
  zones:any[]=[];
  assets:any[]=[];
  startX = 0;
  startY = 0;
  showChart2 = true; // Controls blur effect for Chart2
  showChart3 = true;

  recording = false;
  private recorder: any;
  private stream: MediaStream | null = null; // Store the MediaStream here
  showModelCanvas: boolean = false;  // Initially hide the modelCanvas
  constructor(
    private projectService: ProjectService,
    private cdRef: ChangeDetectorRef
  ) {
    if (this.projectService.getIsMapSet()) return;
    this.onInitMapImg(); // yet to remove..
  }

  async ngAfterViewInit() {
    
    this.loadCanvas();
    await this.getMapDetails();
    // if (this.showModelCanvas) {
    //   // this.cdRef.detectChanges(); // Detect changes to ensure DOM is ready
    //   this.loadModelCanvas();     // Safely load the modelCanvas
    // }
  }

  async getMapDetails() {
    let mapData = this.projectService.getMapData();
    let response = await fetch(`http://${environment.API_URL}:${environment.PORT}/dashboard/maps/${mapData.mapName}`);
    if (!response.ok) throw new Error(`Error with status code of ${response.status}`);
    let data = await response.json();
    if (!data.map) return;
    mapData = data.map;
    
    this.nodes = mapData.nodes;
    this.edges = mapData.edges;
    this.assets = mapData.assets;
    this.zones = mapData.zones;
  }
  

  // guess no need..
  async ngOnInit() {
    if (this.projectService.getIsMapSet()) return;
    await this.onInitMapImg();
    this.loadCanvas();
  }

  async onInitMapImg() {
    let project = this.projectService.getSelectedProject();
    let mapArr = [];
    // console.log(project);

    const response = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/fleet-project/${project._id}`,
      { credentials: 'include' }
    );
    if (!response.ok)
      console.error('Error while fetching map data : ', response.status);
    let data = await response.json();
    let projectSites = data.project.sites;
    mapArr = projectSites
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
    const mapResponse = await fetch(
      `http://${environment.API_URL}:${environment.PORT}/dashboard/maps/${mapArr[0].mapName}`
    );
    let mapData = await mapResponse.json();
    this.projectService.setMapData({
      ...mapArr[0],
      imgUrl: mapData.map.imgUrl,
    });
    this.loadCanvas();
  }

  // start-stop the operation!
  startStopOpt() {
    if (this.UptimeComponent) this.UptimeComponent.getUptimeIfOn(); // call the uptime comp function
    if (this.throughputComponent) this.throughputComponent.getThroughPutIfOn();
  }

  toggleONBtn() {
    this.ONBtn = !this.ONBtn;
    if (this.ONBtn) this.getliveAmrPos();
    if (!this.ONBtn) this.eventSource.close(); // try take of it..
  }

  getOnBtnImage(): string {
    return this.ONBtn
      ? '../../assets/icons/off.svg'
      : '../../assets/icons/on.svg';
  }

  async toggleModelCanvas() {
    this.showModelCanvas = !this.showModelCanvas;
    if(!this.showModelCanvas) {
      this.nodes = [];
    }
    else await this.getMapDetails()
    this.loadCanvas();  // Redraw the canvas based on the updated state
  }


  getliveAmrPos() {
    const URL = `http://${environment.API_URL}:${environment.PORT}/stream-data/live-AMR-pos`;
    if (this.eventSource) this.eventSource.close();

    this.eventSource = new EventSource(URL);
    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data);
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      this.eventSource.close();
    };
  }

  loadCanvas() {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
  
      if (ctx) {
      const img = new Image();
      let imgName = this.projectService.getMapData();
      img.src = `http://${imgName.imgUrl}`;

      img.onload = () => {
        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        this.draw(ctx, img);
      
        // // Conditionally draw nodes based on showModelCanvas flag
        // if (this.showModelCanvas) {
        //   this.nodes.forEach((node) => {
        //     this.drawNode(ctx, node.nodePosition.x, node.nodePosition.y, node.nodeId);
        //   });
        // }
      };
    }
  }
 
    draw(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
      const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Calculate the position to center the image
      const imgWidth = img.width * this.zoomLevel;
      const imgHeight = img.height * this.zoomLevel;

      const centerX = (canvas.width - imgWidth) / 2 + this.offsetX;
      const centerY = (canvas.height - imgHeight) / 2 + this.offsetY;
      // Apply transformation for panning and zooming
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(this.zoomLevel, this.zoomLevel);

      // Draw the image
      ctx.drawImage(img, 0, 0);

      if(!this.showModelCanvas) return;
      // Draw nodes on the image
      this.nodes.forEach((node) => {
        const transformedY = img.height - node.nodePosition.y;
        this.drawNode(ctx, node.nodePosition.x, transformedY, node.nodeId);
      });
      
      // Draw edges between nodes
      this.edges.forEach((edge) => {
        const startNode = this.nodes.find(n => n.nodeId === edge.startNodeId);
        const endNode = this.nodes.find(n => n.nodeId === edge.endNodeId);
        if (startNode && endNode) {
          const startPos = { x: startNode.nodePosition.x, y: startNode.nodePosition.y };
          const endPos = { x: endNode.nodePosition.x, y: endNode.nodePosition.y };
          const transformedStartY = img.height - startPos.y;
          const transformedEndY = img.height - endPos.y;
          this.drawEdge(ctx,
            { x: startPos.x, y: transformedStartY }, 
            { x: endPos.x, y: transformedEndY }, 
            edge.direction, 
            edge.startNodeId, 
            edge.endNodeId,
            
          );
          
        }
        console.log(edge.direction)
      });
    // ctx.restore(); // Reset transformation after drawing
  }
  private drawEdge(
    ctx: CanvasRenderingContext2D,
    startPos: { x: number; y: number },
    endPos: { x: number; y: number },
    direction: string,
    nodeRadius: number = 10,
    threshold: number = 5
  ): void {
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const startX = startPos.x + (dx * threshold) / distance;
    const startY = startPos.y + (dy * threshold) / distance;
    const endX = endPos.x - (dx * threshold) / distance;
    const endY = endPos.y - (dy * threshold) / distance;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    
    if (direction === 'UN_DIRECTIONAL') {
      ctx.strokeStyle = 'black'; // Uni-directional in black
    } else if (direction === 'BI_DIRECTIONAL') {
      ctx.strokeStyle = 'green'; // Bi-directional in green
    }
    ctx.lineWidth = 2;
    ctx.stroke();

    this.drawArrowhead(ctx, { x: startX, y: startY }, { x: endX, y: endY }, direction);

    if (direction === 'BI_DIRECTIONAL') {
      this.drawArrowhead(ctx, { x: endX, y: endY }, { x: startX, y: startY }, direction);
    }
    
  }  
  private drawArrowhead(
    ctx: CanvasRenderingContext2D,
    from: { x: number; y: number },
    to: { x: number; y: number },
    direction: string
  ): void {
    const headLength = 15; // Length of the arrowhead
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
  
    // Calculate the arrowhead points
    const arrowheadPoint1 = {
      x: to.x - headLength * Math.cos(angle - Math.PI / 6),
      y: to.y - headLength * Math.sin(angle - Math.PI / 6),
    };
    const arrowheadPoint2 = {
      x: to.x - headLength * Math.cos(angle + Math.PI / 6),
      y: to.y - headLength * Math.sin(angle + Math.PI / 6),
    };
  
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(arrowheadPoint1.x, arrowheadPoint1.y);
    ctx.lineTo(arrowheadPoint2.x, arrowheadPoint2.y);
    ctx.lineTo(to.x, to.y);
  
    // Change arrowhead color based on direction
    if (direction === 'UN_DIRECTIONAL') {
      ctx.fillStyle = 'black'; // Uni-directional arrowhead in black
    } else if (direction === 'BI_DIRECTIONAL') {
      ctx.fillStyle = 'green'; // Bi-directional arrowhead in green
    }
  
    ctx.fill();
  }
  
  drawNode(ctx: CanvasRenderingContext2D, x: number, y: number, label: string) { 
    // Set node style (for example, circle)
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI); // Draw circle with radius 10
    ctx.fillStyle = '#00f'; // Blue color
    ctx.fill();
  
    // Add a label to the node
    ctx.fillStyle = '#000'; // Black text color
    ctx.font = '12px Arial';
    ctx.fillText(label, x + 12, y); // Place label slightly right to the node
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
  // Rest of your existing component methods like panStart(), toggleONBtn(), etc.
  panStartModelCanvas(event: MouseEvent) {
    // Handle pan start for modelCanvas
    console.log('Panning on Model Canvas', event);
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
  handleZoom(event: WheelEvent) {
    event.preventDefault();
    const zoomIntensity = 0.1;
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    const mouseX = event.clientX - canvas.offsetLeft;
    const mouseY = event.clientY - canvas.offsetTop;
    const zoom = event.deltaY > 0 ? 1 - zoomIntensity : 1 + zoomIntensity;

    this.offsetX -= (mouseX - this.offsetX) * (zoom - 1);
    this.offsetY -= (mouseY - this.offsetY) * (zoom - 1);
    this.zoomLevel *= zoom;

    if (ctx) this.draw(ctx, new Image());
  }
  togglePan() {
    this.isPanning = !this.isPanning;
    document.body.style.cursor = this.isPanning ? 'grab' : 'default';
  }

  captureCanvas() {
    const element = document.getElementsByClassName('container')[0];
    console.log('Container element:', element); // Log the container to check if it exists
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
    } else {
      console.error('Container element not found.');
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
