import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  successMessage: string | null = null;
  failMessage: string | null = null;

  http = inject(HttpClient);
  router = inject(Router);
  cookieService = inject(CookieService);

  fetchData(e: Event) {
    e.preventDefault();
    const formData = new FormData((e.target as HTMLFormElement));

    const user = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    };

    this.http.post('http://localhost:5000/users/login', user, { withCredentials: true })
      .subscribe((response: any) => {
        this.successMessage = response.message;

        // Store JWT in cookie
        this.cookieService.set('jwt', response.token, { path: '/' });

        setTimeout(() => {
          this.successMessage = null;
          this.router.navigate(['/products']);
        }, 2000);
      }, (error: any) => {
        this.failMessage = error.error.data;
        setTimeout(() => this.failMessage = null, 3000);
      });
  }

  ngOnInit(): void {}
}
