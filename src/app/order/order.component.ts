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

        // Prefill the selected product if a product ID is provided
        if (selectedProductId) {
          const selectedProduct = this.products.find(product => product._id === selectedProductId);
          if (selectedProduct) {
            this.orderForm.controls['product'].setValue(selectedProductId);
            this.orderForm.controls['quantity'].setValue(1);
          }
        }
      },
      (error) => {
        console.error('Error fetching products:', error);
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
    }
  }

  calculateTotalPrice() {
    this.totalPrice = this.selectedProducts.reduce(
      (total, product) => total + (product.price * product.quantity),
      0
    );
  }

  submitOrder() {
    if (this.orderForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.orderForm.markAllAsTouched();
      return;
    }
  
    const orderData = {
      products: this.selectedProducts.map(product => ({
        product: product._id, // Ensure this is the correct field for the product ID
        quantity: product.quantity,
      }))
    };
  
    this.http.post('http://localhost:5000/orders', orderData, { withCredentials: true })
      .subscribe(
        response => {
          console.log('Order placed successfully', response);
          this.successMessage = 'Order placed successfully!, You will be contacted soon';
          setTimeout(() => {
            this.successMessage = '';
            
          }, 4000);
          this.selectedProducts = []; // Clear selected products after a successful order
          this.totalPrice = 0;        // Reset total price
          this.orderForm.reset();     // Reset form fields
          this.initializeForm(this.user);
        },
        error => {
          console.error('Error placing order', error);
          this.failMessage = 'Failed to place the order. Please try again.';
        }
      );
  }
  
}



