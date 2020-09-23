import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { map } from 'rxjs/operators';

@Injectable()
export class PinGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.isLoggedIn.pipe(
      map((isLoggedIn: boolean) => {
        return isLoggedIn ? true : this.router.createUrlTree(['']);
      })
    );
  }
}
