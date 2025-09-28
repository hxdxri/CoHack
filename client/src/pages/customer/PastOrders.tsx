import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  ShoppingBag,
  Search,
  Filter,
  SortAsc,
  Download,
  Eye,
  RefreshCw,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  User,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/store/auth';
import { useMessagesStore } from '@/store/messages';
import { ordersAPI } from '@/lib/api';
import { Order } from '@/types';
import toast from 'react-hot-toast';

// Rating modal component
interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onRate: (rating: number, review: string) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, order, onRate }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    if (rating > 0) {
      onRate(rating, review);
      setRating(0);
      setReview('');
      onClose();
    }
  };

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rate Your Order">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-ink mb-2">Order #{order.id.split('_')[1]}</h3>
          <p className="text-graphite">from {order.customerName}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">Rating</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">Review (Optional)</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with this order..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={rating === 0}
          >
            Submit Rating
          </Button>
        </div>
      </div>
    </Modal>
  );
};

/**
 * Past Orders Page
 * 
 * Enhanced order history with search, filtering, sorting, and detailed views.
 * Shows customer's order history with status tracking, order details,
 * and ability to reorder or contact farmers.
 */
export const PastOrders: React.FC = () => {
  const { user } = useAuthStore();
  const { sendMessage, loadConversations } = useMessagesStore();
  const navigate = useNavigate();
  
  // State management
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status' | 'farmer'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [orderToRate, setOrderToRate] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
    loadConversations();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching orders...');
      const response = await ordersAPI.getMyOrders();
      console.log('Orders response:', response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      // Set some sample data for testing if API fails
      const sampleOrders: Order[] = [
        {
          id: 'order_sample_1',
          farmerId: 'farmer_1',
          customerId: 'customer_1',
          customerName: 'Lois Lane',
          customerEmail: 'customer@harvestlink.com',
          customerPhone: '(555) 123-4567',
          items: [
            {
              id: 'item_1',
              productId: 'product_1',
              productName: 'Organic Heirloom Tomatoes',
              category: 'vegetables',
              quantity: 3,
              unit: 'lb',
              price: 4.99,
              imageUrl: undefined
            }
          ],
          totalAmount: 14.97,
          status: 'delivered',
          orderDate: '2025-01-15T10:30:00.000Z',
          deliveryDate: '2025-01-17T14:00:00.000Z',
          deliveryAddress: '123 Main Street, Saskatoon, SK S7K 1A1',
          notes: 'Please leave at front door if no answer',
          rating: 5,
          review: 'Excellent quality produce!'
        }
      ];
      setOrders(sampleOrders);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshOrders = async () => {
    try {
      setIsRefreshing(true);
      const response = await ordersAPI.getMyOrders();
      setOrders(response.data);
      toast.success('Orders refreshed');
    } catch (error) {
      console.error('Error refreshing orders:', error);
      toast.error('Failed to refresh orders');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Helper functions
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
      case 'out_for_delivery':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
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
      case 'out_for_delivery':
        return 'success';
      case 'delivered':
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
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
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

  // Filtering and sorting logic
  const filteredAndSortedOrders = orders
    .filter(order => {
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      const matchesSearch = searchTerm === '' || 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.productName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
          break;
        case 'amount':
          comparison = a.totalAmount - b.totalAmount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'farmer':
          comparison = a.customerName.localeCompare(b.customerName);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Statistics
  const stats = {
    totalOrders: orders.length,
    completedOrders: orders.filter(o => o.status === 'delivered').length,
    totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    totalItems: orders.reduce((sum, order) => sum + order.items.length, 0),
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0
  };

  // Action handlers
  const handleReorder = (order: Order) => {
    // In a real app, this would add items to cart or create a new order
    toast.success(`Reordering from ${order.customerName}...`);
  };

  const handleContactFarmer = async (farmerId: string, farmerName: string) => {
    try {
      const { conversations, setActiveConversation, loadMessages } = useMessagesStore.getState();
      
      // Check if conversation already exists with this farmer
      const existingConversation = conversations.find(conv => conv.partnerId === farmerId);
      
      if (existingConversation) {
        // Conversation exists, navigate to messages and set it as active
        setActiveConversation(farmerId);
        await loadMessages(farmerId);
        toast.success(`Opening conversation with ${farmerName}`);
        navigate('/customer/messages');
      } else {
        // No conversation exists, create a new one
        await sendMessage(farmerId, {
          content: `Hi! I have a question about my recent order from your farm.`
        });
        
        // Reload conversations to include the new one
        await loadConversations();
        
        // Set the new conversation as active and load its messages
        setActiveConversation(farmerId);
        await loadMessages(farmerId);
        
        toast.success(`Started new conversation with ${farmerName}`);
        navigate('/customer/messages');
      }
    } catch (error) {
      console.error('Error handling farmer contact:', error);
      toast.error('Failed to contact farmer');
    }
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleRateOrder = (order: Order) => {
    setOrderToRate(order);
    setShowRatingModal(true);
  };

  const handleSubmitRating = async (rating: number, review: string) => {
    if (!orderToRate) return;
    
    try {
      // In a real app, this would call the reviews API
      toast.success('Rating submitted successfully!');
      // Update the order with the rating
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderToRate.id 
            ? { ...order, rating, review }
            : order
        )
      );
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating');
    }
  };

  const handleExportOrders = () => {
    // In a real app, this would generate and download a CSV/PDF
    toast.success('Exporting order history...');
  };

  const toggleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink mb-2">
              Order History 📦
            </h1>
            <p className="text-graphite">
              Track your order history and manage your purchases
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={refreshOrders}
              variant="outline"
              size="sm"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={handleExportOrders}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-primary-500 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-graphite">Total Orders</p>
                  <p className="text-2xl font-bold text-primary-600">{stats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-500 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-graphite">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-graphite">Total Spent</p>
                  <p className="text-2xl font-bold text-blue-600">${stats.totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-500 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-graphite">Avg Order</p>
                  <p className="text-2xl font-bold text-purple-600">${stats.averageOrderValue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search orders, products, or farmers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="lg:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-graphite">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="status">Status</option>
                <option value="farmer">Farmer</option>
              </select>
              <Button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                variant="outline"
                size="sm"
              >
                <SortAsc className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
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
                  onClick={() => setFilterStatus('delivered')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filterStatus === 'delivered'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-graphite hover:bg-gray-200'
                  }`}
                >
                  Delivered ({orders.filter(o => o.status === 'delivered').length})
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filterStatus === 'pending'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-graphite hover:bg-gray-200'
                  }`}
                >
                  Pending ({orders.filter(o => o.status === 'pending').length})
                </button>
                <button
                  onClick={() => setFilterStatus('preparing')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filterStatus === 'preparing'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-graphite hover:bg-gray-200'
                  }`}
                >
                  In Progress ({orders.filter(o => ['confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(o.status)).length})
                </button>
                <button
                  onClick={() => setFilterStatus('cancelled')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filterStatus === 'cancelled'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-graphite hover:bg-gray-200'
                  }`}
                >
                  Cancelled ({orders.filter(o => o.status === 'cancelled').length})
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Orders List */}
      {filteredAndSortedOrders.length === 0 ? (
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
          {filteredAndSortedOrders.map((order) => (
            <Card key={order.id} hover className="group transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-bold text-ink">
                          Order #{order.id.split('_')[1].toUpperCase()}
                        </h3>
                        <Badge 
                          variant={getStatusColor(order.status) as any}
                          className="flex items-center"
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{getStatusText(order.status)}</span>
                        </Badge>
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center text-graphite text-sm">
                        <User className="w-4 h-4 mr-2 text-primary-500" />
                        <span className="font-medium">{order.customerName}</span>
                      </div>
                      <div className="flex items-center text-graphite text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                        <span>Ordered {formatDate(order.orderDate)}</span>
                      </div>
                    </div>

                    {order.deliveryDate && (
                      <div className="flex items-center text-graphite text-sm mb-2">
                        <Truck className="w-4 h-4 mr-2 text-primary-500" />
                        <span>Delivery: {formatDate(order.deliveryDate)}</span>
                      </div>
                    )}

                    {order.deliveryAddress && (
                      <div className="flex items-center text-graphite text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                        <span className="truncate">{order.deliveryAddress}</span>
                      </div>
                    )}
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
                    onClick={() => handleViewOrderDetails(order)}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button
                    onClick={() => handleReorder(order)}
                    variant="outline"
                    size="sm"
                  >
                    <Package className="w-4 h-4 mr-1" />
                    Reorder
                  </Button>
                  <Button
                    onClick={() => handleContactFarmer(order.farmerId, order.customerName)}
                    variant="outline"
                    size="sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Contact Farmer
                  </Button>
                  {order.deliveryPin && (
                    <div className="flex items-center px-4 py-3 bg-green-200 text-green-900 rounded-lg text-sm font-bold">
                      PIN: 5678
                    </div>
                  )}
                  {order.status === 'delivered' && !order.rating && (
                    <Button
                      onClick={() => handleRateOrder(order)}
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

      {/* Order Details Modal */}
      <Modal 
        isOpen={showOrderDetails} 
        onClose={() => setShowOrderDetails(false)} 
        title={`Order Details - #${selectedOrder?.id.split('_')[1].toUpperCase()}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-ink mb-2">Order Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-graphite">Order ID:</span> {selectedOrder.id}</div>
                  <div><span className="text-graphite">Status:</span> 
                    <Badge variant={getStatusColor(selectedOrder.status) as any} className="ml-2">
                      {getStatusText(selectedOrder.status)}
                    </Badge>
                  </div>
                  <div><span className="text-graphite">Order Date:</span> {formatDate(selectedOrder.orderDate)}</div>
                  {selectedOrder.deliveryDate && (
                    <div><span className="text-graphite">Delivery Date:</span> {formatDate(selectedOrder.deliveryDate)}</div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-ink mb-2">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-graphite">Name:</span> {selectedOrder.customerName}</div>
                  <div><span className="text-graphite">Email:</span> {selectedOrder.customerEmail}</div>
                  {selectedOrder.customerPhone && (
                    <div><span className="text-graphite">Phone:</span> {selectedOrder.customerPhone}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {selectedOrder.deliveryAddress && (
              <div>
                <h4 className="font-semibold text-ink mb-2">Delivery Address</h4>
                <p className="text-sm text-graphite">{selectedOrder.deliveryAddress}</p>
              </div>
            )}

            {/* Order Items */}
            <div>
              <h4 className="font-semibold text-ink mb-3">Order Items</h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-mist rounded-lg">
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{getCategoryIcon(item.category)}</span>
                      <div>
                        <span className="text-sm font-medium text-ink">{item.productName}</span>
                        <div className="text-xs text-graphite">
                          {item.quantity} {item.unit}s × ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-primary-500">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-ink">Total Amount</span>
                  <span className="text-xl font-bold text-primary-500">
                    ${selectedOrder.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedOrder.notes && (
              <div>
                <h4 className="font-semibold text-ink mb-2">Order Notes</h4>
                <p className="text-sm text-graphite bg-blue-50 p-3 rounded-lg">{selectedOrder.notes}</p>
              </div>
            )}

            {/* Review */}
            {selectedOrder.rating && selectedOrder.review && (
              <div>
                <h4 className="font-semibold text-ink mb-2">Your Review</h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= selectedOrder.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-graphite">{selectedOrder.review}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        order={orderToRate}
        onRate={handleSubmitRating}
      />
    </div>
  );
};
