import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  passwordFieldType = 'password';
  showPassword = false;

  constructor(private router: Router, private authService: AuthService) {} // Inject the Router and AuthService

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.passwordFieldType = this.showPassword ? 'text' : 'password';
  }

  validateForm() {
    const username = (document.getElementById('username') as HTMLInputElement)
      .value;
    const password = (document.getElementById('password') as HTMLInputElement)
      .value;
    const userRole = document.querySelector('input[name="userRole"]:checked');

    if (!username) {
      alert('Enter Username');
    } else if (!password) {
      alert('Enter Password');
    } else if (!userRole) {
      alert('Select User Role');
    } else {
      // Navigate to the 'project_setup' route

      fetch('http://localhost:3000/auth/login', {
        // IP
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          user: {
            name: username,
            role: (
              document.querySelector(
                'input[name="userRole"]:checked'
              ) as HTMLInputElement
            ).value,
            password: password,
          },
        }),
      })
        .then((res) => {
          if (res.ok) {
            this.authService.login(); // Mark the user as logged in
            this.router.navigate(['project_setup']);
          } else if (res.status == 401 || res.status == 404) {
            alert("wrong password! or user with this role doesn't exist");
          }
          return res.json();
        })
        .then((data) => {
          if (data.user) {
            document.cookie = `_user=${JSON.stringify(data.user)};`;
          }
          console.log(data.user);
        })
        .catch((err) => console.error(err));
    }
  }

  focusedContainer: HTMLElement | null = null;

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
