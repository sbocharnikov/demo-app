import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { PinComponent } from './components/pin/pin.component';
import { NAVIGATE } from '../../app.config';

const routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: NAVIGATE.PIN,
    component: PinComponent,
  },
];

@NgModule({
  declarations: [LoginComponent, PinComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ]
})
export class LoginModule {
}
