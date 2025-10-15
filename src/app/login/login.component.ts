import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; // 1. Import Router
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  successMessage: string | null = null;
  failMessage: string | null = null;

  authService = inject(AuthService);
  router = inject(Router); // 2. Inject Router

  fetchData(e: Event) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const user = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    };

    // 3. Call the service and subscribe to its response here
    this.authService.login(user).subscribe({
      next: (response: any) => {
        // On success, navigate to a protected page
        this.router.navigate(['/']); // Or '/dashboard', '/products', etc.
      },
      error: (error: any) => {
        // On error, display the error message from the response
        this.failMessage = error.error.data || 'Login failed. Please try again.';
        setTimeout(() => {
          this.failMessage = null;
        }, 3000);
      }
    });
  }

  ngOnInit(): void { }
}