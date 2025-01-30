import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Fetch user data when the component initializes
    this.authService.fetchProfile().subscribe(
      (response: any) => {
        this.user = response.user;
      },
      (error) => {
        console.error('Failed to fetch user profile:', error);
        this.router.navigate(['/login']); // Redirect to login if fetching fails
      }
    );
  }

  logout() {
    this.authService.logout();
  }
}