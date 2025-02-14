import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-products',
  imports: [RouterLink],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  isAdmin = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // console.log('Initializing ProductsComponent...');
    this.fetchProducts();
    this.checkAdminStatus();
  }

  fetchProducts() {
    // console.log('Fetching products...');
    this.http.get('http://localhost:5000/products').subscribe(
      (response: any) => {
        // console.log('Products fetched successfully:', response);
        // Extract the 'data' array from the response
        if (response?.status === 'success' && Array.isArray(response.data)) {
          this.products = response.data;
        } else {
          console.error('Invalid response format: Expected an array in the "data" field');
        }
      },
      (error) => {
        console.error('Failed to fetch products:', error);
      }
    );
  }
  

  checkAdminStatus() {
    // console.log('Checking admin status...');
    this.authService.currentUser.subscribe(user => {
      // console.log('Current user:', user);
      this.isAdmin = user?.role === 'admin';
      // console.log('Is admin:', this.isAdmin);
    });
  }

  navigateToOrder(productId: string) {
    // console.log('Navigating to order for product ID:', productId);
    this.router.navigate(['/order', productId]);
  }

  navigateToDetails(productId: string) {
    // console.log('Navigating to details for product ID:', productId);
    this.router.navigate(['/products', productId]);
  }

  deleteProduct(productId: string) {
    // console.log('Deleting product with ID:', productId);
    if (confirm('Are you sure you want to delete this product?')) {

      this.http.delete(`http://localhost:5000/products/${productId}`,{ withCredentials: true }).subscribe(
        () => {
          console.log('Product deleted successfully');
          this.fetchProducts(); // Refresh the product list
        },
        (error) => {
          console.error('Failed to delete product:', error);
        }
      );
    }
  }
}

