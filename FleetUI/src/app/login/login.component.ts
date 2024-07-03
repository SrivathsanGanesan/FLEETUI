import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const userRole = document.querySelector('input[name="userRole"]:checked');

    if (!username) {
      alert('Enter Username');
    } else if (!password) {
      alert('Enter Password');
    } else if (!userRole) {
      alert('Select User Role');
    } else {
      // Navigate to the 'project_setup' route
      this.router.navigate(['project_setup']);
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

  getData() {
    fetch('http://192.168.164.183:3000/dashboard/samp')
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));
    console.log("fine!");
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
