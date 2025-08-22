import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/users';
  isLoggedIn = new BehaviorSubject<boolean>(false);
  currentUser = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {
    // Restore session on component initialization
    this.restoreSession();
  }


  getToken() {
    const token = this.cookieService.get('jwt');
    console.log('[DEBUG] Checking JWT from Cookies:', token);
    return token;  // Ensure the token is returned
  }
  
  /** 🔹 Restore Login State on Refresh */
  public restoreSession() {
    const token = this.cookieService.get('jwt');
    // console.log('[DEBUG] Checking JWT from Cookies:', token);

    if (token) {
      this.http.get(`${this.apiUrl}/getCurrentUser`, { withCredentials: true }).subscribe(
        (response: any) => {
          // console.log('[DEBUG] User restored:', response);
          if (response.status === 'success' && response.data) {
            this.isLoggedIn.next(true);
            this.currentUser.next(response.data);
          }
        },
        (error) => {
          console.error('[ERROR] Session restoration failed:', error);
          this.isLoggedIn.next(false);
          this.currentUser.next(null);
        }
      );
    } else {
      // console.warn('[WARNING] No JWT token found in cookies.');
    }
  }

  public checkLoginStatus() {
    this.http.get(`${this.apiUrl}/getCurrentUser`, { withCredentials: true }).subscribe(
      (response: any) => {
        if (response && response.status === 'success' && response.data) {
          this.isLoggedIn.next(true);
          this.currentUser.next(response.data); // Save the user data
        } else {
          this.isLoggedIn.next(false);
          this.currentUser.next(null);
        }
      },
      (error) => {
        console.error('[ERROR] Session restoration failed:', error);
        this.isLoggedIn.next(false);
        this.currentUser.next(null);
      }
    );
  }

  checkSession() {
    this.http.get(`${this.apiUrl}/getCurrentUser`, { withCredentials: true }).subscribe(
      (response: any) => {
        if (response.status === 'success' && response.data) {
          this.isLoggedIn.next(true);
          this.currentUser.next(response.data);
        } else {
          this.isLoggedIn.next(false);
          this.currentUser.next(null);
        }
      },
      () => {
        this.isLoggedIn.next(false);
        this.currentUser.next(null);
      }
    );
  }
  login(user: any) {
    this.http.post(`${this.apiUrl}/login`, user, { withCredentials: true }).subscribe(
      (response: any) => {
  //      console.log('[DEBUG] Login success:', response);
  
        // Set the token in the cookie with path and expires
        const expirationDate = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + 60 * 60); // Set to 1 hour from now
        this.cookieService.set('jwt', response.token, { path: '/', expires: expirationDate, sameSite: 'Lax' });
  
        // Fetch user details after login
        this.fetchProfile().subscribe(
          (userResponse: any) => {
          //  console.log('[DEBUG] Fetched user after login:', userResponse);
            this.isLoggedIn.next(true);
            this.currentUser.next(userResponse.data);
            this.router.navigate(['/products']);
          },
          (error) => {
            console.error('[ERROR] Failed to fetch user after login:', error);
          }
        );
      },
      (error) => {
        console.error('[ERROR] Login failed:', error);
      }
    );
  }
  


  logout() {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe(
      () => {
        console.log('[DEBUG] Logout successful');
        // Delete the jwt cookie on logout
        this.cookieService.delete('jwt', '/');
        this.isLoggedIn.next(false);
        this.currentUser.next(null);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('[ERROR] Logout request failed:', error);
      }
    );
  }

  updateProfile(updatedUser: any) {
    const token = this.getToken();
    console.log('[DEBUG] Sending JWT token:', token);
  
    return this.http.patch(`${this.apiUrl}/updateCurrentUser`, updatedUser, { withCredentials: true }).pipe(
      tap((response: any) => {
        this.currentUser.next(response.data); // Ensure the updated user data is set
      }),
      catchError((error) => {
        console.error('Profile update error:', error);
        return throwError(error);
      })
    );
  }
  

  fetchProfile() {
    return this.http.get(`${this.apiUrl}/getCurrentUser`, { withCredentials: true });
  }

  isAdmin(): boolean {
    const currentUser = this.currentUser.getValue();
    return currentUser && currentUser.role === 'admin';
  }
  

}

