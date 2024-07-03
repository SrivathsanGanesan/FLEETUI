import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'node:console';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  passwordFieldType = 'password';
  showPassword = false;

  constructor(private router: Router) {} // Inject the Router service

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
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
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
          if (res.ok) this.router.navigate(['project_setup']);
          else if (res.status == 401 || res.status == 404)
            alert("wrong password! or user with this role doesn't exist");
          return res.json();
        })
        .then((data) => {
          console.log(data);
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
