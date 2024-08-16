import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {
  currentView: string = 'operation';  // Default view

  setView(view: string): void {
    this.currentView = view;
  }

}