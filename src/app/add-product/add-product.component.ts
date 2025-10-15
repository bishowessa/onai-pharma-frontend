import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import { CookieService } from 'ngx-cookie-service';  // Import CookieService

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  name = '';
  description = '';
  price = 0;
  stock = 0;
  image: File | null = null;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private cookieService: CookieService) {}

  // Dynamically handle input changes
  onInputChange(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (field === 'name') {
      this.name = input.value;
    } else if (field === 'description') {
      this.description = input.value;
    } else if (field === 'price') {
      this.price = +input.value;
    } else if (field === 'stock') {
      this.stock = +input.value;
    }
  }

  onImageSelected(event: any): void {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      this.image = selectedImage;
        // Log the image to debug
    }
  }

  addProduct(): void {
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('description', this.description);
    formData.append('price', this.price.toString());
    formData.append('stock', this.stock.toString());

    // Append the image with its file name
    if (this.image) {
      formData.append('image', this.image, this.image.name); // Include file name to the upload
        // Debug the image name
    }

    // Get the JWT token from the AuthService
    const token = this.authService.getToken();
      // Log the token to ensure it's present

    // Check if token is present and valid
    // if (!token) {
    //   console.error('[ERROR] No token found. Unauthorized request.');
    //   return; // Stop further execution if no token is found
    // }

    // Set the authorization header
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      // Log the request headers

    // Send the request to the backend
    this.http.post('https://onai-pharma-backend-2.onrender.com/products', formData, { headers, withCredentials: true }).subscribe(
      (response) => {
        
        this.router.navigate(['/products']); // Navigate back to the product list
      },
      (error) => {
        console.error('[ERROR] Failed to add product:', error);
         // Log the detailed error response from the backend
      }
    );
  }
}
