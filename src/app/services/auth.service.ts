import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { tap, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://onai-pharma-backend-2.onrender.com/users';
  isLoggedIn = new BehaviorSubject<boolean>(false);
  currentUser = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {
    this.restoreSession();
  }

  getToken(): string {
    return this.cookieService.get('jwt');
  }

  public restoreSession(): void {
    const token = this.cookieService.get('jwt');
    if (token) {
      this.http.get(`${this.apiUrl}/getCurrentUser`, { withCredentials: true }).subscribe({
        next: (response: any) => {
          if (response.status === 'success' && response.data) {
            this.isLoggedIn.next(true);
            this.currentUser.next(response.data);
          }
        },
        error: () => {
          this.isLoggedIn.next(false);
          this.currentUser.next(null);
        }
      });
    }
  }

  // NOTE: You have multiple redundant methods here. Consolidating them is recommended.
  public checkLoginStatus(): void { this.restoreSession(); }
  checkSession(): void { this.restoreSession(); }

  /**
   * THE ONLY MAJOR CHANGE IS HERE
   * The method now returns an Observable and uses the pipe() operator.
   */
  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user, { withCredentials: true }).pipe(
      switchMap((response: any) => {
        // Set the cookie based on the login response
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1); // Set for 1 hour
        this.cookieService.set('jwt', response.token, { path: '/', expires: expirationDate, sameSite: 'Lax' });
        
        // After setting the cookie, fetch the user's profile
        return this.fetchProfile();
      }),
      tap((userResponse: any) => {
        // This is a side effect after fetchProfile succeeds
        this.isLoggedIn.next(true);
        this.currentUser.next(userResponse.data);
        this.router.navigate(['/products']);
      }),
      catchError(error => {
        // This will catch errors from either the login or fetchProfile calls
        console.error('[ERROR] Login or profile fetch failed:', error);
        return throwError(() => error); // Forward the error to the component
      })
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.cookieService.delete('jwt', '/');
        this.isLoggedIn.next(false);
        this.currentUser.next(null);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('[ERROR] Logout request failed:', error);
      }
    });
  }

  updateProfile(updatedUser: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/updateCurrentUser`, updatedUser, { withCredentials: true }).pipe(
      tap((response: any) => {
        this.currentUser.next(response.data);
      })
    );
  }

  fetchProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getCurrentUser`, { withCredentials: true });
  }

  isAdmin(): boolean {
    const currentUser = this.currentUser.getValue();
    return !!currentUser && currentUser.role === 'admin';
  }
}