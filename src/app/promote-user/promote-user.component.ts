import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promote-user',
  imports: [FormsModule,CommonModule],
  templateUrl: './promote-user.component.html',
  styleUrls: ['./promote-user.component.css'],
})
export class PromoteUserComponent {
  email: string = '';
  message: string = '';
  success: boolean = false;

  constructor(private http: HttpClient) {}

  promoteUser() {
    if (!this.email) {
      this.message = 'Please enter a valid email.';
      this.success = false;
      return;
    }

    // Check if user exists in the backend
    console.log(`Checking email: ${this.email}`);
    this.http.get<any>(`http://localhost:5000/users/checkEmail/${this.email}`).subscribe({
      next: (response) => {
        if (response.exists) {
          // Promote the user
          const userId = response.user._id;
          this.http.patch(
            `http://localhost:5000/users/promote/${userId}`,
            {},
            { withCredentials: true } // Ensure cookies or tokens are sent
          ).subscribe({
            next: () => {
              this.message = `User with email ${this.email} successfully promoted to admin.`;
              this.success = true;
            },
            error: (err) => {
              console.error('Error promoting user:', err);
              this.message = 'Failed to promote user. Please try again.';
              this.success = false;
            },
          });
          
        } else {
          this.message = 'User not found.';
          this.success = false;
        }
      },
      error: (err) => {
        console.error('Error checking email:', err);
        this.message = 'Failed to check email. Please try again later.';
        this.success = false;
      },
    });
  }
}
