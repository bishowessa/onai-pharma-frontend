import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  successMessage : string | null = null
  failMessage : string | null = null
  
  http = inject(HttpClient) 
  authService = inject(AuthService);
  
formdata: any;

fetchData(e: Event) {
  e.preventDefault(); // Prevent page refresh
  const formData = new FormData((e.target as HTMLFormElement)); // Get form data

  const user = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  };

  console.log('login success');

  this.http.post('http://localhost:5000/users/login', user,{withCredentials: true})
    .subscribe((response : any) => {
     // console.log('Response:', response);
      this.successMessage= response.message;

      setTimeout(() => {
        this.successMessage = null;
        
      }, 3000);
      
    }, (error : any) => {
      console.error('Error:', error);
      this.failMessage = error.error.data;
      setTimeout(() => {
        this.failMessage = null;
      },3000)
    });
    this.authService.login(user);
}

ngOnInit(): void {}



}
