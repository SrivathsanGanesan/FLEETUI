import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = false;

  // Simulating user login
  login() {
    this.loggedIn = true;
  }

  // Simulating user logout
  logout() {
    this.loggedIn = false;
  }

  // Checking if the user is logged in
  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
