import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule,NgIf],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  token: string | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  passwordMismatch: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    this.token = urlParams.get('token');

    if (this.token) {
      this.http.post('http://localhost:5000/users/get-token-email', { token: this.token })
        .subscribe(
          (response: any) => {
            this.email = response.email;
          },
          error => {
            this.errorMessage = 'Invalid or expired token. Please request a new password reset.';
          }
        );
    } else {
      this.errorMessage = 'No token provided. Please request a password reset again.';
    }
  }

  checkPasswordMatch(): void {
    this.passwordMismatch = this.newPassword !== this.confirmPassword;
  }

  resetPassword() {
    this.checkPasswordMatch();  // Check if passwords match before submitting

    if (this.passwordMismatch) {
      this.errorMessage = 'Passwords do not match. Please try again.';
      return;
    }

    if (!this.token) {
      this.errorMessage = 'Invalid or missing token. Please request a new reset link.';
      return;
    }

    this.http.post('http://localhost:5000/users/reset-password', {
      token: this.token,
      newPassword: this.newPassword
    }).subscribe(
      (response: any) => {
        this.successMessage = 'Password reset successfully! You can now log in with your new password.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error => {
        this.errorMessage = 'Failed to reset the password. Please try again or request a new reset link.';
      }
    );
  }
}
