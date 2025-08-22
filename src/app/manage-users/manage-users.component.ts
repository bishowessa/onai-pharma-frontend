import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-manage-users',
  imports: [FormsModule,NgIf,NgFor],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.http
      .get<any>('http://localhost:5000/users/', { withCredentials: true })
      .subscribe(
        (response) => {
          this.users = response.data;
        },
        (error) => {
          this.setErrorMessage('Failed to fetch users.');
        }
      );
  }

  editUser(userId: string): void {
    this.router.navigate(['/edit-user', userId]);
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http
        .delete(`http://localhost:5000/users/deleteuser/${userId}`, { withCredentials: true })
        .subscribe(
          (response) => {
            this.setSuccessMessage('User deleted successfully.');
            this.getUsers();
          },
          (error) => {
            this.setErrorMessage('Failed to delete user. Please try again.');
          }
        );
    }
  }

  navigateToPromoteUser(): void {
    this.router.navigate(['/promote-user']);
  }

  setSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  setErrorMessage(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}
