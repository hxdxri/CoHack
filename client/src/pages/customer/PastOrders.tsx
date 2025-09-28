import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Calendar, 
  MapPin, 
  Star, 
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ShoppingBag
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

// Mock order data - in a real app this would come from an API
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  imageUrl?: string;
}

interface Order {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  farmLocation: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  notes?: string;
  rating?: number;
  review?: string;
}

const mockOrders: Order[] = [
  {
    id: 'order-1',
    farmerId: 'farmer-1',
    farmerName: 'Sarah Johnson',
    farmName: 'Green Valley Organic Farm',
    farmLocation: 'Sonoma County, CA',
    items: [
      {
        id: 'item-1',
        productId: 'product-1',
        productName: 'Organic Heirloom Tomatoes',
        category: 'vegetables',
        quantity: 5,
        unit: 'lbs',
        price: 4.99
      },
      {
        id: 'item-2',
        productId: 'product-2',
        productName: 'Fresh Spinach Bunches',
        category: 'vegetables',
        quantity: 3,
        unit: 'bunches',
        price: 3.50
      }
    ],
    totalAmount: 33.45,
    status: 'completed',
    orderDate: '2025-09-20T10:30:00.000Z',
    deliveryDate: '2025-09-22T14:00:00.000Z',
    notes: 'Please leave at front door if no answer',
    rating: 5,
    review: 'Excellent quality produce! The tomatoes were perfectly ripe and the spinach was fresh and crisp.'
  },
  {
    id: 'order-2',
    farmerId: 'farmer-2',
    farmerName: 'Michael Thompson',
    farmName: 'Sunrise Meadows Dairy',
    farmLocation: 'Vermont, New England',
    items: [
      {
        id: 'item-3',
        productId: 'product-3',
        productName: 'Fresh Whole Milk',
        category: 'dairy',
        quantity: 2,
        unit: 'gallons',
        price: 6.99
      },
      {
        id: 'item-4',
        productId: 'product-4',
        productName: 'Aged Cheddar Cheese',
        category: 'dairy',
        quantity: 1,
        unit: 'lb',
        price: 18.99
      }
    ],
    totalAmount: 32.97,
    status: 'ready',
    orderDate: '2025-09-25T15:45:00.000Z',
    deliveryDate: '2025-09-27T10:00:00.000Z',
    notes: 'Please keep refrigerated'
  },
  {
    id: 'order-3',
    farmerId: 'farmer-3',
    farmerName: 'David Rodriguez',
    farmName: 'Mountain View Apple Orchard',
    farmLocation: 'Hudson Valley, NY',
    items: [
      {
        id: 'item-5',
        productId: 'product-5',
        productName: 'Honeycrisp Apples',
        category: 'fruits',
        quantity: 10,
        unit: 'lbs',
        price: 3.99
      }
    ],
    totalAmount: 39.90,
    status: 'preparing',
    orderDate: '2025-09-26T09:15:00.000Z',
    deliveryDate: '2025-09-28T16:00:00.000Z'
  }
];

/**
 * Past Orders Page
 * 
 * Shows customer's order history with status tracking, order details,
 * and ability to reorder or contact farmers.
 */
