import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.authService.isLoggedIn()) {
      if (url === '/') {
        // User is logged in and trying to navigate to the login page, redirect them to project setup
        this.router.navigate(['/project_setup']);
        return false;
      }
      return true;
    }

    if (url === '/project_setup') {
      // User is not logged in and trying to access project setup, redirect them to login page
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
