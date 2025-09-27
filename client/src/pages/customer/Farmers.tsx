import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  MessageCircle,
  Package,
  Search,
  Users,
  Calendar,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { farmersAPI } from '@/lib/api';
import { FarmerProfile } from '@/types';
import toast from 'react-hot-toast';

/**
 * Customer Farmers Page
 * 
 * Directory of all farmers for customers to browse, view profiles,
 * and connect with local producers.
 */
export const CustomerFarmers: React.FC = () => {
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      setIsLoading(true);
      const response = await farmersAPI.getAll();
      setFarmers(response.data);
    } catch (error) {
      console.error('Error fetching farmers:', error);
      toast.error('Failed to load farmers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactFarmer = (farmerName: string) => {
    toast.success(`Opening chat with ${farmerName}`);
    // In a real app, this would navigate to messages with the farmer pre-selected
  };

  const filteredFarmers = farmers.filter(farmer => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      farmer.farmName.toLowerCase().includes(searchLower) ||
      farmer.name?.toLowerCase().includes(searchLower) ||
      farmer.location.toLowerCase().includes(searchLower) ||
      farmer.description.toLowerCase().includes(searchLower)
    );
  });

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

  return (
    <div className="page-content">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink mb-2">
          Local Farmers 👨‍🌾
        </h1>
        <p className="text-graphite">
          Discover and connect with farmers in your community
        </p>
      </div>

      {/* Search Bar */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-graphite w-5 h-5" />
            <input
              type="text"
              placeholder="Search farmers by name, farm, location, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-12 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-graphite">
          {filteredFarmers.length} farmer{filteredFarmers.length !== 1 ? 's' : ''} found
          {searchTerm && ` for "${searchTerm}"`}
        </p>
        <Link to="/customer/dashboard">
          <Button variant="outline" size="sm">
            <Package className="w-4 h-4 mr-2" />
            Browse Products
          </Button>
        </Link>
      </div>

      {/* Farmers Grid */}
      {filteredFarmers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-graphite mb-2">
              {farmers.length === 0 ? 'No farmers found' : 'No farmers match your search'}
            </h3>
            <p className="text-graphite mb-6">
              {farmers.length === 0 
                ? 'Check back later as more farmers join our community.'
                : 'Try adjusting your search terms to find what you\'re looking for.'
              }
            </p>
            {searchTerm && (
              <Button 
                onClick={() => setSearchTerm('')}
                variant="outline"
              >
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredFarmers.map((farmer) => (
            <Card key={farmer.id} hover className="group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-ink group-hover:text-primary-500 transition-colors mb-1">
                      {farmer.farmName}
                    </h3>
                    <p className="text-graphite font-medium">{farmer.name}</p>
                  </div>
                  {farmer.averageRating > 0 && (
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium text-yellow-700">
                        {farmer.averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {/* Location */}
                <div className="flex items-center text-graphite mb-4">
                  <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                  <span className="text-sm">{farmer.location}</span>
                </div>

                {/* Description */}
                <p className="text-graphite text-sm line-clamp-3 mb-4">
                  {farmer.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-mist rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Package className="w-4 h-4 text-primary-500 mr-1" />
                      <span className="text-lg font-bold text-ink">
                        {farmer.productCount || 0}
                      </span>
                    </div>
                    <span className="text-xs text-graphite">Products</span>
                  </div>
                  
                  <div className="text-center p-3 bg-mist rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-lg font-bold text-ink">
                        {farmer.totalReviews || 0}
                      </span>
                    </div>
                    <span className="text-xs text-graphite">Reviews</span>
                  </div>
                </div>

                {/* Farm History Badge */}
                <div className="flex items-center justify-center mb-4">
                  <Badge variant="primary" className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Farming since {formatDate(farmer.createdAt)}
                  </Badge>
                </div>

                {/* Quality Indicators */}
                <div className="flex flex-wrap gap-2 mb-4">
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
                  {(farmer.productCount || 0) >= 5 && (
                    <Badge variant="warning" size="sm">
                      Wide Selection
                    </Badge>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex gap-3">
                <Button
                  onClick={() => handleContactFarmer(farmer.name || 'Farmer')}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact
                </Button>
                <Link 
                  to={`/customer/dashboard?farmer=${farmer.userId}`}
                  className="flex-1"
                >
                  <Button variant="primary" size="sm" className="w-full">
                    <Package className="w-4 h-4 mr-2" />
                    View Products
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Community Stats */}
      {!isLoading && farmers.length > 0 && (
        <Card className="mt-12 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold text-ink mb-4">
              Our Growing Community 🌱
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="text-3xl font-bold text-primary-500 mb-1">
                  {farmers.length}
                </div>
                <div className="text-graphite">Local Farmers</div>
              </div>
              
              <div>
                <div className="text-3xl font-bold text-primary-500 mb-1">
                  {farmers.reduce((sum, f) => sum + (f.productCount || 0), 0)}
                </div>
                <div className="text-graphite">Fresh Products</div>
              </div>
              
              <div>
                <div className="text-3xl font-bold text-primary-500 mb-1">
                  {farmers.reduce((sum, f) => sum + (f.totalReviews || 0), 0)}
                </div>
                <div className="text-graphite">Happy Customers</div>
              </div>
            </div>

            <p className="text-graphite mb-4">
              Join thousands of customers supporting local agriculture and enjoying the freshest produce
            </p>
            
            <Link to="/customer/dashboard">
              <Button variant="primary" size="lg">
                <Package className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
