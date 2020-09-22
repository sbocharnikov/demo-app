import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { INPUT_TYPE, SVG } from './login.config';
import { Router } from '@angular/router';
import { NAVIGATE } from '../../../../app.config';

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

  constructor(private fb: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.initForm();
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

  initForm(): void {
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

  submitLoginForm(): void {
    if (this.loginForm.valid) {
      this.router.navigate([NAVIGATE.LOGIN, NAVIGATE.PIN]);
    }
  }

  showPassword(): void {
    this.inputType = this.inputType === INPUT_TYPE.PASSWORD ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD;
    this.showPasswordIcon = this.showPasswordIcon === SVG.EYE ? SVG.EYE_SLASH : SVG.EYE;
  }
}
