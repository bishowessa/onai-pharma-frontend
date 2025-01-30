import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: any;

  // New variable to track login status across components
  private isLoggedSubject = new BehaviorSubject<boolean>(false);
  public isLogged$ = this.isLoggedSubject.asObservable(); // Observable to subscribe to

  constructor() {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();

    // Initialize isLogged based on currentUser
    this.isLoggedSubject.next(!!this.currentUserSubject.value);
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isLoggedSubject.value; // Get the latest login status
  }

  login(user: any): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isLoggedSubject.next(true); // Update login status
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isLoggedSubject.next(false); // Update login status
  }
}
