import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://onai-pharma-backend-2.onrender.com/products';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Helper function to get headers with the JWT token
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getProducts(): Observable<any> {
    
    return this.http.get<any>(`${this.apiUrl}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getProduct(id: string): Observable<any> {
    
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteProduct(id: string): Observable<any> {
    
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createOrder(orderData: any) {
    
    return this.http.post('https://onai-pharma-backend-2.onrender.com/orders', orderData, {
      headers: this.getAuthHeaders(),
    });
  }

  getProductsByStock(headers: HttpHeaders) {
    return this.http.get('https://onai-pharma-backend-2.onrender.com/products', { headers });
  }

  updateProductStock(productId: string, newStock: number, headers: HttpHeaders) {
    return this.http.patch(`https://onai-pharma-backend-2.onrender.com/products/${productId}`, { stock: newStock }, { headers });
  }

  addStockToProduct(productId: string, formData: FormData, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/add-stock/${productId}`; // The URL to handle adding stock to a specific product

    return this.http.patch(url, formData, { headers }); // Sending a PATCH request to the backend
  }


  searchProductsByName(searchTerm: string): Observable<any[]> {
    
    return this.http.get<any[]>(`${this.apiUrl}/search?name=${searchTerm}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
