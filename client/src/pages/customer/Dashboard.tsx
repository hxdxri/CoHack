import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  MessageCircle,
  Package,
  Users,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { productsAPI } from '@/lib/api';
import { Product } from '@/types';
import toast from 'react-hot-toast';

/**
 * Customer Dashboard
 * 
 * Main dashboard for customers to browse products, search by category,
 * and discover local farmers and their produce.
 */
export const CustomerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

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
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;
      
      const response = await productsAPI.getAll(params);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactFarmer = (farmerName: string) => {
    // Navigate to messages with pre-filled farmer info
    toast.success(`Opening chat with ${farmerName}`);
    // In a real app, this would navigate to messages with the farmer pre-selected
  };

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
      toast.success('Removed from favorites');
    } else {
      newFavorites.add(productId);
      toast.success('Added to favorites');
    }
    setFavorites(newFavorites);
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.farmerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-content">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink mb-2">
          Welcome, {user?.name}! 🛒
        </h1>
        <p className="text-graphite">
          Discover fresh, local produce from farmers in your area
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
                  placeholder="Search products, farmers, or descriptions..."
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
          {isLoading ? 'Loading...' : `${filteredProducts.length} products found`}
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory && ` in ${categoryOptions.find(c => c.value === selectedCategory)?.label}`}
        </p>
        <div className="flex gap-2">
          <Link to="/customer/farmers">
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Browse Farmers
            </Button>
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-graphite mb-2">
              No products found
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} hover className="group">
              <CardContent className="p-0">
                {/* Product Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary-50 to-accent-50 rounded-t-card flex items-center justify-center relative overflow-hidden">
                  <div className="text-4xl">
                    {getCategoryIcon(product.category)}
                  </div>
                  
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                      favorites.has(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.has(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="p-4">
                  {/* Product Info */}
                  <div className="mb-3">
                    <h3 className="font-semibold text-ink mb-1 group-hover:text-primary-500 transition-colors">
                      <Link to={`/listing/${product.id}`}>
                        {product.name}
                      </Link>
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="primary" size="sm">
                        {getCategoryIcon(product.category)} {product.category}
                      </Badge>
                      <span className="text-lg font-bold text-primary-500">
                        ${product.price.toFixed(2)}
                        <span className="text-sm text-graphite font-normal">
                          /{product.unit}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Farmer Info */}
                  {product.farmer && (
                    <div className="mb-3 p-3 bg-mist rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <Link 
                          to={`/farmer-profile/${product.farmerId}`}
                          className="font-medium text-ink text-sm hover:text-primary-600 transition-colors"
                        >
                          {product.farmer.farmName}
                        </Link>
                        {product.farmer.averageRating > 0 && (
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                            <span className="text-xs text-graphite">
                              {product.farmer.averageRating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-graphite">
                        <MapPin className="w-3 h-3 mr-1" />
                        {product.farmer.location}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-sm text-graphite line-clamp-2 mb-3">
                    {product.description}
                  </p>

                  {/* Availability */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-graphite">Available:</span>
                    <span className={`font-medium ${
                      product.quantity < 10 ? 'text-warning' : 'text-success'
                    }`}>
                      {product.quantity} {product.unit}s
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button
                  onClick={() => handleContactFarmer(product.farmerName || 'Farmer')}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Contact
                </Button>
                <Button
                  onClick={() => toast.success('Added to cart! (Feature coming soon)')}
                  variant="primary"
                  size="sm"
                  className="flex-1"
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Order
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Call to Action */}
      {!isLoading && filteredProducts.length > 0 && (
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
