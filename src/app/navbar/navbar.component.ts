import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  user: any = null;
  isAdmin = false;
  isNavbarCollapsed = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(status => {
      this.isLoggedIn = status;
    });
  
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      this.isAdmin = user?.role === 'admin';
    });
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  // A new function to explicitly close the navbar.
  // This prevents accidentally opening it when clicking a link.
  closeNavbar() {
    this.isNavbarCollapsed = true;
  }

  goToProfile() {
    this.closeNavbar();
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout();
    this.closeNavbar();
    this.router.navigate(['/login']);
  }
}

