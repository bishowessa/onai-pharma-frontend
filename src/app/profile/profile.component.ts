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
  updatedUser: any = { name: '', phone: '', address: '' };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.fetchProfile().subscribe(
      (response: any) => {
        console.log('[DEBUG] Fetched user profile:', response);
        this.user = response.data;
        this.updatedUser = { ...this.user }; // Copy user data for editing
      },
      (error) => {
        console.error('[ERROR] Failed to fetch user profile:', error);
        this.router.navigate(['/login']); // Redirect if not logged in
      }
    );
  }

  updateField(field: string, event: Event) {
    const target = event.target as HTMLInputElement;
    this.updatedUser[field] = target.value;
    console.log(`[DEBUG] Updated field ${field}:`, this.updatedUser);
  }

  saveChanges() {
    console.log('[DEBUG] Updated user data before sending:', this.updatedUser);
    this.authService.updateProfile(this.updatedUser);
  }
  

  logout() {
    this.authService.logout();
  }
}