export const PastOrders: React.FC = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'preparing':
        return <Package className="w-4 h-4" />;
      case 'ready':
        return <Truck className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'primary';
      case 'preparing':
        return 'primary';
      case 'ready':
        return 'success';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending Confirmation';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready for Pickup';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vegetables': return '🥕';
      case 'fruits': return '🍎';
      case 'dairy': return '🥛';
      case 'grains': return '🌾';
      case 'meat': return '🥩';
      default: return '📦';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  );

  const handleReorder = (order: Order) => {
    // In a real app, this would add items to cart or create a new order
    toast.success(`Reordering from ${order.farmName}...`);
  };

  const handleContactFarmer = (farmerId: string, farmerName: string) => {
    // In a real app, this would open messages with the farmer
    toast.success(`Opening chat with ${farmerName}`);
  };

  const handleRateOrder = (orderId: string) => {
    // In a real app, this would open a rating modal
    toast.success('Opening rating form...');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink mb-2">
          Past Orders 📦
        </h1>
        <p className="text-graphite">
          Track your order history and manage your purchases
        </p>
      </div>

      {/* Filter Tabs */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-graphite hover:bg-gray-200'
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterStatus === 'completed'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-graphite hover:bg-gray-200'
              }`}
            >
              Completed ({orders.filter(o => o.status === 'completed').length})
            </button>
            <button
              onClick={() => setFilterStatus('preparing')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterStatus === 'preparing'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-graphite hover:bg-gray-200'
              }`}
            >
              In Progress ({orders.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)).length})
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-graphite mb-2">
              {filterStatus === 'all' ? 'No orders yet' : `No ${filterStatus} orders`}
            </h3>
            <p className="text-graphite mb-6">
              {filterStatus === 'all' 
                ? 'Start shopping to see your orders here'
                : `You don't have any ${filterStatus} orders at the moment`
              }
            </p>
            <Link to="/customer/dashboard">
              <Button variant="primary">
                <Package className="w-4 h-4 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} hover className="group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-bold text-ink mr-3">
                        Order #{order.id.split('-')[1].toUpperCase()}
                      </h3>
                      <Badge 
                        variant={getStatusColor(order.status) as any}
                        className="flex items-center"
                      >
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusText(order.status)}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center text-graphite text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{order.farmName} • {order.farmLocation}</span>
                    </div>
                    <div className="flex items-center text-graphite text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Ordered on {formatDate(order.orderDate)}</span>
                      {order.deliveryDate && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Delivery: {formatDate(order.deliveryDate)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-500">
                      ${order.totalAmount.toFixed(2)}
                    </div>
                    <div className="text-sm text-graphite">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-ink mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-mist rounded-lg">
                        <div className="flex items-center">
                          <span className="text-lg mr-3">{getCategoryIcon(item.category)}</span>
                          <div>
                            <span className="text-sm font-medium text-ink">{item.productName}</span>
                            <div className="text-xs text-graphite">
                              {item.quantity} {item.unit}s
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-primary-500">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Notes */}
                {order.notes && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <h5 className="text-sm font-medium text-ink mb-1">Order Notes</h5>
                    <p className="text-sm text-graphite">{order.notes}</p>
                  </div>
                )}

                {/* Review Section */}
                {order.status === 'completed' && order.rating && order.review && (
                  <div className="mb-4 p-4 bg-green-50 rounded-lg">
                    <h5 className="text-sm font-medium text-ink mb-2">Your Review</h5>
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= order.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-graphite">{order.review}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => handleReorder(order)}
                    variant="outline"
                    size="sm"
                  >
                    <Package className="w-4 h-4 mr-1" />
                    Reorder
                  </Button>
                  <Button
                    onClick={() => handleContactFarmer(order.farmerId, order.farmerName)}
                    variant="outline"
                    size="sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Contact Farmer
                  </Button>
                  {order.status === 'completed' && !order.rating && (
                    <Button
                      onClick={() => handleRateOrder(order.id)}
                      variant="primary"
                      size="sm"
                    >
                      <Star className="w-4 h-4 mr-1" />
                      Rate Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Order Summary Stats */}
      {orders.length > 0 && (
        <Card className="mt-8 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
          <CardContent className="py-6">
            <h3 className="text-xl font-bold text-ink mb-4 text-center">
              Order Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-500 mb-1">
                  {orders.length}
                </div>
                <div className="text-graphite text-sm">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-500 mb-1">
                  {orders.filter(o => o.status === 'completed').length}
                </div>
                <div className="text-graphite text-sm">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-500 mb-1">
                  ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                </div>
                <div className="text-graphite text-sm">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-500 mb-1">
                  {orders.reduce((sum, order) => sum + order.items.length, 0)}
                </div>
                <div className="text-graphite text-sm">Items Ordered</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
