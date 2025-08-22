import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductsComponent } from './products/products.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthService } from './services/auth.service';
import { AddProductComponent } from './add-product/add-product.component';
import { DisplayProductComponent } from './display-product/display-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StockManagementComponent } from "./stock-management/stock-management.component";
import { FooterComponent } from "./footer/footer.component";
import { HomeComponent } from "./home/home.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NavbarComponent, LoginComponent, RegisterComponent,
    ProductsComponent, ProfileComponent, AddProductComponent, DisplayProductComponent, EditProductComponent, ReactiveFormsModule, StockManagementComponent, FooterComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'onai-pharmaceutical-frontend';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.checkLoginStatus(); // Fetch login state on load
  }
}
