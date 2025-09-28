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
  Leaf,
  ChevronLeft,
  ChevronRight,
  User,
  Heart
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

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

  // Mock product images for carousel
  const productImages = product?.imageUrl 
    ? [product.imageUrl, product.imageUrl, product.imageUrl] // In real app, this would be an array of images
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-mist bg-farm-pattern-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!product || !farmer) {
    return (
      <div className="min-h-screen bg-mist bg-farm-pattern-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-md mx-auto">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist bg-farm-pattern-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Main Product Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Images */}
            <div className="relative bg-gray-100">
              <div className="aspect-square relative overflow-hidden">
                {productImages.length > 0 ? (
                  <div className="relative w-full h-full">
                    <img
                      src={productImages[currentImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {productImages.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex(Math.min(productImages.length - 1, currentImageIndex + 1))}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-8xl">{getCategoryIcon(product.category)}</span>
                  </div>
                )}
              </div>
              
              {/* Image Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex gap-2 p-4 bg-white border-t">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex ? 'border-green-600' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-8 lg:p-12">
              <div className="space-y-6">
                {/* Product Title */}
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                    {product.name}
                  </h1>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="capitalize text-sm">
                      {product.category}
                    </Badge>
                    <Badge variant="success" className="text-sm">
                      Organic
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      Local Delivery
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      Fresh
                    </Badge>
                  </div>

                  {/* Rating */}
                  {farmer.averageRating > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(farmer.averageRating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {farmer.averageRating.toFixed(1)} ({farmer.totalReviews} reviews)
                      </span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                    <span className="text-lg text-gray-500 font-normal ml-2">
                      per {product.unit}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {product.quantity} {product.unit}s available
                  </p>
                </div>

                {/* Quantity Selector & Add to Cart */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                          className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-3 text-lg font-semibold min-w-[3rem] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={quantity >= product.quantity}
                          className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-gray-600 text-sm">
                        {product.unit}s
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum: {product.quantity} {product.unit}s
                    </p>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || quantity > product.quantity}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-lg flex items-center justify-center gap-3 transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </Button>

                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      Total: ${(product.price * quantity).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleContactFarmer}
                    className="flex-1 flex items-center justify-center gap-2 py-3"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message Farmer
                  </Button>
                  <Button
                    variant="outline"
                    className="p-3"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description */}
          <div className="lg:col-span-2">
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                <div className="text-gray-600 leading-relaxed">
                  {showFullDescription ? (
                    <p>{product.description}</p>
                  ) : (
                    <p>
                      {product.description.length > 200 
                        ? `${product.description.substring(0, 200)}...` 
                        : product.description
                      }
                    </p>
                  )}
                  {product.description.length > 200 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-green-600 hover:text-green-700 font-medium mt-2"
                    >
                      {showFullDescription ? 'Read Less' : 'Read More'}
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Farm Info */}
          <div>
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">From the Farm</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{farmer.farmName}</h4>
                      <p className="text-sm text-gray-600">{farmer.name}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span>{farmer.location}</span>
                    </div>
                    {farmer.averageRating > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{farmer.averageRating.toFixed(1)} ({farmer.totalReviews} reviews)</span>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleContactFarmer}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contact Farmer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="mt-8">
          <Card className="bg-white rounded-2xl shadow-sm">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Delivery Information</h3>
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Free Delivery</p>
                    <p className="text-sm text-gray-600">Within 10 miles</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Same-Day Delivery</p>
                    <p className="text-sm text-gray-600">Available</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Freshness Guaranteed</p>
                    <p className="text-sm text-gray-600">Quality assured</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
