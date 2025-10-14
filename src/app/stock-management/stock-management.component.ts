import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-stock-management',
  imports: [FormsModule, ReactiveFormsModule, CurrencyPipe, NgFor, NgIf],
  templateUrl: './stock-management.component.html',
  styleUrls: ['./stock-management.component.css'],
})
export class StockManagementComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchQuery: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Ensure the session is restored (this call will update isLoggedIn/currentUser)
    this.authService.checkLoginStatus();

    // Subscribe to login status and current user to check admin privileges
    this.authService.isLoggedIn.subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        this.router.navigate(['/login']);
      } else {
        const currentUser = this.authService.currentUser.getValue();
        if (currentUser && currentUser.role === 'admin') {
          this.fetchProducts();
        } else {
          this.router.navigate(['/']);
        }
      }
    });
  }

  fetchProducts(): void {
    // Note: We do not add custom headers here since withCredentials will send cookies.
    this.http
      .get('https://onai-pharma-backend-2.onrender.com/products', { withCredentials: true })
      .subscribe(
        (res: any) => {
          if (res && res.data) {
            this.products = res.data;
            // Sort the products by stock in ascending order
            this.products.sort((a, b) => a.stock - b.stock);
            this.filteredProducts = [...this.products];
          }
        },
        (err) => {
          console.error('Error fetching products:', err);
        }
      );
  }

  searchProducts(): void {
    this.filteredProducts = this.products
      .filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
      .sort((a, b) => a.stock - b.stock);
  }

  addStock(productId: string, currentStock: number): void {
    const additionalStock = prompt(
      'Enter the number of units to add to stock:',
      '0'
    );
    if (
      additionalStock !== null &&
      !isNaN(Number(additionalStock)) &&
      Number(additionalStock) > 0
    ) {
      const stockData = {
        additionalStock: Number(additionalStock),
      };

      const url = `https://onai-pharma-backend-2.onrender.com/products/addStock/${productId}`;

      this.http
        .patch(url, stockData, { withCredentials: true })
        .subscribe(
          (res) => {
            alert('Stock updated successfully');
            this.fetchProducts(); // Refresh the product list
          },
          (err) => {
            console.error('Error adding stock for product ID:', productId, err);
          }
        );
    }
  }
}