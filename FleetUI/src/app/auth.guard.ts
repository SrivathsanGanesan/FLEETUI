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
    const user = this.authService.getUser();
    if (this.authService.isLoggedIn()) {
      if (url === '/') {
        if (user?.role === 'User') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/project_setup']);
        }
        return false;
      }
      return true;
    }
  
    if (url === '/project_setup' || url === '/dashboard') {
      this.router.navigate(['/']);
      return false;
    }
  
    return true;
  }
}
