import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NAVIGATE } from './app.config';
import { MainGuard } from './features/main/guards/main.guard';
import { LoginGuard } from './features/login/guards/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: NAVIGATE.LOGIN,
    pathMatch: 'full'
  },
  {
    path: NAVIGATE.LOGIN,
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./features/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: NAVIGATE.MAIN,
    canActivate: [MainGuard],
    loadChildren: () =>
      import('./features/main/main.module').then((m) => m.MainModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./features/not-found/not-found.module').then((m) => m.NotFoundModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
