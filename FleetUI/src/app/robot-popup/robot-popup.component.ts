import { Component, Input, Output, EventEmitter  } from '@angular/core';

@Component({
  selector: 'app-robot-popup',
  templateUrl: './robot-popup.component.html',
  styleUrl: './robot-popup.component.css'
})
export class RobotPopupComponent {
  @Input() isVisible: boolean = false;
  @Input() robots: any[] = [];
  @Output() close = new EventEmitter<void>();

  closePopup() {
    this.close.emit();
  }
  selectedRobots: any[] = [];

  onRobotSelect(robot: any, event: any) {
    if (event.target.checked) {
      this.selectedRobots.push(robot);
    } else {
      this.selectedRobots = this.selectedRobots.filter(r => r.id !== robot.id);
    }
  }
  
  addSelectedRobots() {
    const selectedRobots = this.robots.filter(robot => robot.selected);
    console.log('Selected Robots:', selectedRobots);
    this.close.emit();  // Close the popup after adding robots
  }
}
