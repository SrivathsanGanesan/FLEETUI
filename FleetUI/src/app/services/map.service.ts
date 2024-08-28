import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private maps: Array<{ column1: string, column2: string, column3: string }> = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  // Load maps from localStorage
  loadFromLocalStorage() {
    const savedMaps = localStorage.getItem('maps');
    if (savedMaps) {
      this.maps = JSON.parse(savedMaps);
    }
  }

  // Save maps to localStorage
  saveToLocalStorage() {
    localStorage.setItem('maps', JSON.stringify(this.maps));
  }

  // Method to add a map to the list
  addMap(map: { column1: string, column2: string, column3: string }) {
    this.maps.push(map);
    this.saveToLocalStorage();
  }

  // Method to retrieve all maps
  getMaps() {
    return this.maps;
  }

  // Method to update a specific map
  updateMap(index: number, updatedMap: { column1: string, column2: string, column3: string }) {
    this.maps[index] = updatedMap;
    this.saveToLocalStorage();
  }

  // Method to delete a specific map
  deleteMap(index: number) {
    this.maps.splice(index, 1);
    this.saveToLocalStorage();
  }

  // Method to get a map by index (for editing purposes)
  getMap(index: number) {
    return this.maps[index];
  }
}
