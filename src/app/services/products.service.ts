import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/products';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Helper function to get headers with the JWT token
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getProducts(): Observable<any> {
    console.log('GET request to fetch all products');
    return this.http.get<any>(`${this.apiUrl}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getProduct(id: string): Observable<any> {
    console.log(`GET request to fetch product with ID: ${id}`);
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteProduct(id: string): Observable<any> {
    console.log(`DELETE request to delete product with ID: ${id}`);
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createOrder(orderData: any) {
    console.log('POST request to create order:', orderData);
    return this.http.post('http://localhost:5000/orders', orderData, {
      headers: this.getAuthHeaders(),
    });
  }

  getProductsByStock(headers: HttpHeaders) {
    return this.http.get('http://localhost:5000/products', { headers });
  }

  updateProductStock(productId: string, newStock: number, headers: HttpHeaders) {
    return this.http.patch(`http://localhost:5000/products/${productId}`, { stock: newStock }, { headers });
  }

  addStockToProduct(productId: string, formData: FormData, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/add-stock/${productId}`; // The URL to handle adding stock to a specific product

    return this.http.patch(url, formData, { headers }); // Sending a PATCH request to the backend
  }


  searchProductsByName(searchTerm: string): Observable<any[]> {
    console.log(`GET request to search products by name: ${searchTerm}`);
    return this.http.get<any[]>(`${this.apiUrl}/search?name=${searchTerm}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
