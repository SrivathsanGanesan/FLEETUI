import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-robot-detail-popup',
  templateUrl: './robot-detail-popup.component.html',
  styleUrls: ['./robot-detail-popup.component.css']
})
export class RobotDetailPopupComponent {
 
  constructor(
    public dialogRef: MatDialogRef<RobotDetailPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  onPause(): void {
    // Logic for pause action
    console.log('Pausing robot:', this.data.name);
  }
}
