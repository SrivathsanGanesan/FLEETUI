import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-sidenavbar',
  templateUrl: './sidenavbar.component.html',
  styleUrl: './sidenavbar.component.css'
})
export class SidenavbarComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private projectService: ProjectService
  ) {}

  logout() {
    fetch('http://localhost:3000/auth/logout', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.isCookieDeleted);
        if (data.isCookieDeleted) {
          this.authService.logout();
          this.router.navigate(['/']);
        }
      })
      .catch((err) => console.log(err));
  }
}