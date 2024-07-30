import { Component } from '@angular/core';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent {
  currentTab: string = 'environment';
  currentTabTitle: string = 'Environment';
  currentTabSubtitle: string = 'Create and edit reports';

  fleetTab: string = 'general'; // For fleet sub-tabs

  setTab(tab: string): void {
    this.currentTab = tab;
    if (tab === 'environment') {
      this.currentTabTitle = 'Environment';
      this.currentTabSubtitle = 'Create and edit reports';
    } else if (tab === 'robot') {
      this.currentTabTitle = 'Robots';
      this.currentTabSubtitle = 'Create and edit task reports';
    } else if (tab === 'fleet') {
      this.currentTabTitle = 'Fleet';
      this.currentTabSubtitle = 'Manage fleet';
      this.setFleetTab('general'); // Reset to 'general' sub-tab when switching to Fleet tab
    }
  }

  setFleetTab(tab: string): void {
    this.fleetTab = tab;
  }
}
