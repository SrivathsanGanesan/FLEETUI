import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-ipscanner',
  templateUrl: './ipscanner.component.html',
  styleUrls: ['./ipscanner.component.css']  // Changed styleUrl to styleUrls
})
export class IPScannerComponent {
  @Output() close = new EventEmitter<void>();

  ipScanData = [
    { ip: '195.80.116.170', mac: '00:00:00:00:00:00', ping: '[n/a]', Status: 'Offline'},
    { ip: '195.80.116.140', mac: 'B4-45-06-55-A9-47', ping: '[n/a]', Status: 'Online'},
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
