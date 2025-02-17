import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  editProductForm: FormGroup;
  productId: string;
  productImage: string | ArrayBuffer | null =''

  imageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editProductForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, Validators.required],
      stock: [0, Validators.required]
    });
    this.productId = '';
  }

  ngOnInit(): void {
    // Extract the product ID from the query params
    this.route.queryParams.subscribe((params) => {
      this.productId = params['productId'];
      if (this.productId) {
        this.fetchProductDetails();
      }
    });
  }

  fetchProductDetails(): void {
    this.http.get(`http://localhost:5000/products/${this.productId}`).subscribe(
      (response: any) => {
        if (response?.status === 'success' && response.data) {
          const product = response.data;
          this.editProductForm.patchValue({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock
          });
          this.productImage = product.image || '';
        }
      },
      (error) => {
        console.error('Failed to fetch product details:', error);
      }
    );
  }

  onImageSelected(event: any): void {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      this.imageFile = selectedImage;

      // Display the selected image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.productImage = e.target?.result as string | ArrayBuffer | null;
      };
      reader.readAsDataURL(selectedImage);
    }
  }

  updateProduct(): void {
    if (this.editProductForm.invalid) {
      console.warn('Form is invalid.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.editProductForm.get('name')?.value);
    formData.append('description', this.editProductForm.get('description')?.value);
    formData.append('price', this.editProductForm.get('price')?.value.toString());
    formData.append('stock', this.editProductForm.get('stock')?.value.toString());

    if (this.imageFile) {
      formData.append('image', this.imageFile, this.imageFile.name);
    }

    this.http
      .patch(`http://localhost:5000/products/${this.productId}`, formData, {
        withCredentials: true
      })
      .subscribe(
        (response) => {
          this.router.navigate(['/products']);
        },
        (error) => {
          console.error('Error updating product:', error);
        }
      );
  }
}
