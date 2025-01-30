import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductsComponent } from './products/products.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'products',component: ProductsComponent},
    { path: 'profile', component: ProfileComponent},
];

// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { HomeComponent } from './components/home/home.component';
// import { ProductListComponent } from './components/product/product-list/product-list.component';
// import { OrderComponent } from './components/order/order.component';
// import { AdminComponent } from './components/admin/admin.component';
// import { AuthGuard } from './guards/auth.guard';
// import { AdminGuard } from './guards/admin.guard';

// const routes: Routes = [
//   { path: '', component: HomeComponent },
//   { path: 'products', component: ProductListComponent },
//   { path: 'order', component: OrderComponent, canActivate: [AuthGuard] },
//   { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
//   { path: '**', redirectTo: '' },
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule],
// })
// export class AppRoutingModule {}
