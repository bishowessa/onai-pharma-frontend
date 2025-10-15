import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  email: string = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;
  http = inject(HttpClient);

  sendResetLink(email: string) {
     // Debugging line
  
    if (!email.trim()) {
      this.errorMessage = "Please enter a valid email.";
      return;
    }
  
    this.http.post('https://onai-pharma-backend-2.onrender.com/users/forgotPassword', 
      { email }, 
      { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    ).subscribe(
      (response: any) => {
        
        this.successMessage = response.message;
        this.errorMessage = null;
      },
      (error: any) => {
        
        this.errorMessage = error.error.data || 'An error occurred';
        this.successMessage = null;
      }
    );
  }
  
  
}