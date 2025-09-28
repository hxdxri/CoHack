import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft,
  Package,
  MapPin,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useCartStore } from '@/store/cart';
import { useMessagesStore } from '@/store/messages';
import toast from 'react-hot-toast';

export const Cart: React.FC = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const { sendMessage } = useMessagesStore();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleContactFarmer = async (farmerId: string, farmerName: string) => {
    try {
      await sendMessage(farmerId, {
        content: `Hi! I'm interested in the items in my cart from ${farmerName}.`
      });
      
      toast.success(`Started conversation with ${farmerName}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed to start conversation');
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

  if (items.length === 0) {
    return (
      <div className="page-content">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-graphite mb-2">
              Your cart is empty
            </h3>
            <p className="text-graphite mb-6">
              Start shopping to add items to your cart
            </p>
            <Link to="/customer/dashboard">
              <Button>Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group items by farmer
  const itemsByFarmer = items.reduce((acc, item) => {
    if (!acc[item.farmerId]) {
      acc[item.farmerId] = {
        farmerName: item.farmerName,
        items: []
      };
    }
    acc[item.farmerId].items.push(item);
    return acc;
  }, {} as Record<string, { farmerName: string; items: typeof items }>);

  return (
    <div className="page-content">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-ink">
              Shopping Cart ({totalItems} items)
            </h1>
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear Cart
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {Object.entries(itemsByFarmer).map(([farmerId, farmerData]) => (
            <Card key={farmerId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-ink">
                    From {farmerData.farmerName}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContactFarmer(farmerId, farmerData.farmerName)}
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contact
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {farmerData.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <span className="text-2xl">{getCategoryIcon(item.product.category)}</span>
                    
                    <div className="flex-1">
                      <Link 
                        to={`/customer/product/${item.product.id}`}
                        className="text-lg font-medium text-ink hover:text-primary-500 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="capitalize text-xs">
                          {item.product.category}
                        </Badge>
                        <span className="text-sm text-graphite">
                          ${item.product.price.toFixed(2)} per {item.product.unit}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-2 text-sm font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.quantity}
                          className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right min-w-[80px]">
                        <div className="text-lg font-semibold text-ink">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-ink">Order Summary</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-graphite">
                  <span>Items ({totalItems})</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-graphite">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-semibold text-ink">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full" size="lg">
                <Package className="w-5 h-5 mr-2" />
                Proceed to Checkout
              </Button>

              <div className="text-center">
                <p className="text-sm text-graphite">
                  Checkout functionality coming soon!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-ink">Delivery Information</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-graphite">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span>Free delivery within 10 miles</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-graphite">
                <Package className="w-4 h-4 text-primary-500" />
                <span>Same-day delivery available</span>
              </div>
              <div className="text-xs text-graphite">
                <p>• Freshness guaranteed</p>
                <p>• Direct from local farms</p>
                <p>• Contact farmers for delivery details</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
