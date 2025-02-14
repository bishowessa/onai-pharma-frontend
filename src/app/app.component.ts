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

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink,NavbarComponent,LoginComponent, RegisterComponent
    ,ProductsComponent,ProfileComponent,AddProductComponent,DisplayProductComponent
  ],
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
