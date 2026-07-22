import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      // {
      //   path: 'home',
      //   loadComponent: () => import('./dashboard/pages/home/home.component').then(m => m.HomeComponent)
      // },
      // {
      //   path: 'catalog',
      //   loadComponent: () => import('./dashboard/pages/catalog/catalog.component').then(m => m.CatalogComponent)
      // },
      // {
      //   path: 'transactions',
      //   loadComponent: () => import('./dashboard/pages/transactions/transactions.component').then(m => m.TransactionsComponent)
      // }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
 }