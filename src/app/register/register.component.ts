import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  successMessage: string | null = null;
  failMessage: string | null = null;

  http = inject(HttpClient);
  router = inject(Router); // Inject the Router service

  fetchData(e: Event) {
    e.preventDefault(); // Prevent page refresh
    const formData = new FormData((e.target as HTMLFormElement)); // Get form data

    const user = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string
    };

    console.log('User Data:', user);

    this.http.post('https://onai-pharma-backend-2.onrender.com/users/register', user)
      .subscribe(
        (response: any) => {
          console.log('Response:', response);
          this.successMessage = 'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.successMessage = null;
            this.router.navigate(['/login']); // Redirect to the login page
          }, 3000); // Wait 3 seconds before redirecting
        },
        error => {
          console.error('Error:', error);
          this.failMessage = error.error?.data?.errors?.[0]?.msg || 'Registration failed. Please try again.';
          setTimeout(() => {
            this.failMessage = null;
          }, 3000); // Clear error message after 3 seconds
        }
      );
  }

  ngOnInit(): void {}
}
