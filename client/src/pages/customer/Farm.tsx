import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  MessageCircle,
  Package,
  ArrowLeft,
  Calendar,
  Award,
  Users,
  Phone,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { farmersAPI, productsAPI } from '@/lib/api';
import { FarmerProfile, Product } from '@/types';
import { useMessagesStore } from '@/store/messages';
import toast from 'react-hot-toast';

/**
 * Individual Farm Page
 * 
 * Detailed view of a specific farm with all products, reviews, and contact options.
 */
export const Farm: React.FC = () => {
  const { farmerId } = useParams<{ farmerId: string }>();
  const navigate = useNavigate();
  const { sendMessage } = useMessagesStore();
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (farmerId) {
      fetchFarmData();
    }
  }, [farmerId]);

  const fetchFarmData = async () => {
    try {
      setIsLoading(true);
      
      const [farmerResponse, productsResponse] = await Promise.all([
        farmersAPI.getById(farmerId!),
        productsAPI.getByFarmerId(farmerId!)
      ]);
      
      setFarmer(farmerResponse.data);
      setProducts(productsResponse.data);
    } catch (error) {
      console.error('Error fetching farm data:', error);
      toast.error('Failed to load farm information');
      navigate('/customer/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactFarmer = async () => {
    if (!farmer) return;
    
    try {
      // Create a new conversation by sending an initial message
      await sendMessage(farmer.userId, {
        content: `Hi ${farmer.name}! I'm interested in learning more about your farm and products.`
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Farm not found</h1>
          <p className="text-gray-600 mb-6">The farm you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/customer/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => navigate('/customer/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-ink mb-2">
              {farmer.farmName}
            </h1>
            <p className="text-xl text-graphite mb-4">by {farmer.name}</p>
            
            {/* Location */}
            <div className="flex items-center text-graphite mb-4">
              <MapPin className="w-5 h-5 mr-2 text-primary-500" />
              <span className="text-lg">{farmer.location}</span>
            </div>

            {/* Rating */}
            {farmer.averageRating > 0 && (
              <div className="flex items-center mb-4">
                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="text-lg font-medium text-yellow-700">
                    {farmer.averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="ml-2 text-graphite">
                  ({farmer.totalReviews} review{farmer.totalReviews !== 1 ? 's' : ''})
                </span>
              </div>
            )}

            {/* Quality Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {farmer.averageRating >= 4.5 && (
                <Badge variant="success" size="sm">
                  <Award className="w-3 h-3 mr-1" />
                  Top Rated
                </Badge>
              )}
              {farmer.totalReviews >= 10 && (
                <Badge variant="primary" size="sm">
                  Trusted Seller
                </Badge>
              )}
              {products.length >= 5 && (
                <Badge variant="warning" size="sm">
                  Wide Selection
                </Badge>
              )}
              <Badge variant="primary" size="sm">
                <Calendar className="w-3 h-3 mr-1" />
                Farming since {formatDate(farmer.createdAt)}
              </Badge>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleContactFarmer}
              variant="primary"
              size="lg"
              className="flex items-center justify-center"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Farmer
            </Button>
          </div>
        </div>
      </div>

      {/* Farm Description */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-2xl font-bold text-ink">About {farmer.farmName}</h2>
        </CardHeader>
        <CardContent>
          <p className="text-graphite text-lg leading-relaxed mb-4">
            {farmer.description}
          </p>
          {farmer.farmHistory && (
            <div>
              <h3 className="text-lg font-semibold text-ink mb-2">Farm History</h3>
              <p className="text-graphite leading-relaxed">
                {farmer.farmHistory}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-ink">
            Available Products ({products.length})
          </h2>
        </div>

        {products.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-graphite mb-2">
                No products available
              </h3>
              <p className="text-graphite">
                This farm doesn't have any products listed yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} hover className="group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getCategoryIcon(product.category)}</span>
                      <div>
                        <Link 
                          to={`/customer/product/${product.id}`}
                          className="block"
                        >
                          <h3 className="text-lg font-bold text-ink group-hover:text-primary-500 transition-colors cursor-pointer">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-graphite capitalize">
                          {product.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary-500">
                        ${product.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-graphite">
                        per {product.unit}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-graphite text-sm mb-4 line-clamp-3">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-graphite">
                      <Package className="w-4 h-4 mr-1" />
                      {product.quantity} {product.unit}s available
                    </div>
                    <Badge 
                      variant={product.isActive ? "success" : "secondary"}
                      size="sm"
                    >
                      {product.isActive ? "Available" : "Out of Stock"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Farm Stats */}
      <Card className="bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
        <CardContent className="py-8">
          <h3 className="text-2xl font-bold text-ink mb-6 text-center">
            Farm Statistics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">
                {products.length}
              </div>
              <div className="text-graphite">Products Available</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">
                {farmer.totalReviews || 0}
              </div>
              <div className="text-graphite">Customer Reviews</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">
                {farmer.averageRating > 0 ? farmer.averageRating.toFixed(1) : 'N/A'}
              </div>
              <div className="text-graphite">Average Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
