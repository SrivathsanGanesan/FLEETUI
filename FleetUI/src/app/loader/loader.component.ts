import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../loader.service'; // Adjust the path accordingly

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent implements OnInit {

  constructor(private loaderService: LoaderService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loaderService.show(); // Show loader before starting the operation

    // Simulate data fetching with a timeout
    setTimeout(() => {
      // Your actual data fetching logic here
      this.loaderService.hide(); // Hide loader after data is fetched
    }, 2000); // Example delay
  }
}
