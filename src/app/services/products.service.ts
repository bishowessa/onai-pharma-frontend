import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }


  getProduct(id: string): Observable<any> {
    console.log('Fetching product with ID:', id);
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  createOrder(orderData: any) {
    return this.http.post('http://localhost:5000/orders', orderData);
  }
}

