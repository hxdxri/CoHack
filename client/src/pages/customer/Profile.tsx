import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { reviewsAPI, authAPI } from '@/lib/api';
import { User, ReviewWithFarmer } from '@/types';
import { useAuthStore } from '@/store/auth';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { User as UserIcon, Mail, Calendar, Star, MessageCircle, ShoppingBag, Settings } from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [reviews, setReviews] = useState<ReviewWithFarmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(user);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch customer's reviews
        const reviewsResponse = await reviewsAPI.getMyReviews();
        setReviews(reviewsResponse.data);
      } catch (err: any) {
        console.error('Error fetching customer data:', err);
        setError(err.response?.data?.error || 'Failed to load profile data');
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'customer') {
      fetchCustomerData();
    } else {
      setError('Access denied. Customer profile only.');
      setLoading(false);
    }
  }, [user]);

  const handleProfileUpdated = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    updateUser(updatedUser);
  };

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

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const handleEditReview = (reviewId: string) => {
    // Navigate to edit review page or open modal
    navigate(`/customer/reviews/edit/${reviewId}`);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await reviewsAPI.delete(reviewId);
      setReviews(reviews.filter(review => review.id !== reviewId));
      toast.success('Review deleted successfully');
    } catch (err: any) {
      console.error('Error deleting review:', err);
      toast.error(err.response?.data?.error || 'Failed to delete review');
    }
  };

  if (loading) {
    return (
      <ProfileLayout>
        <LoadingSpinner message="Loading your profile..." />
      </ProfileLayout>
    );
  }

  if (error || !currentUser) {
    return (
      <ProfileLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Not Available</h3>
              <p className="text-gray-600 mb-4">{error || 'Your profile could not be loaded.'}</p>
              <Button onClick={() => navigate('/customer/dashboard')} variant="outline">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{currentUser.name}</h1>
                <p className="text-lg text-gray-600">Customer Profile</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsEditModalOpen(true)} 
              variant="outline"
              className="flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Account Information */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Account Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <UserIcon className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Full Name</span>
                    </div>
                    <p className="text-gray-900 font-medium">{currentUser.name}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Email Address</span>
                    </div>
                    <p className="text-gray-900 font-medium">{currentUser.email}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <span className="text-sm font-medium">Account Type</span>
                    </div>
                    <Badge variant="primary" className="capitalize">{currentUser.role}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Member Since</span>
                    </div>
                    <p className="text-gray-900 font-medium">{formatDate(currentUser.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* My Reviews */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    My Reviews
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/customer/farmers')}
                  >
                    Write New Review
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="font-semibold text-gray-900 mr-3">
                                {review.farmName}
                              </h3>
                              {renderStarRating(review.rating)}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              Farmer: {review.farmerName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Reviewed on {formatDate(review.createdAt)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditReview(review.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteReview(review.id)}
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                        {review.comment && (
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Star className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-600 mb-4">
                      You haven't written any reviews yet. Start exploring farms and share your experience!
                    </p>
                    <Button onClick={() => navigate('/customer/farmers')}>
                      Discover Farmers
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Stats */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Profile Statistics</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Reviews</span>
                  <span className="font-semibold text-lg">{reviews.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Rating Given</span>
                  <div className="flex items-center">
                    {reviews.length > 0 ? (
                      renderStarRating(calculateAverageRating())
                    ) : (
                      <span className="text-gray-400">No ratings yet</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account Status</span>
                  <Badge variant="success">Active</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/customer/dashboard')}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Browse Products
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/messages')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Messages
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/customer/orders')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Past Orders
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={currentUser}
          onProfileUpdated={handleProfileUpdated}
        />
      </div>
    </ProfileLayout>
  );
};
