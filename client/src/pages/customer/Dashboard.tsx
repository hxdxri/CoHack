import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  MessageCircle,
  Package,
  Users
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { farmersAPI, productsAPI } from '@/lib/api';
import { FarmerProfile, Product } from '@/types';
import toast from 'react-hot-toast';

/**
 * Customer Dashboard
 * 
 * Main dashboard for customers to browse products, search by category,
 * and discover local farmers and their produce.
 */
export const CustomerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'vegetables', label: '🥕 Vegetables' },
    { value: 'fruits', label: '🍎 Fruits' },
    { value: 'dairy', label: '🥛 Dairy' },
    { value: 'grains', label: '🌾 Grains' },
    { value: 'meat', label: '🥩 Meat' },
    { value: 'other', label: '📦 Other' },
  ];

  useEffect(() => {
    fetchFarmersAndProducts();
  }, []);

  const fetchFarmersAndProducts = async () => {
    try {
      setIsLoading(true);
      
      // Fetch farmers and products in parallel
      const [farmersResponse, productsResponse] = await Promise.all([
        farmersAPI.getAll(),
        productsAPI.getAll()
      ]);
      
      setFarmers(farmersResponse.data);
      setAllProducts(productsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load farmers and products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactFarmer = (farmerName: string) => {
    // Navigate to messages with pre-filled farmer info
    toast.success(`Opening chat with ${farmerName}`);
    // In a real app, this would navigate to messages with the farmer pre-selected
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

  const filteredFarmers = farmers.filter(farmer => {
    // Get products for this farmer
    const farmerProducts = allProducts.filter(product => product.farmerId === farmer.userId);
    
    // Check if search term matches farm name, location, or any of their products
    const matchesSearch = !searchTerm || 
      farmer.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmerProducts.some(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Check if any of the farmer's products match the selected category
    const matchesCategory = !selectedCategory || 
      farmerProducts.some(product => product.category === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-content">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink mb-2">
          Welcome, {user?.name}! 🚜
        </h1>
        <p className="text-graphite">
          Discover local farms and their fresh produce in your area
        </p>
      </div>

      {/* Search and Filter Bar */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search farms, products, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-12 text-lg"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input pl-12 appearance-none"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Category Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categoryOptions.slice(1).map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.value ? '' : category.value
                )}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-graphite hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-graphite">
          {isLoading ? 'Loading...' : `${filteredFarmers.length} farm${filteredFarmers.length !== 1 ? 's' : ''} found`}
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory && ` with ${categoryOptions.find(c => c.value === selectedCategory)?.label}`}
        </p>
        <div className="flex gap-2">
          <Link to="/customer/farmers">
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              All Farmers
            </Button>
          </Link>
        </div>
      </div>

      {/* Farms Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredFarmers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-graphite mb-2">
              No farms found
            </h3>
            <p className="text-graphite mb-6">
              Try adjusting your search terms or browse different categories
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
              <Link to="/customer/farmers">
                <Button variant="primary">
                  Browse All Farmers
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredFarmers.map((farmer) => {
            const farmerProducts = allProducts.filter(product => product.farmerId === farmer.userId);
            const categoryProducts = selectedCategory 
              ? farmerProducts.filter(product => product.category === selectedCategory)
              : farmerProducts;
            
            return (
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

                  {/* Products Preview */}
                  {categoryProducts.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-ink mb-2">
                        {selectedCategory ? 'Available Products:' : 'Products:'}
                      </h4>
                      <div className="space-y-2">
                        {categoryProducts.slice(0, 3).map((product) => (
                          <div key={product.id} className="flex items-center justify-between p-2 bg-mist rounded-lg">
                            <div className="flex items-center">
                              <span className="text-lg mr-2">{getCategoryIcon(product.category)}</span>
                              <div>
                                <span className="text-sm font-medium text-ink">{product.name}</span>
                                <div className="text-xs text-graphite">
                                  {product.quantity} {product.unit}s available
                                </div>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-primary-500">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                        {categoryProducts.length > 3 && (
                          <p className="text-xs text-graphite text-center">
                            +{categoryProducts.length - 3} more products
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-mist rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Package className="w-4 h-4 text-primary-500 mr-1" />
                        <span className="text-lg font-bold text-ink">
                          {farmerProducts.length}
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
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button
                    onClick={() => handleContactFarmer(farmer.name || 'Farmer')}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Contact
                  </Button>
                  <Link 
                    to={`/farmer-profile/${farmer.userId}`}
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <Users className="w-4 h-4 mr-1" />
                      Profile
                    </Button>
                  </Link>
                  <Link 
                    to={`/customer/dashboard?farmer=${farmer.userId}`}
                    className="flex-1"
                  >
                    <Button variant="primary" size="sm" className="w-full">
                      <Package className="w-4 h-4 mr-1" />
                      Products
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Call to Action */}
      {!isLoading && filteredFarmers.length > 0 && (
        <Card className="mt-12 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-semibold text-ink mb-2">
              Love shopping local? 🌱
            </h3>
            <p className="text-graphite mb-4">
              Discover more farmers in your area and build relationships with local producers
            </p>
            <Link to="/customer/farmers">
              <Button variant="primary">
                <Users className="w-4 h-4 mr-2" />
                Explore All Farmers
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
