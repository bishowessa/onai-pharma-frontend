import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
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
  user: any = null; // User data
  products: any[] = []; // All products
  selectedProducts: any[] = []; // Products selected for the order
  totalPrice: number = 0; // Cumulative total price
  successMessage: string = '';
  failMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Fetch the selected product ID from query params
    const selectedProductId = this.route.snapshot.queryParamMap.get('productId');

    // Fetch user data if logged in
    this.authService.currentUser.subscribe((user) => {
      this.user = user;
      this.initializeForm(user);
    });

    // Fetch all products
    this.http.get('http://localhost:5000/products').subscribe(
      (response: any) => {
        this.products = response.data;
        
        // Prefill the selected product if provided
        if (selectedProductId) {
          const selectedProduct = this.products.find(product => product._id === selectedProductId);
          if (selectedProduct) {
            this.addProductToOrder(selectedProduct);
          }
        }
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  // Initialize the order form
  initializeForm(user: any) {
    this.orderForm = this.fb.group({
      product: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      name: [user?.name || '', [Validators.required]],
      phone: [user?.phone || '', [Validators.required]],
      address: [user?.address || '', [Validators.required]],
      email: [user?.email || '', [Validators.required, Validators.email]]
    });
  }

  // Add a product to the order
  addProductToOrder(productId: string) {
    const product = this.products.find(p => p._id === productId);
    
    if (product) {
      const quantity = this.orderForm.controls['quantity'].value;
  
      // Check if the product is already in the selectedProducts array
      const existingProduct = this.selectedProducts.find(p => p._id === productId);
  
      if (existingProduct) {
        // If the product is already in the list, just update the quantity
        existingProduct.quantity += quantity;
      } else {
        // Add a new product entry
        const productOrder = { ...product, quantity };
        this.selectedProducts.push(productOrder);
      }
  
      // Recalculate the total price
      this.calculateTotalPrice();
    }
  }
  

  // Handle product selection change
  onProductChange(event: any) {
    const selectedProductId = event.target.value;
  
    // Find the selected product but do not add it to the order yet
    const selectedProduct = this.products.find(product => product._id === selectedProductId);
  
    if (selectedProduct) {
      this.orderForm.controls['quantity'].setValue(1); // Reset quantity to 1
    }
  }
  

  // Calculate the total price for all selected products
  calculateTotalPrice() {
    this.totalPrice = this.selectedProducts.reduce(
      (total, product) => total + (product.price * product.quantity),
      0
    );
  }

  // Submit the order
  submitOrder() {
    if (this.orderForm.invalid || this.selectedProducts.length === 0) {
      this.failMessage = "Please fill out all required fields and select at least one product.";
      setTimeout(() => {
        this.failMessage = '';
      }, 3000);
      return;
    }

    const orderData = {
      products: this.selectedProducts.map(product => ({
        productId: product._id,
        quantity: product.quantity
      })),
      user: {
        name: this.orderForm.controls['name'].value,
        phone: this.orderForm.controls['phone'].value,
        address: this.orderForm.controls['address'].value,
        email: this.orderForm.controls['email'].value
      }
    };

    this.http.post('http://localhost:5000/orders', orderData, { withCredentials: true })
      .subscribe(
        response => {
          this.successMessage = "Your order has been placed successfully!";
          this.failMessage = '';
          this.selectedProducts = []; // Clear the selected products
          this.totalPrice = 0; // Reset total price
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error => {
          this.failMessage = "There was an error placing your order. Please try again.";
          this.successMessage = '';
          setTimeout(() => {
            this.failMessage = '';
          }, 3000);
        }
      );
  }
}
