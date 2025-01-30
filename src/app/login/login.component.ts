import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  successMessage: string | null = null;
  failMessage: string | null = null;
  authService = inject(AuthService);
  router = inject(Router);

  fetchData(e: Event) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const user = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    };

    this.authService.login(user);
  }
}
