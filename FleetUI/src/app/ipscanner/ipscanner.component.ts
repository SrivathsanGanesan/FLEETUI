import { Component, EventEmitter, Output } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { error } from 'console';

@Component({
  selector: 'app-ipscanner',
  templateUrl: './ipscanner.component.html',
  styleUrls: ['./ipscanner.component.css'], // Changed styleUrl to styleUrls
})
export class IPScannerComponent {
  @Output() close = new EventEmitter<void>();
  eventSource!: EventSource;
  startIP: string = '0.0.0.0';
  EndIP: string = '0.0.0.0';

  ipScanData = [
    {
      ip: '195.80.116.170',
      mac: '00:00:00:00:00:00',
      ping: '[n/a]',
      Status: 'Offline',
    },
    {
      ip: '195.80.116.140',
      mac: 'B4-45-06-55-A9-47',
      ping: '[n/a]',
      Status: 'Online',
    },
  ];
  showIPScannerPopup = false;

  openIPScanner() {
    this.showIPScannerPopup = true;
  }
  startScanning() {
    this.startIP = (
      document.getElementById('ipRangeFrom') as HTMLInputElement
    ).value;
    this.EndIP = (
      document.getElementById('ipRangeTo') as HTMLInputElement
    ).value;
    if (this.startIP === '' || this.EndIP === '') {
      alert('Enter valid Ip');
      return;
    }
    const ipv4Regex =
      /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipv4Regex.test(this.startIP) || !ipv4Regex.test(this.EndIP)) {
      alert('not valid IP Try again');
      return;
    }
    fetch(
      `http://${environment.API_URL}:${environment.PORT}/fleet-config/scan-ip`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ip: { startIP: this.startIP, endIP: this.EndIP },
        }),
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');

        this.eventSource = new EventSource(
          `http://${environment.API_URL}:${environment.PORT}/fleet-config/scan-ip`
        );
        this.eventSource.onmessage = (event: any) => {
          const data = JSON.parse(event.data);
          console.log('here we go : ', event);
        };

        this.eventSource.onerror = (error: any) => {
          console.error('SSE error:', error);
          this.eventSource.close();
        };
      })
      .catch((err) => console.log('err occ : ', err));
  }
  stopScanning() {
    this.eventSource.close();
    return;
  }

  closeIPScanner() {
    this.showIPScannerPopup = false;
    this.close.emit(); // Emitting the close event
  }
}
