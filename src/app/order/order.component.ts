import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-order',
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderForm!: FormGroup;
  user: any = null; // User data (prefilled)
  products: any[] = []; // All products
  selectedProduct: any = { quantity: 1 }; // Selected product with default quantity
  totalPrice: number = 0; // Total price of the order
  successMessage: string = '';
  failMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Fetch current user data if logged in
    this.authService.currentUser.subscribe((user) => {
      if (user) {
        this.user = user;
        this.initializeForm(user);
      }
    });

    // Fetch products data from the backend (assuming you have an API endpoint for this)
    this.http.get('http://localhost:5000/products').subscribe(
      (response: any) => {
        this.products = response.data; // Assuming backend returns products in `data`
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  // Initialize the form with default values
  initializeForm(user: any) {
    this.orderForm = this.fb.group({
      product: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      name: [user.name, [Validators.required]],
      phone: [user.phone, [Validators.required]],
      address: [user.address, [Validators.required]],
      email: [user.email, [Validators.required, Validators.email]],
      totalPrice: [this.totalPrice, Validators.required]
    });
  }

  // Handle product selection change and calculate total price
  onProductChange(event: any) {
    const selectedProductId = event.target.value;
    this.selectedProduct = this.products.find(product => product._id === selectedProductId);

    if (this.selectedProduct) {
      // Set the default quantity to 1 when product changes
      this.orderForm.controls['quantity'].setValue(1);
      this.calculateTotalPrice();
    }
  }

  // Calculate the total price based on the selected product and quantity
  calculateTotalPrice() {
    const quantity = this.orderForm.controls['quantity'].value;
    this.totalPrice = this.selectedProduct.price * quantity;
    this.orderForm.controls['totalPrice'].setValue(this.totalPrice);
  }

  // Submit the order form
  submitOrder() {
    if (this.orderForm.invalid) {
      this.failMessage = "Please fill out all required fields correctly.";
      return;
    }

    const orderData = {
      ...this.orderForm.value,
      product: this.selectedProduct._id,  // Ensure the selected product ID is included
      userId: this.user._id  // Include the user ID to associate the order
    };

    // Call your API to submit the order
    this.http.post('http://localhost:5000/orders', orderData, { withCredentials: true })
      .subscribe(
        response => {
          this.successMessage = "Your order has been placed successfully!";
          this.failMessage = ''; // Clear any previous error message
        },
        error => {
          this.failMessage = "There was an error placing your order. Please try again.";
          this.successMessage = ''; // Clear any previous success message
        }
      );
  }
}
