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
  router = inject(Router);

  fetchData(e: Event) {
    e.preventDefault();
    const formData = new FormData((e.target as HTMLFormElement));

    const user = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string
    };

    this.http.post('http://localhost:5000/users/register', user)
      .subscribe((response: any) => {
        this.successMessage = response.message;
        setTimeout(() => {
          this.successMessage = null;
          this.router.navigate(['/login']);
        }, 2000);
      }, error => {
        this.failMessage = error.error.data.errors[0].msg;
        setTimeout(() => this.failMessage = null, 3000);
      });
  }

  ngOnInit(): void {}
}
