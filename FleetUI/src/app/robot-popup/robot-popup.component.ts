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
  @Output() addRobot = new EventEmitter<any[]>(); // Emit an array of selected robots

  closePopup() {
    this.close.emit();
  }

  addSelectedRobots() {
    const selectedRobots = this.robots.filter(robot => robot.selected);
    if (selectedRobots.length > 0) {
      this.addRobot.emit(selectedRobots); // Emit all selected robots
      this.close.emit();
    }
  }
}
