import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError, timer } from 'rxjs';
import { LoginRequestInterface } from '../../features/login/models/loginRequest.interface';
import { LoginResponseInterface } from '../../features/login/models/loginResponse.interface';
import { NAVIGATE, USER } from '../../app.config';
import { delay, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {
  }

  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  login({ login, password }: LoginRequestInterface): Observable<LoginResponseInterface> {
   if (login === USER.login && password === USER.password) {
      return of<LoginResponseInterface>({ result: 'OK' }).pipe(
        delay(300),
        tap(() => this.handleSuccessfulLogin())
      );
   }
   return timer(300).pipe(switchMap(() => throwError({ result: 'Error' })));
  }

  private handleSuccessfulLogin(): void {
    this.isLoggedInSubject.next(true);
    this.router.navigate([NAVIGATE.LOGIN, NAVIGATE.PIN]);
  }
}
