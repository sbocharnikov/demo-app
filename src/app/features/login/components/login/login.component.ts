import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { INPUT_TYPE, SVG } from './login.config';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from '../../../../shared/services/auth.service';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { LoginResponseInterface } from '../../models/loginResponse.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  inputType: string = INPUT_TYPE.PASSWORD;
  showPasswordIcon: string = SVG.EYE;
  isSubmitting: boolean = false;
  isLoginFailed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
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

  submitLoginForm(): void {
    this.isLoginFailed.next(false);
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.authService.login(this.loginForm.value).pipe(
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
          validators: [Validators.required, Validators.email, Validators.maxLength(30)],
        }],
        password: ['', {
          validators: [Validators.required],
        }]
      },
      { updateOn: 'blur' }
    );
  }

  private handleLoginError = (error: LoginResponseInterface): Observable<never> => {
    if (error.result === 'Error') {
      this.isLoginFailed.next(true);
    }
    return EMPTY;
  }
}
