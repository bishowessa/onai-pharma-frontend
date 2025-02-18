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
        this.user = response.data;
        this.updatedUser = { ...this.user }; // Copy user data for editing
      },
      (error) => {
        console.error('Failed to fetch user profile:', error);
        this.router.navigate(['/login']); // Redirect if not logged in
      }
    );
  }

  updateField(field: string, event: Event) {
    const target = event.target as HTMLInputElement;
    this.updatedUser[field] = target.value;
  }

  saveChanges() {
    this.authService.updateProfile(this.updatedUser).subscribe(
      (response: any) => {
        alert('Profile updated successfully');
        this.user = { ...this.updatedUser }; // Update local user data
      },
      (error) => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    );
  }

  logout() {
    this.authService.logout();
  }
}