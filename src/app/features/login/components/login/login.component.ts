import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { INPUT_TYPE, SVG } from './login.config';
import { catchError, filter, finalize, take, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from '../../../../shared/services/auth.service';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';
import { LoginResponseInterface } from '../../models/loginResponse.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  inputType: string = INPUT_TYPE.PASSWORD;
  showPasswordIcon: string = SVG.EYE;
  isSubmitting: boolean = false;
  private isLoginFailedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isDestroyed: Subject<boolean> = new Subject();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
  }

  get login(): FormControl {
    return this.loginForm.get('login') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  get isLoginInvalid(): boolean {
    return this.login.invalid && this.login.dirty;
  }

  get isPasswordInvalid(): boolean {
    return this.password.invalid && this.password.dirty;
  }

  get isLoginFailed(): Observable<boolean> {
    return this.isLoginFailedSubject.asObservable();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeSubscriptions();
  }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
    this.isDestroyed.complete();
  }

  submitLoginForm(): void {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.authService.login(this.loginForm.value).pipe(
        take(1),
        catchError(this.handleLoginError),
        finalize(() => this.isSubmitting = false)
      ).subscribe();
    }
  }

  showPassword(): void {
    this.inputType = this.inputType === INPUT_TYPE.PASSWORD ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD;
    this.showPasswordIcon = this.showPasswordIcon === SVG.EYE ? SVG.EYE_SLASH : SVG.EYE;
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
        login: ['', {
          validators: [Validators.required, Validators.email],
          updateOn: 'blur'
        }],
        password: ['', {
          validators: [Validators.required]
        }]
      },
    );
  }

  private initializeSubscriptions(): void {
    this.login.valueChanges.pipe(
      filter(value => value?.length),
      tap(() => this.isLoginFailedSubject.next(false)),
      takeUntil(this.isDestroyed)
    ).subscribe();
    this.password.valueChanges.pipe(
      filter(value => value?.length),
      tap(() => this.isLoginFailedSubject.next(false)),
      takeUntil(this.isDestroyed)
    ).subscribe();
  }

  private handleLoginError = (error: LoginResponseInterface): Observable<never> => {
    if (error.status === 'Error') {
      this.isLoginFailedSubject.next(true);
      this.loginForm.reset();
    }
    return EMPTY;
  }
}
