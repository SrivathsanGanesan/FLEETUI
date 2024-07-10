import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loggedInKey = 'loggedIn';

  private isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  // Simulating user login
  login() {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.loggedInKey, 'true');
    }
  }

  // Simulating user logout
  logout() {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.loggedInKey);
    }
  }

  // Checking if the user is logged in
  isLoggedIn(): boolean {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(this.loggedInKey) === 'true';
    }
    return false;
  }
}
