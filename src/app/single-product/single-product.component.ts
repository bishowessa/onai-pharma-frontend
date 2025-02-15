import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/products.service'; // Your product service
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-single-product',
  imports: [RouterLink],
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css']
})
export class SingleProductComponent implements OnInit {

  isAdmin= false;
   product: any;
   productId!: string;  // Use the non-null assertion operator
  
   constructor(
     private route: ActivatedRoute,
     private productService: ProductService
      ,private authService: AuthService,
      private router: Router
   ) { }
  
   ngOnInit(): void {
    this.checkAdminStatus();
     this.productId = this.route.snapshot.paramMap.get('id')!; // Get the product ID from the route
     this.productService.getProduct(this.productId).subscribe(
       (response) => {
         this.product = response.data; // Extract the product data from the response
       },
       (error) => {
         console.error(error); // Handle error if fetching fails
       }
     );
   }

   checkAdminStatus() {
    // console.log('Checking admin status...');
    this.authService.currentUser.subscribe(user => {
      // console.log('Current user:', user);
      this.isAdmin = user?.role === 'admin';
      console.log('Is admin:', this.isAdmin);
    });
  }

  navigateToOrder(productId: string) {
    // console.log('Navigating to order for product ID:', productId);
    this.router.navigate(['/order', productId]);
  }

}
