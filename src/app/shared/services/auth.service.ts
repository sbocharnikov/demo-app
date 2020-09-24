import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError, timer } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { LoginRequestInterface } from '../../features/login/models/loginRequest.interface';
import { LoginResponseInterface } from '../../features/login/models/loginResponse.interface';
import { NAVIGATE, USER } from '../../app.config';
import { PinRequestInterface } from '../../features/login/models/pinRequest.interface';
import { PinResponseInterface } from '../../features/login/models/pinResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private fakeResponseDelay: number = 300;

  constructor(private router: Router) {
  }

  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  get isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  login({ login, password }: LoginRequestInterface): Observable<LoginResponseInterface> {
   if (login === USER.login && password === USER.password) {
      return of<LoginResponseInterface>({ status: 'OK' }).pipe(
        delay(this.fakeResponseDelay),
        tap(() => this.handleSuccessfulLogin())
      );
   }
   return timer(this.fakeResponseDelay).pipe(switchMap(() => throwError({ status: 'Error' })));
  }

  confirmPin({ pin }: PinRequestInterface): Observable<PinResponseInterface> {
    if (pin === USER.pin) {
      return of<PinResponseInterface>({ status: 'OK', token: 'zxolzilmngl' }).pipe(
        delay(this.fakeResponseDelay),
        tap((response: PinResponseInterface) => this.handleSuccessfulPin(response))
      );
    }
    return timer(this.fakeResponseDelay).pipe(switchMap(() => throwError({ status: 'Error' })));
  }

  logout(): void {
    this.isLoggedInSubject.next(false);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate([NAVIGATE.LOGIN]);
    sessionStorage.removeItem('token');
  }

  private handleSuccessfulLogin(): void {
    this.isLoggedInSubject.next(true);
    this.router.navigate([NAVIGATE.LOGIN, NAVIGATE.PIN]);
  }

  private handleSuccessfulPin({ token }: PinResponseInterface): void {
    this.isAuthenticatedSubject.next(true);
    this.router.navigate([NAVIGATE.MAIN])
      .then(() => sessionStorage.setItem('token', token));
  }
}
