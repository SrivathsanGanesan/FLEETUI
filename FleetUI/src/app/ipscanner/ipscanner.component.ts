import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-ipscanner',
  templateUrl: './ipscanner.component.html',
  styleUrls: ['./ipscanner.component.css']  // Changed styleUrl to styleUrls
})
export class IPScannerComponent {
  @Output() close = new EventEmitter<void>();

  ipScanData = [
    { ip: '195.80.116.170', ping: '18 ms', hostname: '[n/a]', ports: '[n/a]', webDetect: '[n/a]' },
    { ip: '195.80.116.171', ping: '16 ms', hostname: '[n/a]', ports: '443', webDetect: '[n/a]' },
  ];
  showIPScannerPopup = false;

  openIPScanner() {
    this.showIPScannerPopup = true;
  }

  closeIPScanner() {
    this.showIPScannerPopup = false;
    this.close.emit();  // Emitting the close event
  }
}
