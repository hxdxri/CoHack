import { Order } from '../types';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const DATA_FILE = path.join(__dirname, '../../data/orders.json');

class OrderModel {
  private static orders: Order[] = [];

  static {
    this.loadOrders();
  }

  private static loadOrders() {
    try {
      const data = readFileSync(DATA_FILE, 'utf8');
      this.orders = JSON.parse(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      this.orders = [];
    }
  }

  private static saveOrders() {
    try {
      writeFileSync(DATA_FILE, JSON.stringify(this.orders, null, 2));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  }

  static getAll(): Order[] {
    return [...this.orders];
  }

  static findById(id: string): Order | null {
    return this.orders.find(order => order.id === id) || null;
  }

  static findByCustomerId(customerId: string): Order[] {
    return this.orders.filter(order => order.customerId === customerId);
  }

  static findByFarmerId(farmerId: string): Order[] {
    return this.orders.filter(order => order.farmerId === farmerId);
  }

  static create(orderData: Omit<Order, 'id' | 'orderDate'>): Order {
    const order: Order = {
      ...orderData,
      id: `order_${Date.now()}`,
      orderDate: new Date().toISOString(),
    };

    this.orders.push(order);
    this.saveOrders();
    return order;
  }

  static update(id: string, updates: Partial<Order>): Order | null {
    const index = this.orders.findIndex(order => order.id === id);
    if (index === -1) return null;

    this.orders[index] = { ...this.orders[index], ...updates };
    this.saveOrders();
    return this.orders[index];
  }

  static delete(id: string): boolean {
    const index = this.orders.findIndex(order => order.id === id);
    if (index === -1) return false;

    this.orders.splice(index, 1);
    this.saveOrders();
    return true;
  }

  static updateStatus(id: string, status: Order['status']): Order | null {
    return this.update(id, { status });
  }

  static addRating(id: string, rating: number, review: string): Order | null {
    return this.update(id, { rating, review });
  }

  static verifyDeliveryPin(id: string, pin: string): boolean {
    const order = this.findById(id);
    return order ? order.deliveryPin === pin : false;
  }
}

export { OrderModel };
