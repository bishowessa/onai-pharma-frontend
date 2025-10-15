import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  imports: [FormsModule,NgIf],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {
  user: any = {
    name: '',
    email: '',
    phone: '',
    address: '',
  };
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.getUser(userId);
    }
  }

  getUser(userId: string): void {
    
    this.http
      .get<any>(`https://onai-pharma-backend-2.onrender.com/users/singleUser/${userId}`, {
        withCredentials: true,
      })
      .subscribe(
        (response) => {
          
          this.user = response.data; // Prefill form with user data
        },
        (error) => {
          console.error('Error fetching user data:', error);
          this.setErrorMessage('Failed to load user details.');
        }
      );
  }

  updateUser(): void {
    
    this.http
      .patch(
        `https://onai-pharma-backend-2.onrender.com/users/updateuser/${this.user.email}`,
        this.user,
        {
          withCredentials: true,
        }
      )
      .subscribe(
        (response) => {
          
          this.setSuccessMessage('User updated successfully.');
          setTimeout(() => this.router.navigate(['/manage-users']), 3000);
        },
        (error) => {
          console.error('Error updating user:', error);
          this.setErrorMessage('Failed to update user. Please try again.');
        }
      );
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
