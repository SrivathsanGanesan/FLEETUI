import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-sidenavbar',
  templateUrl: './sidenavbar.component.html',
  styleUrls: ['./sidenavbar.component.css'],
})
export class SidenavbarComponent implements OnInit {
  username: string | null = null;
  userrole: string | null = null;
  showNotificationPopup = false; // Property to track popup visibility
  showProfilePopup = false;
  isSidebarEnlarged = false; // Property to track sidebar enlargement

  isNotificationVisible = false;

  private autoCloseTimeout: any;
  notifications: string[] = []; // Initially empty
  constructor(
    private authService: AuthService,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.username = user.name;
      this.userrole = user.role;
    }
  }

  toggleNotificationPopup() {
    this.showNotificationPopup = !this.showNotificationPopup;
  }
   // Function to show the notification popup
   showNotification() {
    this.isNotificationVisible = true;
    this.startAutoClose(); // Start auto-close timer when popup is shown
  }

  // Function to close the notification popup
  closeNotification() {
    this.isNotificationVisible = false;
    this.clearAutoClose(); // Clear the timer if manually closed
  }

  // Start the auto-close after 5 seconds
  startAutoClose() {
    this.clearAutoClose(); // Clear any existing timer
    this.autoCloseTimeout = setTimeout(() => {
      this.isNotificationVisible = false;
    }, 5000); // 5 seconds
  }

  // Cancel auto-close when the mouse is over the popup
  cancelAutoClose() {
    this.clearAutoClose();
  }

  // Clear the auto-close timeout
  clearAutoClose() {
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout);
      this.autoCloseTimeout = null;
    }
  }





  toggleProfilePopup() {
    this.showProfilePopup = !this.showProfilePopup;
  }

  toggleSidebar(isEnlarged: boolean) {
    this.isSidebarEnlarged = isEnlarged;
  }
  logout() {
    fetch('http://localhost:3000/auth/logout', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isCookieDeleted) {
          this.authService.logout();
          this.projectService.clearProjectData();
          this.projectService.clearMapData();
          this.projectService.clearIsMapSet();
          this.router.navigate(['/']);
        }
      })
      .catch((err) => console.log(err));
  }
}
