import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  user: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(status => {
      // console.log('[DEBUG] Navbar Login Status:', status);
      this.isLoggedIn = status;
    });
  
    this.authService.currentUser.subscribe(user => {
      // console.log('[DEBUG] Navbar User Data:', user);
      this.user = user; // Ensure user data is set
    });
  }
  

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout();
  }
}
