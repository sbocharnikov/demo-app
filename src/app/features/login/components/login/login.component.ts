import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { INPUT_TYPE, SVG } from './login.config';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from '../../../../shared/services/auth.service';
import { EMPTY, Observable } from 'rxjs';
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
          updateOn: 'blur'
        }],
        password: ['', {
          validators: [Validators.required, Validators.pattern(/[a-z0-9]+/gi)],
          updateOn: 'blur'
        }]
      },
      { updateOn: 'submit' }
    );
  }

  private handleLoginError = (error: LoginResponseInterface): Observable<never> => {
    if (error.result === 'Error') {
      this.login.markAsDirty();
      this.login.setErrors({invalid: true});
      this.password.markAsDirty();
      this.password.setErrors({invalid: true});
    }
    return EMPTY;
  }
}
