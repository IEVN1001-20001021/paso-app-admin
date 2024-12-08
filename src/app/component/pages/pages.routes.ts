import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

export default [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'productos',
    loadComponent: () =>
      import('./productos/productos.component').then(
        (m) => m.ProductosComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'tiendas',
    loadComponent: () =>
      import('./tiendas/tiendas.component').then((m) => m.TiendasComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'pedidos',
    loadComponent: () =>
      import('./pedidos/pedidos.component').then((m) => m.PedidosComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'gestion-apis',
    loadComponent: () =>
      import('./gestion-apis/gestion-apis.component').then(
        (m) => m.GestionApisComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-shop',
    loadComponent: () =>
      import('./add-shop/add-shop.component').then((m) => m.AddShopComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-product',
    loadComponent: () =>
      import('./add-product/add-product.component').then(
        (m) => m.AddProductComponent
      ),
    canActivate: [AuthGuard],
  },
] as Routes;
