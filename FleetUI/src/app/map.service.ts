import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private maps: Array<{ column1: string, column2: string, column3: string }> = [];

  constructor() {}

  // Method to add a map to the list
  addMap(map: { column1: string, column2: string, column3: string }) {
    this.maps.push(map);
  }

  // Method to retrieve all maps
  getMaps() {
    return this.maps;
  }

  // Method to update a specific map
  updateMap(index: number, updatedMap: { column1: string, column2: string, column3: string }) {
    this.maps[index] = updatedMap;
  }

  // Method to delete a specific map
  deleteMap(index: number) {
    this.maps.splice(index, 1);
  }

  // Method to get a map by index (for editing purposes)
  getMap(index: number) {
    return this.maps[index];
  }
}
