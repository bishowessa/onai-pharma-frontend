import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
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
  user: any = null;
  products: any[] = [];
  selectedProducts: any[] = [];
  totalPrice: number = 0;
  successMessage: string = '';
  failMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const selectedProductId = this.route.snapshot.queryParamMap.get('productId');

    this.authService.currentUser.subscribe((user) => {
      this.user = user;
      this.initializeForm(user);
    });

    this.http.get('https://onai-pharma-backend-2.onrender.com/products').subscribe(
      (response: any) => {
        this.products = response.data;
        if (selectedProductId) {
          const selectedProduct = this.products.find(product => product._id === selectedProductId);
          if (selectedProduct) {
            this.orderForm.controls['product'].setValue(selectedProductId);
            this.orderForm.controls['quantity'].setValue(1);
          }
        }
      },
      (error) => {
        this.failMessage = 'Error fetching products. Please try again later.';
        setTimeout(() => {
          this.failMessage = '';
        }, 3000);
      }
    );
  }

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

  addProductToOrder() {
    const selectedProductId = this.orderForm.controls['product'].value;
    const quantity = this.orderForm.controls['quantity'].value;

    if (!selectedProductId) {
      this.failMessage = 'Please select a product before adding it to your order.';
      setTimeout(() => {
        this.failMessage = '';
      }, 3000);
      return;
    }

    if (quantity < 1) {
      this.failMessage = 'Please specify a valid quantity.';
      setTimeout(() => {
        this.failMessage = '';
      }, 3000);
      return;
    }

    const product = this.products.find(p => p._id === selectedProductId);
    if (product) {
      const existingProduct = this.selectedProducts.find(p => p._id === selectedProductId);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        const productOrder = { ...product, quantity };
        this.selectedProducts.push(productOrder);
      }
      this.calculateTotalPrice();
      this.successMessage = 'Product added to order successfully!';
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    } else {
      this.failMessage = 'Product not found. Please try again.';
      setTimeout(() => {
        this.failMessage = '';
      }, 3000);
    }
  }

  calculateTotalPrice() {
    this.totalPrice = this.selectedProducts.reduce(
      (total, product) => total + (product.price * product.quantity),
      0
    );
  }

  submitOrder() {
    if (!this.user) {
      this.failMessage = `Sorry, you need to log in first. 
        <a href="/login">Login now</a>. 
        No account? <a href="/register">Register here</a>.`;
      return;
    }

    if (this.selectedProducts.length === 0) {
      this.failMessage = 'No products in the order. Please add products before submitting.';
      setTimeout(() => {
        this.failMessage = '';
      }, 3000);
      return;
    }

    if (this.orderForm.invalid) {
      this.failMessage = 'Please fill out all required fields before placing your order.';
      this.orderForm.markAllAsTouched();
      setTimeout(() => {
        this.failMessage = '';
      }, 3000);
      return;
    }

    const orderData = {
      products: this.selectedProducts.map(product => ({
        product: product._id,
        quantity: product.quantity,
      }))
    };

    this.http.post('https://onai-pharma-backend-2.onrender.com/orders', orderData, { withCredentials: true })
      .subscribe(
        response => {
          this.successMessage = 'Order placed successfully! You will be contacted soon.';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
          this.selectedProducts = [];
          this.totalPrice = 0;
          this.orderForm.reset();
          this.initializeForm(this.user);
        },
        error => {
          this.failMessage = 'Failed to place the order. Please try again.';
          setTimeout(() => {
            this.failMessage = '';
          }, 3000);
        }
      );
  }
}
