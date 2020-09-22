import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NAVIGATE } from './app.config';

const routes: Routes = [
  {
    path: '',
    redirectTo: NAVIGATE.LOGIN,
    pathMatch: 'full'
  },
  {
    path: NAVIGATE.LOGIN,
    loadChildren: () =>
      import('./features/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: NAVIGATE.MAIN,
    loadChildren: () =>
      import('./features/main/main.module').then((m) => m.MainModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
