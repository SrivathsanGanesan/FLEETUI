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
  dtype: DB[] | undefined;
  iptype: DB[] | undefined;

    selectedDb: DB | undefined;

    ngOnInit() {
        this.dtype = [
            { name: 'PostgreSQL', code: 'NY' },
            { name: 'MongoDB', code: 'RM' },
            { name: 'SQL', code: 'LDN' },
        ];
        this.iptype = [
          { name: 'PostgreSQL', code: 'NY' },
          { name: 'MongoDB', code: 'RM' },
          { name: 'SQL', code: 'LDN' },
      ];
    }

}
