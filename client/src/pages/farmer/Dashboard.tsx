import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Package, 
  Star, 
  TrendingUp, 
  MessageCircle,
  Eye,
  Edit,
  MoreVertical
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { productsAPI, farmersAPI, messagesAPI } from '@/lib/api';
import { Product, FarmerProfile } from '@/types';

/**
 * Farmer Dashboard
 * 
 * Main dashboard for farmers showing overview stats, recent products,
 * messages, and quick actions to manage their farm business.
 */
export const FarmerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all dashboard data in parallel
        const [productsRes, profileRes, messagesRes] = await Promise.all([
          productsAPI.getMyProducts(),
          farmersAPI.getMyProfile(),
          messagesAPI.getUnreadCount(),
        ]);

        setProducts(productsRes.data);
        setFarmerProfile(profileRes.data);
        setUnreadMessages(messagesRes.data.count);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const activeProducts = products.filter(p => p.isActive);

  const stats = [
    {
      title: 'Active Products',
      value: activeProducts.length,
      icon: Package,
      color: 'text-primary-500',
      bgColor: 'bg-primary-100',
    },
    {
      title: 'Total Reviews',
      value: farmerProfile?.totalReviews || 0,
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Average Rating',
      value: farmerProfile?.averageRating?.toFixed(1) || '0.0',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Unread Messages',
      value: unreadMessages,
      icon: MessageCircle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
  ];

  return (
    <div className="page-content">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink mb-2">
          Welcome back, {user?.name}! 🌱
        </h1>
        <p className="text-graphite">
          Here's what's happening with {farmerProfile?.farmName || 'your farm'} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-6">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-ink mb-1">{stat.value}</h3>
              <p className="text-sm text-graphite">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Products */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-ink">Recent Products</h2>
                <Link to="/farmer/products">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-graphite mb-2">No products yet</h3>
                  <p className="text-graphite mb-4">Start by adding your first product to attract customers.</p>
                  <Link to="/farmer/products">
                    <Button variant="primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-primary-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-ink">{product.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={product.isActive ? 'success' : 'gray'}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <span className="text-sm text-graphite">
                              ${product.price.toFixed(2)} per {product.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-graphite">
                          {product.quantity} {product.unit}s left
                        </span>
                        <button className="p-1 text-graphite hover:text-primary-500 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Farm Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-ink">Quick Actions</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/farmer/products" className="block">
                <Button variant="primary" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
              </Link>
              <Link to="/farmer/orders" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Manage Orders
                </Button>
              </Link>
              <Link to="/farmer/profile" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Farm Profile
                </Button>
              </Link>
              <Link to="/messages" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  View Messages
                  {unreadMessages > 0 && (
                    <Badge variant="danger" size="sm" className="ml-auto">
                      {unreadMessages}
                    </Badge>
                  )}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Farm Profile Summary */}
          {farmerProfile && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-ink">Farm Profile</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-ink">{farmerProfile.farmName}</h4>
                    <p className="text-sm text-graphite">{farmerProfile.location}</p>
                  </div>
                  
                  {farmerProfile.averageRating > 0 && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < farmerProfile.averageRating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-graphite">
                        {farmerProfile.averageRating.toFixed(1)} ({farmerProfile.totalReviews} reviews)
                      </span>
                    </div>
                  )}
                  
                  <p className="text-sm text-graphite line-clamp-3">
                    {farmerProfile.description}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/farmer/profile" className="w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View Public Profile
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )}

          {/* Tips Card */}
          <Card className="bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-ink mb-2">💡 Farmer Tips</h3>
              <ul className="text-sm text-graphite space-y-1">
                <li>• Update product quantities regularly</li>
                <li>• Respond to customer messages quickly</li>
                <li>• Add detailed product descriptions</li>
                <li>• Share your farm's story in your profile</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
