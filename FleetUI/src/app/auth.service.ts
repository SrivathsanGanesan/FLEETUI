import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loggedInKey = 'loggedIn';

  // Simulating user login
  login() {
    localStorage.setItem(this.loggedInKey, 'true');
  }

  // Simulating user logout
  logout() {
    localStorage.removeItem(this.loggedInKey);
  }

  // Checking if the user is logged in
  isLoggedIn(): boolean {
    return localStorage.getItem(this.loggedInKey) === 'true';
  }
}
