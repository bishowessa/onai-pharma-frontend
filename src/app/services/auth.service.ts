import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/users'; // Update backend URL if needed

  // User authentication status
  isLoggedIn = new BehaviorSubject<boolean>(false);
  currentUser = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {
    this.checkLoginStatus();
  }

  private checkLoginStatus() {
    const token = this.cookieService.get('jwt');
    if (token) {
      this.http.get(`${this.apiUrl}/getCurrentUser`, { withCredentials: true }).subscribe(
        (response: any) => {
          this.isLoggedIn.next(true);
          this.currentUser.next(response.user); // Update currentUser
        },
        () => {
          this.isLoggedIn.next(false);
          this.currentUser.next(null);
        }
      );
    }
  }

  login(user: any) {
    return this.http.post(`${this.apiUrl}/login`, user, { withCredentials: true }).subscribe(
      (response: any) => {
        this.cookieService.set('jwt', response.token, { path: '/' });
        this.isLoggedIn.next(true);
        this.currentUser.next(response.user); // Update currentUser
        this.router.navigate(['/products']);
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  }

  logout() {
    this.cookieService.delete('jwt', '/'); // Ensure the path matches the one used in set
    this.isLoggedIn.next(false);
    this.currentUser.next(null);
    this.router.navigate(['/login']);
  }

  // Fetch user profile data
  fetchProfile() {
    return this.http.get(`${this.apiUrl}/getCurrentUser`, { withCredentials: true });
  }
}