import { Component } from '@angular/core';
interface DB {
  name: string;
  code: string;
}
@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrl: './communication.component.css'
})
export class CommunicationComponent {
  selectedCategory: any = null;

    categories: any[] = [
        { name: 'FastDDS', key: 'A' },
        { name: 'MarkFastDDSNATeting', key: 'M' },
        { name: 'Simulation', key: 'P' },
        { name: 'SimulationSocket', key: 'R' },
        { name: 'Socket', key: 'S' },
        { name: 'MQTT', key: 'Q' },
    ];

    ngOnInit() {
        this.selectedCategory = this.categories[1];
    }
}
