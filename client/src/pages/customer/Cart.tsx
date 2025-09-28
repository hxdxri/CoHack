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
  MessageCircle,
  Store,
  CheckCircle,
  Leaf
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useCartStore } from '@/store/cart';
import { useMessagesStore } from '@/store/messages';
import toast from 'react-hot-toast';

export const Cart: React.FC = () => {
  const { 
    items, 
    totalItems, 
    totalPrice, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    clearVendorCart, 
    getVendorCarts 
  } = useCartStore();
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

  const handleVendorCheckout = (farmerName: string) => {
    // This would trigger the checkout process for this specific vendor
    toast.success(`Proceeding to checkout with ${farmerName}`);
    // TODO: Implement vendor-specific checkout
  };

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

  const vendorCarts = getVendorCarts();

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

  return (
    <div className="page-content">
      {/* Header */}
      <div className="mb-8">
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
            <h1 className="text-3xl font-bold text-ink">
              {vendorCarts.length > 1 ? 'Multi-Vendor Cart' : 'Shopping Cart'}
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <Store className="w-4 h-4" />
                <span>{vendorCarts.length} farms</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <Package className="w-4 h-4" />
                <span>{totalItems} items</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Carts */}
      <div className="space-y-8">
        {vendorCarts.map((vendorCart) => (
          <Card key={vendorCart.farmerId} className="overflow-hidden">
            {/* Vendor Header */}
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-ink">
                      {vendorCart.farmerName}
                    </h3>
                    {vendorCart.farmerLocation && (
                      <div className="flex items-center gap-1 text-sm text-graphite">
                        <MapPin className="w-3 h-3" />
                        <span>{vendorCart.farmerLocation}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContactFarmer(vendorCart.farmerId, vendorCart.farmerName)}
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contact
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => clearVendorCart(vendorCart.farmerId)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {/* Cart Items */}
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {vendorCart.items.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Product Image/Icon */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                        {getCategoryIcon(item.product.category)}
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={`/customer/product/${item.product.id}`}
                          className="text-lg font-semibold text-ink hover:text-primary-500 transition-colors block"
                        >
                          {item.product.name}
                        </Link>
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

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.quantity}
                            className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right min-w-[100px]">
                          <div className="text-lg font-bold text-ink">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            {/* Vendor Cart Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-green-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-graphite">
                  <span className="font-medium">{vendorCart.itemCount} items</span>
                  <span className="mx-2">•</span>
                  <span>Subtotal: <span className="font-bold text-ink text-lg">${vendorCart.subtotal.toFixed(2)}</span></span>
                </div>
                
                 <Button
                   onClick={() => handleVendorCheckout(vendorCart.farmerName)}
                   className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                 >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Checkout with {vendorCart.farmerName}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Overall Summary */}
      <div className="mt-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-lg">
                <span className="text-graphite">Total across all farms: </span>
                <span className="font-bold text-ink text-xl">${totalPrice.toFixed(2)}</span>
                <span className="text-graphite ml-2">({totalItems} items)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-graphite">
                  <p>Each farm processes orders independently</p>
                  <p>Contact farmers directly for delivery details</p>
                </div>
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
