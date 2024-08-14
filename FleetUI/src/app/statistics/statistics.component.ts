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

  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value;
    // Implement your search logic here
  }

  onDateFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const filter = selectElement.value;
    // Implement your date filter logic here
  }

  onDateChange(event: Event): void {
    const startDateElement = document.getElementById('start-date') as HTMLInputElement;
    const endDateElement = document.getElementById('end-date') as HTMLInputElement;

    const startDate = startDateElement.value;
    const endDate = endDateElement.value;

    // Implement your date range filtering logic here
}
}