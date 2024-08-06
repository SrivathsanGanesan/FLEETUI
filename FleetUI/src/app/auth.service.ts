import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: { name: string; role: string } | null = null;

  constructor(private cookieService: CookieService) {}

  private isCookieEmpty(): boolean {
    return document.cookie === '';
  }

  // Simulating user login
  login(user: { name: string; role: string }) {
    // if (this.isCookieEmpty()) {
    this.cookieService.set('_user', JSON.stringify(user));
    // document.cookie = `_user=${JSON.stringify(user)};`;
    this.user = user;
    // }
  }

  // Simulating user logout
  logout() {
    if (!this.isCookieEmpty()) {
      this.cookieService.delete('_user', '/');
      // document.cookie = '_user=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
      this.user = null;
    }
  }

  // Checking if the user is logged in
  isLoggedIn(): boolean {
    // const cookieValue = document.cookie
    //   .split('; ')
    //   .find((row) => row.startsWith('_user='))
    //   ?.split('=')[1];
    const cookieValue = this.cookieService.get('_user');
    return cookieValue !== undefined && cookieValue !== '';
  }

  // Getting the user data
  getUser(): { name: string; role: string } | null {
    if (!this.user && !this.isCookieEmpty()) {
      // const cookieValue = document.cookie
      //   .split('; ')
      //   .find((row) => row.startsWith('_user='))
      //   ?.split('=')[1];
      const cookieValue = this.cookieService.get('_user');
      if (cookieValue) {
        this.user = JSON.parse(cookieValue);
      }
    }
    return this.user;
  }
}
