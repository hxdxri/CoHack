import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { farmersAPI, reviewsAPI } from '@/lib/api';
import { FarmerProfile as FarmerProfileType, ReviewWithCustomer, User } from '@/types';
import { useAuthStore } from '@/store/auth';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { PhotoGallery } from '@/components/ui/PhotoGallery';
import { FarmTimeline } from '@/components/ui/FarmTimeline';
import { EnhancedFarmTimeline } from '@/components/ui/EnhancedFarmTimeline';
import { FarmingPractices } from '@/components/ui/FarmingPractices';
import { FarmerBio } from '@/components/ui/FarmerBio';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { VideoEmbed } from '@/components/ui/VideoEmbed';
import { User as UserIcon, Mail, Calendar, Star, MessageCircle, Package, MapPin, Building, FileText, Settings, Camera, History, Edit3, Upload } from 'lucide-react';

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
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState<FarmerProfileWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(user);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempContent, setTempContent] = useState<string>('');

  // Determine if this is the current user's profile or viewing another farmer
  const isOwnProfile = !id || id === user?.id;
  const farmerId = id || user?.id;

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

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

  const handleProfileUpdated = (updatedUser: User, updatedFarmerProfile?: FarmerProfileType) => {
    setCurrentUser(updatedUser);
    updateUser(updatedUser);
    if (updatedFarmerProfile && isOwnProfile) {
      setProfile(prev => prev ? { ...prev, ...updatedFarmerProfile } : null);
    }
  };

  const startEditing = (section: string, content: string) => {
    setEditingSection(section);
    setTempContent(content);
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setTempContent('');
  };

  const saveContent = async (section: string) => {
    // Here you would typically make an API call to save the content
    // For now, we'll just update the local state
    if (profile) {
      const updatedProfile = { ...profile };
      if (section === 'ourStory') {
        updatedProfile.ourStoryRich = tempContent;
      } else if (section === 'aboutOurFarm') {
        updatedProfile.aboutOurFarmRich = tempContent;
      }
      setProfile(updatedProfile);
    }
    setEditingSection(null);
    setTempContent('');
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

  if (loading) {
    return (
      <ProfileLayout>
        <LoadingSpinner message="Loading farmer profile..." />
      </ProfileLayout>
    );
  }

  if (error || !profile) {
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Not Found</h3>
              <p className="text-gray-600 mb-4">{error || 'The farmer profile could not be loaded.'}</p>
              <Button onClick={() => navigate(-1)} variant="outline">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Cover Photo Section */}
        {profile.coverPhoto && (
          <section className="mb-8 relative">
            <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={profile.coverPhoto}
                alt="Farm Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              {isOwnProfile && (
                <div className="absolute top-4 right-4">
                  <Button
                    onClick={() => setIsEditModalOpen(true)}
                    className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                    size="sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Change Cover
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Header Section */}
        <section className="mb-8 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-6">
              {/* Larger Farmer Portrait */}
              <div className="relative">
                {profile.farmerPhoto ? (
                  <img
                    src={profile.farmerPhoto}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
                    <Building className="w-12 h-12 text-white" />
                  </div>
                )}
                {isOwnProfile && (
                  <Button
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white p-0"
                    size="sm"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profile.farmName}</h1>
                <p className="text-lg text-gray-600">by {profile.name}</p>
                {profile.yearsFarming && (
                  <p className="text-sm text-gray-500">{profile.yearsFarming} years farming</p>
                )}
              </div>
            </div>
            {isOwnProfile && (
              <Button 
                onClick={() => setIsEditModalOpen(true)} 
                variant="outline"
                className="flex items-center transition-all duration-200 hover:scale-105"
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {profile.location}
            </div>
            <div className="flex items-center">
              <Package className="w-4 h-4 mr-2" />
              {profile.productCount} Products
            </div>
            <div className="flex items-center">
              {renderStarRating(profile.averageRating)}
              <span className="ml-2">({profile.totalReviews} reviews)</span>
            </div>
            {profile.farmSize && (
              <div className="flex items-center">
                <Building className="w-4 h-4 mr-2" />
                {profile.farmSize} acres
              </div>
            )}
          </div>
        </section>

        <div className="space-y-8 lg:space-y-12">
          {/* Hero Section with Story */}
          <section className="relative bg-white rounded-2xl shadow-lg p-8 lg:p-12 transition-all duration-300 hover:shadow-xl">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12 items-start">
              {/* Story Content - Takes 2/3 of width */}
              <div className="xl:col-span-2 space-y-8">
                {/* Our Story Section */}
                <div className="animate-fade-in">
                  <RichTextEditor
                    title="Our Story"
                    content={profile.ourStoryRich || profile.ourStory || ''}
                    onChange={(content) => setTempContent(content)}
                    onEdit={() => startEditing('ourStory', profile.ourStoryRich || profile.ourStory || '')}
                    onSave={() => saveContent('ourStory')}
                    onCancel={cancelEditing}
                    isEditing={editingSection === 'ourStory'}
                    placeholder="Share your farm's story, values, and what makes you unique..."
                  />
                </div>

                {/* About Our Farm Section */}
                <div className="animate-fade-in">
                  <RichTextEditor
                    title="About Our Farm"
                    content={profile.aboutOurFarmRich || profile.aboutOurFarm || profile.description || ''}
                    onChange={(content) => setTempContent(content)}
                    onEdit={() => startEditing('aboutOurFarm', profile.aboutOurFarmRich || profile.aboutOurFarm || profile.description || '')}
                    onSave={() => saveContent('aboutOurFarm')}
                    onCancel={cancelEditing}
                    isEditing={editingSection === 'aboutOurFarm'}
                    placeholder="Describe your farm, practices, and what you grow..."
                  />
                </div>
              </div>

              {/* Farmer Photo - Hero Image - Takes 1/3 of width */}
              {profile.farmerPhoto && (
                <div className="relative xl:col-span-1">
                  <div className="relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-105">
                    <img
                      src={profile.farmerPhoto}
                      alt="Farmer"
                      className="w-full h-[400px] lg:h-[500px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Photo Gallery Section */}
          <section className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 lg:p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
            <PhotoGallery
              farmPhotos={profile.farmPhotos}
              farmerPhoto={profile.farmerPhoto}
              workPhotos={profile.workPhotos}
              isEditable={isOwnProfile}
              onEdit={() => setIsEditModalOpen(true)}
            />
          </section>

          {/* Video Introduction Section */}
          {profile.introVideoUrl && (
            <section className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
              <VideoEmbed
                videoUrl={profile.introVideoUrl}
                title="Farm Introduction Video"
                isEditable={isOwnProfile}
                onEdit={() => setIsEditModalOpen(true)}
                onRemove={() => {
                  if (profile) {
                    setProfile({ ...profile, introVideoUrl: undefined });
                  }
                }}
              />
            </section>
          )}

          {/* Farm Timeline Section */}
          {profile.timeline && profile.timeline.length > 0 && (
            <section className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 lg:p-8 text-white shadow-xl transition-all duration-300 hover:shadow-2xl">
              <EnhancedFarmTimeline
                timeline={profile.timeline}
                isEditable={isOwnProfile}
                onEdit={() => setIsEditModalOpen(true)}
                onAddEvent={() => setIsEditModalOpen(true)}
                onEditEvent={(event) => setIsEditModalOpen(true)}
                onDeleteEvent={(eventId) => {
                  if (profile) {
                    setProfile({
                      ...profile,
                      timeline: profile.timeline?.filter(e => e.id !== eventId) || []
                    });
                  }
                }}
              />
            </section>
          )}

          {/* Call to Action for Enhanced Profile */}
          {isOwnProfile && (!profile.ourStory || !profile.aboutOurFarm || !profile.farmerPhoto || !profile.farmPhotos?.length || !profile.timeline?.length) && (
            <section className="bg-gradient-to-r from-primary-50 to-green-50 border border-primary-200 rounded-2xl p-6 lg:p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <Camera className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Complete Your Farm Profile</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-base leading-relaxed">
                  Share your story, add photos of your farm and work, and create a timeline of your farm's journey. 
                  This helps customers connect with you and builds trust in your products.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {!profile.ourStory && (
                    <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 transition-all duration-200 hover:bg-yellow-200">
                      <FileText className="w-4 h-4 mr-2" />
                      Add Your Story
                    </span>
                  )}
                  {!profile.aboutOurFarm && (
                    <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 transition-all duration-200 hover:bg-yellow-200">
                      <Building className="w-4 h-4 mr-2" />
                      Describe Your Farm
                    </span>
                  )}
                  {!profile.farmerPhoto && (
                    <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 transition-all duration-200 hover:bg-yellow-200">
                      <Camera className="w-4 h-4 mr-2" />
                      Add Your Photo
                    </span>
                  )}
                  {!profile.farmPhotos?.length && (
                    <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 transition-all duration-200 hover:bg-yellow-200">
                      <Camera className="w-4 h-4 mr-2" />
                      Add Farm Photos
                    </span>
                  )}
                  {!profile.timeline?.length && (
                    <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 transition-all duration-200 hover:bg-yellow-200">
                      <History className="w-4 h-4 mr-2" />
                      Create Timeline
                    </span>
                  )}
                </div>
                <Button
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Complete Profile
                </Button>
              </div>
            </section>
          )}

          {/* Products and Reviews Section */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
            {/* Products - Takes 3/4 of width */}
            <div className="xl:col-span-3">
              {profile.products && profile.products.length > 0 && (
                <section className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
                      <Package className="w-8 h-8 mr-3" />
                      Our Products
                    </h2>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/farmer/products')}
                      className="px-6 py-3 rounded-xl text-base font-medium transition-all duration-200 hover:scale-105"
                    >
                      Manage Products
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profile.products.slice(0, 6).map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
                          <Badge variant="primary" className="px-3 py-1 text-sm">{product.category}</Badge>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed text-base">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-primary-600">
                            ${product.price}/{product.unit}
                          </span>
                          <span className="text-sm text-gray-500 font-medium">
                            {product.quantity} {product.unit} available
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar - Takes 1/4 of width */}
            <div className="space-y-6">
              {/* Farmer Bio */}
              <FarmerBio
                farmerName={profile.name}
                farmerBio={profile.farmerBio}
                farmerInterests={profile.farmerInterests}
                yearsFarming={profile.yearsFarming}
                farmSize={profile.farmSize}
                specialties={profile.specialties}
                location={profile.location}
                isEditable={isOwnProfile}
                onEdit={() => setIsEditModalOpen(true)}
              />

              {/* Farming Practices */}
              <FarmingPractices
                practices={profile.farmingPractices || []}
                isEditable={isOwnProfile}
                onEdit={() => setIsEditModalOpen(true)}
                onTogglePractice={(practiceId) => {
                  if (profile) {
                    const updatedPractices = profile.farmingPractices?.map(p => 
                      p.id === practiceId ? { ...p, isActive: !p.isActive } : p
                    ) || [];
                    setProfile({ ...profile, farmingPractices: updatedPractices });
                  }
                }}
              />

              {/* Farm Stats */}
              <section className="bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Farm Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium text-base">Total Products</span>
                    <span className="font-bold text-2xl text-gray-900">{profile.productCount}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium text-base">Average Rating</span>
                    <div className="flex items-center">
                      {renderStarRating(profile.averageRating)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium text-base">Total Reviews</span>
                    <span className="font-bold text-2xl text-gray-900">{profile.totalReviews}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600 font-medium text-base">Member Since</span>
                    <span className="font-semibold text-gray-900 text-base">
                      {formatDate(profile.createdAt)}
                    </span>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section className="bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <UserIcon className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="text-gray-700 font-medium text-base">{profile.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="text-gray-700 font-medium text-base">{profile.email}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="text-gray-700 font-medium text-base">{profile.location}</span>
                  </div>
                </div>
                {!isOwnProfile && (
                  <div className="mt-6">
                    <Button 
                      className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-medium text-base transition-all duration-200 hover:scale-105"
                      onClick={() => navigate(`/messages?user=${farmerId}`)}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </div>
                )}
              </section>

              {/* Quick Actions - Only for own profile */}
              {isOwnProfile && (
                <section className="bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium text-base transition-all duration-200 hover:scale-105" 
                      onClick={() => navigate('/farmer/products')}
                    >
                      <Package className="w-5 h-5 mr-3" />
                      Manage Products
                    </Button>
                    <Button 
                      className="w-full justify-start bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium text-base transition-all duration-200 hover:scale-105" 
                      onClick={() => navigate('/farmer/dashboard')}
                    >
                      <Building className="w-5 h-5 mr-3" />
                      Dashboard
                    </Button>
                    <Button 
                      className="w-full justify-start bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium text-base transition-all duration-200 hover:scale-105" 
                      onClick={() => navigate('/messages')}
                    >
                      <MessageCircle className="w-5 h-5 mr-3" />
                      Messages
                    </Button>
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Customer Reviews Section */}
          {profile.reviews && profile.reviews.length > 0 && (
            <section className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <Star className="w-8 h-8 mr-3" />
                Customer Reviews
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="font-bold text-gray-900 text-lg mr-3">
                            {review.customerName}
                          </span>
                          {renderStarRating(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500 font-medium">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700 leading-relaxed bg-white rounded-lg p-4 text-base">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* No Reviews Message */}
          {(!profile.reviews || profile.reviews.length === 0) && (
            <section className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg text-center transition-all duration-300 hover:shadow-xl">
              <div className="text-gray-400 mb-6">
                <Star className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Reviews Yet</h3>
              <p className="text-gray-600 text-base max-w-2xl mx-auto leading-relaxed">
                {isOwnProfile 
                  ? "You haven't received any reviews yet. Keep providing great products and service!"
                  : "This farmer hasn't received any reviews yet. Be the first to leave a review!"
                }
              </p>
            </section>
          )}
        </div>

        {/* Edit Profile Modal */}
        {isOwnProfile && (
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            user={currentUser || user}
            farmerProfile={profile}
            onProfileUpdated={handleProfileUpdated}
          />
        )}
      </div>
    </ProfileLayout>
  );
};
