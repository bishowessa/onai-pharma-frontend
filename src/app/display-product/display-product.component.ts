import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/products.service'; // Your product service

@Component({
  selector: 'app-display-product-component',
  imports: [],
  templateUrl: './display-product.component.html',
  styleUrl: './display-product.component.css'
})
export class DisplayProductComponent implements OnInit {
  // display-product.component.ts
  product: any;
  productId!: string;  // Use the non-null assertion operator

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(this.productId).subscribe(
      (product) => {
        this.product = product;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}



