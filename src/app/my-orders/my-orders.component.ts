import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-orders',
  imports: [NgFor, NgIf, RouterLink,FormsModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  completedOrders: any[] = [];
  canceledOrders: any[] = [];
  filteredOrders: any[] = [];
  filteredCompletedOrders: any[] = [];
  filteredCanceledOrders: any[] = [];
  isAdmin = false;
  editingOrderId: string | null = null;
  productOptions: any[] = [];
  totalCash: number = 0;
  searchTerm: string = ''; // New property for search

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkAdminStatus();
    this.fetchOrders();
    this.fetchProductOptions();
    this.authService.restoreSession();
  }

  checkAdminStatus() {
    this.authService.currentUser.subscribe(user => {
      this.isAdmin = user?.role === 'admin';
    });
  }

  fetchOrders() {
    const url = this.isAdmin ? 'https://onai-pharma-backend-2.onrender.com/orders' : 'https://onai-pharma-backend-2.onrender.com/orders/my-orders';
    this.http.get(url, { withCredentials: true }).subscribe((response: any) => {
      if (response?.status === 'success') {
        this.orders = response.data.filter((order: any) => order.status === 'Pending');
        this.completedOrders = response.data.filter((order: any) => order.status === 'Completed');
        this.canceledOrders = response.data.filter((order: any) => order.status === 'Cancelled');

        this.calculateTotalCash();
        this.filterOrders(); // Apply initial filtering

        response.data.forEach((order: any) => {
          if (!order.user || !order.user.name || !order.user.phone || !order.user.address) {
            console.warn('Order has missing user data:', order);
          }
        });
      }
    }, error => {
      console.error('Error fetching orders:', error);
    });
  }

  fetchProductOptions() {
    this.http.get('https://onai-pharma-backend-2.onrender.com/products', { withCredentials: true }).subscribe((response: any) => {
      if (response?.status === 'success') {
        this.productOptions = response.data;
      }
    }, error => {
      console.error('Error fetching product options:', error);
    });
  }

  calculateTotalCash() {
    this.totalCash = this.completedOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  }

  markAsCompleted(orderId: string) {
    if (confirm('Are you sure you want to mark this order as completed?')) {
      this.http.patch(`https://onai-pharma-backend-2.onrender.com/orders/${orderId}`, { status: 'Completed' }, { withCredentials: true })
        .subscribe(() => {
          this.fetchOrders();
        }, error => {
          console.error('Error updating order status:', error);
        });
    }
  }

  restoreOrder(orderId: string) {
    if (confirm('Are you sure you want to restore this order to pending status?')) {
      this.http.patch(`https://onai-pharma-backend-2.onrender.com/orders/${orderId}`, { status: 'Pending' }, { withCredentials: true })
        .subscribe(() => {
          this.fetchOrders();
        }, error => {
          console.error('Error restoring order:', error);
        });
    }
  }

  cancelOrder(orderId: string) {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.http.patch(`https://onai-pharma-backend-2.onrender.com/orders/${orderId}`, { status: 'Cancelled' }, { withCredentials: true })
        .subscribe(() => {
          // 
          this.fetchOrders();
        }, error => console.error('Error canceling order:', error));
    }
  }

  deleteOrder(orderId: string) {
    if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      this.http.delete(`https://onai-pharma-backend-2.onrender.com/orders/${orderId}`, { withCredentials: true })
        .subscribe(() => {
          // 
          this.fetchOrders();
        }, error => console.error('Error deleting order:', error));
    }
  }

  // Search function
  filterOrders(): void {
    // 
  
    if (!this.searchTerm.trim()) {
      this.filteredOrders = [...this.orders];
      this.filteredCompletedOrders = [...this.completedOrders];
      this.filteredCanceledOrders = [...this.canceledOrders];
      // 
      return;
    }
  
    const searchLower = this.searchTerm.toLowerCase();
  
    const filterByCriteria = (order: any) => {
      const productNames = order.products.map((p: any) => p.product?.name?.toLowerCase() || '').join(', ');
  
      return (
        order._id.toLowerCase().includes(searchLower) ||
        (order.user?.name?.toLowerCase().includes(searchLower) || '') ||
        (order.user?.phone?.toLowerCase().includes(searchLower) || '') ||
        (order.user?.address?.toLowerCase().includes(searchLower) || '') ||
        (order.totalPrice?.toString().includes(searchLower) || '') ||
        productNames.includes(searchLower)
      );
    };
  
    this.filteredOrders = this.orders.filter(filterByCriteria);
    this.filteredCompletedOrders = this.completedOrders.filter(filterByCriteria);
    this.filteredCanceledOrders = this.canceledOrders.filter(filterByCriteria);
  
    // 
    // 
    // 
  }
  
}
