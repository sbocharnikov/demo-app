import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { PinComponent } from './components/pin/pin.component';
import { NAVIGATE } from '../../app.config';
import { PinGuard } from './guards/pin.guard';
import { RestrictInputDirective } from '../../shared/directives/restrict-input.directive';
import { MaxLengthDirective } from '../../shared/directives/max-length.directive';

const routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: NAVIGATE.PIN,
    component: PinComponent,
    canActivate: [PinGuard],
  },
];

@NgModule({
  declarations: [
    LoginComponent,
    PinComponent,
    RestrictInputDirective,
    MaxLengthDirective
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  providers: [PinGuard]
})
export class LoginModule {
}
