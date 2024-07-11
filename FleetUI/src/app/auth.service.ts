import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loggedInKey = 'loggedIn';

  private isCookieEmpty(): boolean {
    return document.cookie === '';
  }

  // Simulating user login
  login(user: string) {
    if (this.isCookieEmpty()) document.cookie = user;
  }

  // Simulating user logout
  logout() {
    if (!this.isCookieEmpty()) {
      document.cookie = '_user=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
      return;
    }
  }

  // Checking if the user is logged in
  isLoggedIn(): boolean {
    if (document.cookie !== '') return true;
    return false;
  }
}
