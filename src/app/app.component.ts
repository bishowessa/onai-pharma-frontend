import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

import { AuthService } from './services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from "./footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ReactiveFormsModule, FooterComponent,],
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
