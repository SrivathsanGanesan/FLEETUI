import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MessageService } from 'primeng/api';

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

  constructor(private messageService: MessageService) {}
  //..
  showError: boolean = false; // To track if an error message should be shown
  availableRobots = [
    { id: 1, name: 'Robot 1', image: 'assets/CanvasRobo/robotB.svg', selected: false },
    { id: 2, name: 'Robot 2', image: 'assets/CanvasRobo/robotB.svg', selected: false },
    { id: 3, name: 'Robot 3', image: 'assets/CanvasRobo/robotB.svg', selected: false }
  ];

  closePopup() {
    this.resetSelections(); // Reset the selections when the popup is closed
    this.close.emit();
  }

  addSelectedRobots() {
    const selectedRobots = this.availableRobots.filter((robot) => robot.selected);

    if (selectedRobots.length > 0) {
      this.addRobot.emit(selectedRobots); // Emit all selected robots
      this.showError = false;

      // Show success toast message
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Robots added successfully!'
      });

      this.close.emit();
    } else {
      this.showError = true;

      // Show error toast message
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No robots selected!'
      });
    }

    this.resetSelections();
  }

  private resetSelections() {
    this.availableRobots.forEach((robot) => {
      robot.selected = false;
    });
  }
}
