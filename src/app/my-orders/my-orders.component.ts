import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  imports: [NgFor,NgIf,RouterLink],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  completedOrders: any[] = [];
  canceledOrders: any[] = [];
  isAdmin = false;
  editingOrderId: string | null = null;
  productOptions: any[] = [];

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
    const url = this.isAdmin ? 'http://localhost:5000/orders' : 'http://localhost:5000/orders/my-orders';
    this.http.get(url, { withCredentials: true }).subscribe((response: any) => {
      if (response?.status === 'success') {
        console.log('Orders fetched:', response.data);
        this.orders = response.data.filter((order: any) => order.status === 'Pending');
        this.completedOrders = response.data.filter((order: any) => order.status === 'Completed');
        this.canceledOrders = response.data.filter((order: any) => order.status === 'Cancelled');
  
        // Log any orders with missing user data for debugging
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
    this.http.get('http://localhost:5000/products', { withCredentials: true }).subscribe((response: any) => {
      if (response?.status === 'success') {
        this.productOptions = response.data;
      }
    }, error => {
      console.error('Error fetching product options:', error);
    });
  }

  markAsCompleted(orderId: string) {
    if (confirm('Are you sure you want to mark this order as completed?')) {
      this.http.patch(`http://localhost:5000/orders/${orderId}`, { status: 'Completed' }, { withCredentials: true })
        .subscribe(() => this.fetchOrders(), error => console.error('Error updating order status:', error));
    }
  }

  cancelOrder(orderId: string) {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.http.patch(`http://localhost:5000/orders/${orderId}`, { status: 'Cancelled' }, { withCredentials: true })
        .subscribe(() => this.fetchOrders(), error => console.error('Error canceling order:', error));
    }
  }

  restoreOrder(orderId: string) {
    if (confirm('Are you sure you want to restore this order to pending status?')) {
      this.http.patch(`http://localhost:5000/orders/${orderId}`, { status: 'Pending' }, { withCredentials: true })
        .subscribe(() => this.fetchOrders(), error => console.error('Error restoring order:', error));
    }
  }

  deleteOrder(orderId: string) {
    if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      this.http.delete(`http://localhost:5000/orders/${orderId}`, { withCredentials: true })
        .subscribe(() => this.fetchOrders(), error => console.error('Error deleting order:', error));
    }
  }

  startEditOrder(orderId: string) {
    this.editingOrderId = orderId;
  }

  saveOrder(order: any) {
    const url = `http://localhost:5000/orders/${order._id}`;
    if (confirm('Are you sure you want to save changes to this order?')) {
      this.http.patch(url, order, { withCredentials: true }).subscribe(() => {
        this.editingOrderId = null; // Stop editing
        this.fetchOrders(); // Refresh the order list
      }, error => {
        console.error('Error saving order:', error);
      });
    }
  }
}
