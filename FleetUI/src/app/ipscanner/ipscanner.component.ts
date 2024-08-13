import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-ipscanner',
  templateUrl: './ipscanner.component.html',
  styleUrls: ['./ipscanner.component.css']  // Changed styleUrl to styleUrls
})
export class IPScannerComponent {
  @Output() close = new EventEmitter<void>();

  ipScanData = [
    { ip: '195.80.116.170', mac: '195.80.116.180', ping: '[n/a]', Status: 'online'},
    { ip: '195.80.116.140', mac: '195.80.116.150', ping: '[n/a]', Status: 'Offline'},
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
