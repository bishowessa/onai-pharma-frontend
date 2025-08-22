import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductsComponent } from './products/products.component';
import { ProfileComponent } from './profile/profile.component';
import { AddProductComponent } from './add-product/add-product.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { OrderComponent } from './order/order.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';

import { AdminGuard } from './guards/admin.guard';
import { StockManagementComponent } from './stock-management/stock-management.component';
import { ContactComponent } from './contact/contact.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { Component } from '@angular/core';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { PromoteUserComponent } from './promote-user/promote-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'products',component: ProductsComponent},
    {path: 'products/stock', component: StockManagementComponent, canActivate: [AdminGuard]},
    {path: 'products/add',component: AddProductComponent},
    {path: 'products/:id', component: SingleProductComponent},
    { path: 'profile', component: ProfileComponent},
    {path: 'order', component: OrderComponent},
    {path: 'editProduct', component: EditProductComponent},
    {path: 'myorders', component: MyOrdersComponent },
    {path: 'contact', component: ContactComponent},
    {path: 'forgotPassword', component: ForgotPasswordComponent},
    {path: 'reset-password', component: ResetPasswordComponent},
    { path: 'manage-users', component: ManageUsersComponent, canActivate: [AdminGuard] },
    {path: 'promote-user', component: PromoteUserComponent, canActivate: [AdminGuard]},
    {path: 'edit-user/:id', component: EditUserComponent, canActivate: [AdminGuard]},
    {path: 'home', component: HomeComponent},
    {path: 'about', component: AboutComponent},

    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', redirectTo: 'home'},
];
