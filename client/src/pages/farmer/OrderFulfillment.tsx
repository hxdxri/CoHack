import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { OrderManagementTable } from '@/components/ui/OrderManagementTable';
import { Order } from '@/types';
import toast from 'react-hot-toast';

// Mock order data for demonstration
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    farmerId: 'farmer-1',
    customerId: 'customer-1',
    customerName: 'Mike Tyson',
    customerEmail: 'mike.tyson@email.com',
    customerPhone: '+1 (555) 123-4567',
    items: [
      {
        id: 'item-1',
        productId: 'product-1',
        productName: 'Organic Heirloom Tomatoes',
        category: 'vegetables',
        quantity: 5,
        unit: 'lbs',
        price: 4.99,
        imageUrl: '/products/tomatoes.jpg'
      },
      {
        id: 'item-2',
        productId: 'product-2',
        productName: 'Fresh Spinach Bunches',
        category: 'vegetables',
        quantity: 3,
        unit: 'bunches',
        price: 3.50,
        imageUrl: '/products/spinach.jpg'
      }
    ],
    totalAmount: 33.45,
    status: 'out_for_delivery',
    orderDate: '2025-01-15T10:30:00.000Z',
    deliveryDate: '2025-01-15T16:00:00.000Z',
    deliveryAddress: '123 Main St, Apt 4B, San Francisco, CA 94102',
    notes: 'Please ring doorbell twice. Leave at door if no answer.',
    deliveryPin: '1234'
  },
  {
    id: 'ORD-002',
    farmerId: 'farmer-1',
    customerId: 'customer-2',
    customerName: 'Michael Chen',
    customerEmail: 'michael.chen@email.com',
    customerPhone: '+1 (555) 987-6543',
    items: [
      {
        id: 'item-3',
        productId: 'product-3',
        productName: 'Fresh Basil',
        category: 'vegetables',
        quantity: 2,
        unit: 'bunches',
        price: 2.99,
        imageUrl: '/products/basil.jpg'
      }
    ],
    totalAmount: 5.98,
    status: 'preparing',
    orderDate: '2025-01-15T14:20:00.000Z',
    deliveryDate: '2025-01-16T10:00:00.000Z',
    deliveryAddress: '456 Oak Avenue, Berkeley, CA 94704',
    notes: 'Customer prefers morning delivery',
    deliveryPin: '5678'
  },
  {
    id: 'ORD-003',
    farmerId: 'farmer-1',
    customerId: 'customer-3',
    customerName: 'Emily Rodriguez',
    customerEmail: 'emily.rodriguez@email.com',
    items: [
      {
        id: 'item-4',
        productId: 'product-4',
        productName: 'Organic Carrots',
        category: 'vegetables',
        quantity: 8,
        unit: 'lbs',
        price: 2.49,
        imageUrl: '/products/carrots.jpg'
      },
      {
        id: 'item-5',
        productId: 'product-5',
        productName: 'Fresh Lettuce',
        category: 'vegetables',
        quantity: 4,
        unit: 'heads',
        price: 1.99,
        imageUrl: '/products/lettuce.jpg'
      }
    ],
    totalAmount: 27.88,
    status: 'confirmed',
    orderDate: '2025-01-15T16:45:00.000Z',
    deliveryDate: '2025-01-17T14:00:00.000Z',
    pickupInstructions: 'Pick up at farm stand between 2-6 PM. Look for the green tent.',
    notes: 'Customer will pick up in person',
    deliveryPin: '9999'
  },
  {
    id: 'ORD-004',
    farmerId: 'farmer-1',
    customerId: 'customer-4',
    customerName: 'David Kim',
    customerEmail: 'david.kim@email.com',
    customerPhone: '+1 (555) 456-7890',
    items: [
      {
        id: 'item-6',
        productId: 'product-6',
        productName: 'Fresh Strawberries',
        category: 'fruits',
        quantity: 3,
        unit: 'pints',
        price: 5.99,
        imageUrl: '/products/strawberries.jpg'
      }
    ],
    totalAmount: 17.97,
    status: 'delivered',
    orderDate: '2025-01-14T09:15:00.000Z',
    deliveryDate: '2025-01-14T15:30:00.000Z',
    deliveryAddress: '789 Pine Street, Oakland, CA 94601',
    notes: 'Delivered successfully',
    deliveryPin: '2468',
    rating: 5,
    review: 'Excellent quality strawberries! Very fresh and sweet.'
  }
];

/**
 * Order Fulfillment Page
 * 
 * Main page for farmers to manage and fulfill customer orders.
 * Features order management table, status updates, and delivery confirmation.
 */
export const OrderFulfillment: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = [
    { value: 'all', label: 'All Orders', count: 0 },
    { value: 'pending', label: 'Pending Delivery', count: 0 },
    { value: 'confirmed', label: 'Confirmed', count: 0 },
    { value: 'preparing', label: 'Preparing', count: 0 },
    { value: 'ready', label: 'Ready for Pickup', count: 0 },
    { value: 'out_for_delivery', label: 'Out for Delivery', count: 0 },
    { value: 'delivered', label: 'Delivered', count: 0 },
    { value: 'cancelled', label: 'Cancelled', count: 0 }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, searchTerm]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be:
      // const response = await ordersAPI.getMyOrders();
      // setOrders(response.data);
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.customerEmail.toLowerCase().includes(term) ||
        order.items.some(item => 
          item.productName.toLowerCase().includes(term)
        )
      );
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      // In a real app, this would be:
      // await ordersAPI.updateOrderStatus(orderId, { status });
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );
      
      toast.success(`Order ${orderId} status updated to ${status.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusCounts = () => {
    const counts = statusOptions.map(option => ({
      ...option,
      count: option.value === 'all' 
        ? orders.length 
        : orders.filter(order => order.status === option.value).length
    }));
    return counts;
  };

  const getStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => 
      ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(order.status)
    ).length;
    const deliveredToday = orders.filter(order => 
      order.status === 'delivered' && 
      new Date(order.deliveryDate || order.orderDate).toDateString() === new Date().toDateString()
    ).length;
    const totalRevenue = orders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return { totalOrders, pendingOrders, deliveredToday, totalRevenue };
  };

  const stats = getStats();
  const statusCounts = getStatusCounts();

  return (
    <div className="page-content">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ink mb-2">
              Order Fulfillment 📦
            </h1>
            <p className="text-graphite">
              Manage and fulfill customer orders efficiently
            </p>
          </div>
          <Button
            variant="outline"
            onClick={fetchOrders}
            disabled={isLoading}
            className="self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-graphite">Total Orders</p>
                <p className="text-2xl font-bold text-ink">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-graphite">Pending</p>
                <p className="text-2xl font-bold text-ink">{stats.pendingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-graphite">Delivered Today</p>
                <p className="text-2xl font-bold text-ink">{stats.deliveredToday}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-graphite">Total Revenue</p>
                <p className="text-2xl font-bold text-ink">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite w-5 h-5" />
          <input
            type="text"
            placeholder="Search orders by ID, customer name, or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-lg bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {statusCounts.map((option) => (
          <button
            key={option.value}
            onClick={() => setStatusFilter(option.value)}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              statusFilter === option.value
                ? 'bg-primary-500 text-white'
                : 'bg-white text-graphite hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {option.label}
            {option.count > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 bg-white text-primary-500 text-xs font-bold rounded-full">
                {option.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <OrderManagementTable
        orders={filteredOrders}
        onUpdateOrderStatus={updateOrderStatus}
        isLoading={isLoading}
      />
    </div>
  );
};
