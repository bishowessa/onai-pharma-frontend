import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLogged: boolean = false; // Now gets updated dynamically
  userName: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to isLogged observable to react to login changes
    this.authService.isLogged$.subscribe((status) => {
      this.isLogged = status;
      const currentUser = this.authService.currentUserValue;
      this.userName = currentUser ? currentUser.name : '';
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
