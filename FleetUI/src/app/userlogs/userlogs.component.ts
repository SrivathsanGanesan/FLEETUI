import { Component } from '@angular/core';
import { table } from 'console';
 
@Component({
  selector: 'app-userlogs',
  templateUrl: './userlogs.component.html',
  styleUrl: './userlogs.component.css'
})

export class Userlogscomponent {
  currentTable = 'task';
// Your task data
    taskData = [    { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3' },
                    { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3' },
                    { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3' },
                    { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3' },
                    { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3' }  ]; 
    
    // Your robot data 
  robotData = [     { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3' },
                    { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3' },
                    { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3' },
                    { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3' },
                    { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3' },
                    { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3' }   ]; 
                    
   // Your fleet data
    fleetData = [   { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3' },
                    { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3' },
                    { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3' },
                    { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3' },
                    { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3' },
                    { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 1 Col 3' },
                    { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 3' }   ]; 

  showTable(table: string) {
    this.currentTable = table;
  }
  exportData() {
    // Implement your data export logic here
  }
}

