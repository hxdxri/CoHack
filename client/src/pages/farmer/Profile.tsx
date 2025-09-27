import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { farmersAPI, reviewsAPI } from '@/lib/api';
import { FarmerProfile as FarmerProfileType, ReviewWithCustomer } from '@/types';
import { useAuthStore } from '@/store/auth';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface FarmerProfileWithDetails extends FarmerProfileType {
  name: string;
  email: string;
  reviews: ReviewWithCustomer[];
  products: any[];
  productCount: number;
}

export const FarmerProfile: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<FarmerProfileWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine if this is the current user's profile or viewing another farmer
  const isOwnProfile = !id || id === user?.id;
  const farmerId = id || user?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!farmerId) {
        setError('Farmer ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let response;
        if (isOwnProfile && user?.role === 'farmer') {
          // Get own profile with auth
          response = await farmersAPI.getMyProfile();
        } else {
          // Get public profile
          response = await farmersAPI.getById(farmerId);
        }

        setProfile(response.data);
      } catch (err: any) {
        console.error('Error fetching farmer profile:', err);
        setError(err.response?.data?.error || 'Failed to load farmer profile');
        toast.error('Failed to load farmer profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [farmerId, isOwnProfile, user]);

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bone">
        <LoadingSpinner message="Loading farmer profile..." />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Not Found</h3>
            <p className="text-gray-600 mb-4">{error || 'The farmer profile could not be loaded.'}</p>
            <Button onClick={() => navigate(-1)} variant="outline">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile.farmName}</h1>
              <p className="text-lg text-gray-600">by {profile.name}</p>
            </div>
            {isOwnProfile && (
              <Button onClick={() => navigate('/farmer/profile/edit')} variant="outline">
                Edit Profile
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {profile.location}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              {profile.productCount} Products
            </div>
            <div className="flex items-center">
              {renderStarRating(profile.averageRating)}
              <span className="ml-1">({profile.totalReviews} reviews)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Farm Description */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">About Our Farm</h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{profile.description}</p>
              </CardContent>
            </Card>

            {/* Farm History */}
            {profile.farmHistory && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900">Our Story</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{profile.farmHistory}</p>
                </CardContent>
              </Card>
            )}

            {/* Recent Products */}
            {profile.products && profile.products.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Our Products</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/customer/farmers`)}
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.products.slice(0, 4).map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <Badge variant="primary">{product.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-primary-600">
                            ${product.price}/{product.unit}
                          </span>
                          <span className="text-sm text-gray-500">
                            {product.quantity} {product.unit} available
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Farm Stats */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Farm Statistics</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Products</span>
                  <span className="font-semibold">{profile.productCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Rating</span>
                  <div className="flex items-center">
                    {renderStarRating(profile.averageRating)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Reviews</span>
                  <span className="font-semibold">{profile.totalReviews}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold">
                    {formatDate(profile.createdAt)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-700">{profile.name}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">{profile.email}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700">{profile.location}</span>
                </div>
              </CardContent>
              {!isOwnProfile && (
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => navigate(`/messages?user=${farmerId}`)}
                  >
                    Send Message
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>

        {/* Customer Reviews Section */}
        {profile.reviews && profile.reviews.length > 0 && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Customer Reviews</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {profile.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center mb-1">
                            <span className="font-medium text-gray-900 mr-3">
                              {review.customerName}
                            </span>
                            {renderStarRating(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Reviews Message */}
        {(!profile.reviews || profile.reviews.length === 0) && (
          <div className="mt-8">
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                <p className="text-gray-600">
                  {isOwnProfile 
                    ? "You haven't received any reviews yet. Keep providing great products and service!"
                    : "This farmer hasn't received any reviews yet. Be the first to leave a review!"
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
