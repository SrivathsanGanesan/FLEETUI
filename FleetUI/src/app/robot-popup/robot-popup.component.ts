import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-robot-popup',
  templateUrl: './robot-popup.component.html',
  styleUrls: ['./robot-popup.component.css'],
})
export class RobotPopupComponent {
  @Input() isVisible: boolean = false;
  @Input() robots: any[] = []; // Robots data will be passed from parent
  @Output() close = new EventEmitter<void>();
  @Output() addRobot = new EventEmitter<any[]>(); // Emit an array of selected robots

  availableRobots = [
    { id: 1, name: 'Robot A', image: 'assets/CanvasRobo/robotA.svg', selected: false },
    { id: 2, name: 'Robot B', image: 'assets/CanvasRobo/robotB.svg', selected: false },
  ];

  closePopup() {
    this.close.emit();
  }

  addSelectedRobots() {
    const selectedRobots = this.availableRobots.filter((robot) => robot.selected);
    if (selectedRobots.length > 0) {
      this.addRobot.emit(selectedRobots); // Emit all selected robots
      this.close.emit();
    }
  }
}
