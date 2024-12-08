import { Routes } from '@angular/router';
import { LoginComponent } from './component/auth/login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./component/pages/pages.routes').then((m) => m.default),
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];
