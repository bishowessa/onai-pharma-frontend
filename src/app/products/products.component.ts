import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [RouterLink,FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = []; // New array for filtered products
  searchQuery: string = ''; // For tracking the search query
  isAdmin = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.checkAdminStatus();
  }

  fetchProducts() {
    this.http.get('https://onai-pharma-backend-2.onrender.com/products').subscribe(
      (response: any) => {
        if (response?.status === 'success' && Array.isArray(response.data)) {
          this.products = response.data;
          this.filteredProducts = [...this.products]; // Initially display all products
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
    this.authService.currentUser.subscribe(user => {
      this.isAdmin = user?.role === 'admin';
    });
  }

  navigateToOrder(productId: string) {
    this.router.navigate(['/order', productId]);
  }

  navigateToDetails(productId: string) {
    this.router.navigate(['/products', productId]);
  }

  deleteProduct(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.http.delete(`https://onai-pharma-backend-2.onrender.com/products/${productId}`, { withCredentials: true }).subscribe(
        () => {
          console.log('Product deleted successfully');
          this.fetchProducts();
        },
        (error) => {
          console.error('Failed to delete product:', error);
        }
      );
    }
  }

  searchProducts(): void {
    this.filteredProducts = this.products
      .filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
  }
}
