import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
// import { CookieService } from 'ngx-cookie-service';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  passwordFieldType = 'password';
  showPassword = false;
  focusedContainer: HTMLElement | null = null;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private projectService: ProjectService // private cookieService: CookieService
  ) {
    if (document.cookie === '') localStorage.clear(); // not advisable..
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.passwordFieldType = this.showPassword ? 'text' : 'password';
  }

  validateForm() {
    const username = (document.getElementById('username') as HTMLInputElement)
      .value;
    const password = (document.getElementById('password') as HTMLInputElement)
      .value;
    const userRole = (
      document.querySelector(
        'input[name="userRole"]:checked'
      ) as HTMLInputElement
    )?.value;

    if (!username && !password && !userRole) {
      this.errorMessage = '*Enter Username, Password and Select User Role';
      return;
    }
    if (!username && !password) {
      this.errorMessage = '*Enter Username and Password';
      return;
    }
    if (!password && !userRole) {
      this.errorMessage = '*Enter Password and Select User Role';
      return;
    }
    if (!userRole && !username) {
      this.errorMessage = '*Select User Role and Enter Username';
      return;
    }
    if (!userRole) {
      this.errorMessage = '*Select User Role ';
      return;
    }
    if (!username) {
      this.errorMessage = '*Enter Username';
      return;
    }
    if (!password) {
      this.errorMessage = '*Enter Password ';
      return;
    }

    this.errorMessage = null; // Clear any previous error messages

    fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        user: {
          name: username,
          role: userRole,
          password: password,
        },
      }),
    })
      .then((res) => {
        // if (res.ok) {
        //   return res.json();
        // } else
        if (res.status === 404 || res.status === 401) {
          this.errorMessage =
            "*Wrong password or user with this role doesn't exist";
        }
        return res.json();
        // throw new Error('Login failed');
      })
      .then((data) => {
        // console.log(data.user.projects);
        if (data.user) {
          if (data.user.role === 'User') {
            if (!data.project) {
              alert('No project has been assigned to this user.');
              return;
            }
            this.authService.login({
              name: data.user.name,
              role: data.user.role,
            });
            this.projectService.setSelectedProject(data.project);
            this.projectService.setProjectCreated(true);
            this.router.navigate(['dashboard']);
            return;
          }
          this.authService.login({
            name: data.user.name,
            role: data.user.role,
          });
          this.router.navigate(['project_setup']);
        }
      })
      .catch((err) => {
        console.error(err);
        this.errorMessage = 'Login failed. Please try again.';
      });
  }

  onContainerClick(event: Event) {
    const target = event.currentTarget as HTMLElement;
    if (this.focusedContainer && this.focusedContainer !== target) {
      this.focusedContainer.classList.remove('focused');
    }
    target.classList.add('focused');
    const input = target.querySelector('input');
    if (input) {
      input.focus();
    }
    this.focusedContainer = target;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.focusedContainer && !this.focusedContainer.contains(target)) {
      this.focusedContainer.classList.remove('focused');
      this.focusedContainer = null;
    }
  }
}
