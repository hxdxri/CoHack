import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  ShoppingCart, 
  MapPin, 
  Star, 
  MessageCircle,
  Package,
  Truck,
  Shield,
  Leaf
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { productsAPI, farmersAPI } from '@/lib/api';
import { Product, FarmerProfile } from '@/types';
import { useCartStore } from '@/store/cart';
import { useMessagesStore } from '@/store/messages';
import toast from 'react-hot-toast';

export const ProductListing: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart, getItemQuantity } = useCartStore();
  const { sendMessage } = useMessagesStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setIsLoading(true);
      
      // Fetch product details
      const productResponse = await productsAPI.getById(productId!);
      const productData = productResponse.data;
      setProduct(productData);
      
      // Fetch farmer details
      const farmerResponse = await farmersAPI.getById(productData.farmerId);
      setFarmer(farmerResponse.data);
      
      // Set initial quantity to what's already in cart, or 1
      const cartQuantity = getItemQuantity(productData.id);
      setQuantity(cartQuantity > 0 ? cartQuantity : 1);
      
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Failed to load product details');
      navigate('/customer/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (product && newQuantity > product.quantity) {
      toast.error(`Only ${product.quantity} ${product.unit}s available`);
      return;
    }
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    try {
      addToCart(product, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleContactFarmer = async () => {
    if (!farmer) return;
    
    try {
      await sendMessage(farmer.userId, {
        content: `Hi ${farmer.name}! I'm interested in learning more about your ${product?.name}.`
      });
      
      toast.success(`Started conversation with ${farmer.farmName}`);
      navigate('/customer/messages');
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

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!product || !farmer) {
    return (
      <div className="page-content">
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-graphite mb-2">
              Product not found
            </h3>
            <p className="text-graphite mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/customer/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image and Basic Info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-6xl">{getCategoryIcon(product.category)}</span>
                <div>
                  <h1 className="text-3xl font-bold text-ink mb-2">{product.name}</h1>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {product.category}
                    </Badge>
                    {product.isActive && (
                      <Badge variant="success">Available</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-4xl font-bold text-primary-500 mb-2">
                ${product.price.toFixed(2)}
                <span className="text-lg text-graphite font-normal"> per {product.unit}</span>
              </div>

              <div className="text-graphite mb-6">
                <p className="text-sm">
                  {product.quantity} {product.unit}s available
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-ink mb-2">Description</h3>
                  <p className="text-graphite">{product.description}</p>
                </div>

                {/* Product Features */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-graphite">
                    <Leaf className="w-4 h-4 text-green-500" />
                    <span>Organic</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-graphite">
                    <Truck className="w-4 h-4 text-blue-500" />
                    <span>Local Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-graphite">
                    <Shield className="w-4 h-4 text-purple-500" />
                    <span>Quality Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-graphite">
                    <Package className="w-4 h-4 text-orange-500" />
                    <span>Fresh Daily</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Farmer Info */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-ink">From the Farm</h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-ink mb-1">{farmer.farmName}</h4>
                  <p className="text-graphite text-sm mb-2">{farmer.name}</p>
                  <div className="flex items-center text-graphite text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1 text-primary-500" />
                    <span>{farmer.location}</span>
                  </div>
                  {farmer.averageRating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-graphite">
                        {farmer.averageRating.toFixed(1)} ({farmer.totalReviews} reviews)
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleContactFarmer}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-ink">Order Details</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-3 text-lg font-semibold min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.quantity}
                      className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-graphite text-sm">
                    {product.unit}s
                  </span>
                </div>
                <p className="text-xs text-graphite mt-1">
                  Maximum: {product.quantity} {product.unit}s
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-graphite">
                  <span>Price per {product.unit}</span>
                  <span>${product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-graphite">
                  <span>Quantity</span>
                  <span>{quantity}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-semibold text-ink">
                    <span>Total</span>
                    <span>${(product.price * quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || quantity > product.quantity}
                className="w-full flex items-center justify-center gap-2"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5" />
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>

              {/* Additional Actions */}
              <div className="space-y-3">
                <Link to={`/customer/farm/${farmer.userId}`} className="block">
                  <Button variant="outline" className="w-full">
                    View All Products from {farmer.farmName}
                  </Button>
                </Link>
                
                <Button
                  variant="outline"
                  onClick={handleContactFarmer}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message Farmer
                </Button>
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
                <Truck className="w-4 h-4 text-primary-500" />
                <span>Free delivery within 10 miles</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-graphite">
                <Package className="w-4 h-4 text-primary-500" />
                <span>Same-day delivery available</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-graphite">
                <Shield className="w-4 h-4 text-primary-500" />
                <span>Freshness guaranteed</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
