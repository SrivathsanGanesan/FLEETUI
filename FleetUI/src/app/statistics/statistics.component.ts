import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {
ONBtn: any;
activeFilter = 'today';

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
  }
}