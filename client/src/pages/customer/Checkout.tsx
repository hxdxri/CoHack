import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Leaf, 
  MapPin, 
  Clock, 
  Shield, 
  Truck,
  CheckCircle,
  Package,
  CreditCard,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PaymentForm } from '@/components/ui/PaymentForm';
import { useCartStore } from '@/store/cart';
import { VendorCart } from '@/types';
import toast from 'react-hot-toast';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getVendorCart, clearVendorCart } = useCartStore();
  
  const [vendorCart, setVendorCart] = useState<VendorCart | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // Get farmer ID from URL params or location state
    const farmerId = new URLSearchParams(location.search).get('farmerId') || 
                    (location.state as any)?.farmerId;
    
    if (!farmerId) {
      toast.error('No farmer selected for checkout');
      navigate('/customer/cart');
      return;
    }

    const cart = getVendorCart(farmerId);
    if (!cart) {
      toast.error('No items found for this farmer');
      navigate('/customer/cart');
      return;
    }

    setVendorCart(cart);
  }, [location, getVendorCart, navigate]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vegetables': return '🥕';
      case 'fruits': return '🍎';
      case 'dairy': return '🥛';
      case 'grains': return '🌾';
      case 'meat': return '🥩';
      case 'herbs': return '🌿';
      case 'beverages': return '🥤';
      default: return '📦';
    }
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    setIsProcessing(true);
    
    try {
      // Store order in mock data (in real app, this would be an API call)
      const order = {
        id: `order_${Date.now()}`,
        farmerId: vendorCart!.farmerId,
        customerId: 'customer_1', // In real app, get from auth context
        customerName: paymentData.customer.name,
        customerEmail: paymentData.customer.email,
        customerPhone: paymentData.customer.phone,
        items: vendorCart!.items.map(item => ({
          id: item.id,
          productId: item.productId,
          productName: item.product.name,
          category: item.product.category,
          quantity: item.quantity,
          unit: item.product.unit,
          price: item.product.price,
          imageUrl: item.product.imageUrl
        })),
        totalAmount: vendorCart!.subtotal,
        status: 'pending' as const,
        orderDate: new Date().toISOString(),
        deliveryAddress: `${paymentData.customer.address}, ${paymentData.customer.city}, ${paymentData.customer.province} ${paymentData.customer.postalCode}`,
        deliveryPin: Math.random().toString(36).substr(2, 6).toUpperCase(),
        notes: `Order from ${vendorCart!.farmerName}`
      };

      // Store in localStorage for now (in real app, send to backend)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // Clear the vendor cart
      clearVendorCart(vendorCart!.farmerId);

      setPaymentSuccess(true);
      toast.success('Order placed successfully!');
      
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    toast.error(`Payment failed: ${error}`);
  };

  if (!vendorCart) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-ink mb-2">Loading checkout...</h3>
            <p className="text-graphite">Please wait while we prepare your order.</p>
          </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-ink mb-2">
              Payment Successful!
            </h1>
            <p className="text-lg text-graphite">
              Your order is being prepared by {vendorCart.farmerName}
            </p>
          </div>

          {/* Order Summary */}
          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <h3 className="text-lg font-semibold text-ink">Order Summary</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-ink">{vendorCart.farmerName}</h4>
                  {vendorCart.farmerLocation && (
                    <p className="text-sm text-graphite flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {vendorCart.farmerLocation}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                {vendorCart.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getCategoryIcon(item.product.category)}</span>
                      <div>
                        <p className="font-medium text-ink">{item.product.name}</p>
                        <p className="text-sm text-graphite">
                          {item.quantity} × ${item.product.price.toFixed(2)} per {item.product.unit}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-ink">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-ink">Total</span>
                  <span className="text-xl font-bold text-ink">${vendorCart.subtotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-lg font-semibold text-ink">What's Next?</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-ink">Order Confirmation</h4>
                  <p className="text-sm text-graphite">
                    The farmer will confirm your order and provide pickup/delivery details.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Package className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-ink">Preparation</h4>
                  <p className="text-sm text-graphite">
                    Your fresh produce will be carefully prepared and packaged.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Truck className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-ink">Pickup/Delivery</h4>
                  <p className="text-sm text-graphite">
                    You'll receive a PIN for secure pickup or delivery confirmation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate('/customer/dashboard')}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Continue Shopping
            </Button>
            <Button
              onClick={() => navigate('/customer/past-orders')}
              variant="outline"
              className="flex-1"
            >
              View Order History
            </Button>
          </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => navigate('/customer/cart')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </Button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-ink">Checkout</h1>
              <p className="text-graphite">Complete your order with {vendorCart.farmerName}</p>
            </div>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink">{vendorCart.farmerName}</h3>
                  {vendorCart.farmerLocation && (
                    <div className="flex items-center gap-1 text-sm text-graphite">
                      <MapPin className="w-3 h-3" />
                      <span>{vendorCart.farmerLocation}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {vendorCart.items.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                        {getCategoryIcon(item.product.category)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-ink">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="gray" className="capitalize text-xs">
                            {item.product.category}
                          </Badge>
                          <span className="text-sm text-graphite">
                            ${item.product.price.toFixed(2)} per {item.product.unit}
                          </span>
                        </div>
                        <p className="text-sm text-graphite mt-1 line-clamp-2">
                          {item.product.description}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-ink">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-graphite">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            {/* Order Total */}
            <div className="bg-gradient-to-r from-gray-50 to-green-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-ink">Total</span>
                <span className="text-2xl font-bold text-ink">${vendorCart.subtotal.toFixed(2)}</span>
              </div>
              <p className="text-sm text-graphite mt-1">
                {vendorCart.itemCount} items • Secure payment
              </p>
            </div>
          </Card>

        </div>

        {/* Payment Form */}
        <div>
          <PaymentForm
            totalAmount={vendorCart.subtotal}
            farmerName={vendorCart.farmerName}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>
        </div>
      </div>
    </div>
  );
};
