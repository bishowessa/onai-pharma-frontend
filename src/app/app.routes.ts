import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductsComponent } from './products/products.component';
import { ProfileComponent } from './profile/profile.component';
import { AddProductComponent } from './add-product/add-product.component';
import { DisplayProductComponent } from './display-product/display-product.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { OrderComponent } from './order/order.component';
export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'products',component: ProductsComponent},
    {path: 'products/add',component: AddProductComponent},
    {path: 'products/:id', component: SingleProductComponent},
    { path: 'profile', component: ProfileComponent},
    {path: 'order', component: OrderComponent},
    
    {path: '', redirectTo: 'products', pathMatch: 'full'},
    {path: '**', redirectTo: 'products'},
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
