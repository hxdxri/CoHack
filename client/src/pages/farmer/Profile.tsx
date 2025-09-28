import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { farmersAPI } from '@/lib/api';
import { FarmerProfile as FarmerProfileType, ReviewWithCustomer, User } from '@/types';
import { useAuthStore } from '@/store/auth';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { HorizontalPhotoGallery } from '@/components/ui/HorizontalPhotoGallery';
import { HorizontalFarmTimeline } from '@/components/ui/HorizontalFarmTimeline';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { VideoEmbed } from '@/components/ui/VideoEmbed';
import { User as UserIcon, Mail, Star, MessageCircle, Package, MapPin, Building, FileText, Settings, Camera, History, Upload, Clock, Calendar } from 'lucide-react';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(user);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempContent, setTempContent] = useState<string>('');
  const [showStickySidebar, setShowStickySidebar] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Determine if this is the current user's profile or viewing another farmer
  const isOwnProfile = !id || id === user?.id;
  const farmerId = id || user?.id;

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  // Scroll detection for sticky sidebar
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerBottom = headerRef.current.getBoundingClientRect().bottom;
        // Add offset for navigation bar height (typically 64px)
        setShowStickySidebar(headerBottom < 80);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

        setProfile(response.data as FarmerProfileWithDetails);
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
    if (updatedFarmerProfile && isOwnProfile) {
      setProfile(prev => prev ? { ...prev, ...updatedFarmerProfile } : null);
    }
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
        <LoadingSpinner />
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Cover Photo Section */}
        {profile.coverPhoto && (
          <section className="mb-6 relative">
            <div className="relative h-48 lg:h-56 rounded-xl overflow-hidden shadow-lg">
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
        <section ref={headerRef} className="mb-8 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              {/* Farmer Portrait */}
              <div className="relative">
                {profile.farmerPhoto ? (
                  <img
                    src={profile.farmerPhoto}
                    alt={profile.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
                    <Building className="w-10 h-10 text-white" />
                  </div>
                )}
                {isOwnProfile && (
                  <Button
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white p-0"
                    size="sm"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-ink">{profile.farmName}</h1>
                <p className="text-lg text-graphite">by {profile.name}</p>
                {profile.yearsFarming && (
                  <p className="text-sm text-graphite">{profile.yearsFarming} years farming</p>
                )}
              </div>
            </div>
            {isOwnProfile && (
              <Button 
                onClick={() => setIsEditModalOpen(true)} 
                variant="outline"
                className="flex items-center transition-all duration-200 hover:scale-105"
                size="sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
          
          {/* Farm Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-mist rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="w-5 h-5 text-primary-500 mr-2" />
                <span className="text-sm font-medium text-ink">Location</span>
              </div>
              <p className="text-graphite text-sm">{profile.location}</p>
            </div>
            <div className="bg-mist rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Package className="w-5 h-5 text-primary-500 mr-2" />
                <span className="text-sm font-medium text-ink">Products</span>
              </div>
              <p className="text-2xl font-bold text-ink">{profile.productCount}</p>
            </div>
            <div className="bg-mist rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-ink">Rating</span>
              </div>
              <div className="flex items-center justify-center">
                {renderStarRating(profile.averageRating)}
                <span className="ml-1 text-sm text-graphite">({profile.totalReviews})</span>
              </div>
            </div>
            {profile.farmSize && (
              <div className="bg-mist rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Building className="w-5 h-5 text-primary-500 mr-2" />
                  <span className="text-sm font-medium text-ink">Farm Size</span>
                </div>
                <p className="text-2xl font-bold text-ink">{profile.farmSize}</p>
                <p className="text-xs text-graphite">acres</p>
              </div>
            )}
          </div>

          {/* Seamless Banner and Story Section */}
          <div className="relative -mx-6 mb-8">
            {/* Banner Image */}
            <div className="relative h-96 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Farm Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h2 className="text-5xl font-bold mb-3 drop-shadow-lg text-white">Welcome to {profile.farmName}</h2>
                <p className="text-2xl opacity-95 drop-shadow-md text-white">Discover our story and farming practices</p>
              </div>
            </div>

            {/* Connected Story Section - Seamlessly attached */}
            <div className="bg-white rounded-t-xl shadow-lg overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Our Story Section */}
                <div className="bg-gray-50 p-8 flex-1">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                      <Building className="w-6 h-6 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-ink">Our Story</h2>
                  </div>
                  <div className="prose prose-lg max-w-none text-graphite">
                    <RichTextEditor
                      title=""
                      content={profile.ourStoryRich || profile.ourStory || ''}
                      onChange={(content) => setTempContent(content)}
                      onSave={() => saveContent('ourStory')}
                      onCancel={cancelEditing}
                      isEditing={editingSection === 'ourStory'}
                      placeholder="Share your farm's story, values, and what makes you unique..."
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-gray-200"></div>

                {/* About Our Farm Section */}
                <div className="bg-white p-8 flex-1">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                      <Package className="w-6 h-6 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-ink">About Our Farm</h2>
                  </div>
                  <div className="prose prose-lg max-w-none text-graphite">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: profile.aboutOurFarmRich || profile.aboutOurFarm || profile.description || `<p class="text-graphite italic">Describe your farm, practices, and what you grow...</p>` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Layout with Sticky Sidebar */}
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 max-w-4xl space-y-6">

            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* Farm Stats Highlight */}
            <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-ink mb-6 text-center">Farm Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-8 h-8 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-ink mb-2">2,400</div>
                  <div className="text-graphite">Acres of farmland</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-ink mb-2">50+</div>
                  <div className="text-graphite">Vegetable varieties</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-8 h-8 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-ink mb-2">15,000</div>
                  <div className="text-graphite">Sq-ft greenhouse</div>
                </div>
              </div>
            </div>


            {/* Photo Gallery Section */}
            <HorizontalPhotoGallery
            photos={[
              ...(profile.farmPhotos || []).map(photo => ({ ...photo, type: 'farm' })),
              ...(profile.workPhotos || []).map(photo => ({ ...photo, type: 'work' })),
              ...(profile.farmerPhoto ? [{ id: 'farmer', url: profile.farmerPhoto, caption: 'Farmer Portrait', type: 'farmer' }] : [])
            ]}
            title="Farm Photos"
            isEditable={false}
          />

            {/* Video Introduction Section */}
            {profile.introVideoUrl && (
              <section className="bg-white rounded-xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl">
              <VideoEmbed
                videoUrl={profile.introVideoUrl}
                title="Farm Introduction Video"
                isEditable={false}
              />
            </section>
          )}

            {/* Farm Timeline Section */}
            {profile.timeline && profile.timeline.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-ink">Farm Timeline</h2>
                </div>
                <HorizontalFarmTimeline
                  timeline={profile.timeline}
                  isEditable={false}
                />
              </div>
            )}

            {/* Call to Action for Enhanced Profile */}
            {isOwnProfile && (!profile.ourStory || !profile.aboutOurFarm || !profile.farmerPhoto || !profile.farmPhotos?.length || !profile.timeline?.length) && (
            <section className="bg-gradient-to-r from-primary-50 to-green-50 border border-primary-200 rounded-xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <Camera className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Complete Your Farm Profile</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Share your story, add photos, and create a timeline to help customers connect with your farm.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {!profile.ourStory && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <FileText className="w-3 h-3 mr-1" />
                      Add Story
                    </span>
                  )}
                  {!profile.aboutOurFarm && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Building className="w-3 h-3 mr-1" />
                      Describe Farm
                    </span>
                  )}
                  {!profile.farmerPhoto && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Camera className="w-3 h-3 mr-1" />
                      Add Photo
                    </span>
                  )}
                  {!profile.farmPhotos?.length && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Camera className="w-3 h-3 mr-1" />
                      Add Photos
                    </span>
                  )}
                  {!profile.timeline?.length && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <History className="w-3 h-3 mr-1" />
                      Create Timeline
                    </span>
                  )}
                </div>
                <Button
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Complete Profile
                </Button>
              </div>
            </section>
          )}

            {/* Products Section */}
            {profile.products && profile.products.length > 0 && (
              <section className="bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl mb-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                      <Package className="w-6 h-6 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-ink">Our Products</h2>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/farmer/products')}
                    className="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                    size="sm"
                  >
                    Manage Products
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.products.slice(0, 6).map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-gray-900 text-base">{product.name}</h3>
                        <Badge variant="primary" className="px-2 py-1 text-xs">{product.category}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3 leading-relaxed text-sm line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-primary-600">
                          ${product.price}/{product.unit}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {product.quantity} {product.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Customer Reviews Section */}
            {profile.reviews && profile.reviews.length > 0 && (
              <section className="bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl mb-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <Star className="w-6 h-6 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-ink">Customer Reviews</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.reviews.slice(0, 4).map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center mb-1">
                            <span className="font-bold text-gray-900 text-sm mr-2">
                              {review.customerName}
                            </span>
                            {renderStarRating(review.rating)}
                          </div>
                          <span className="text-xs text-gray-500 font-medium">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 leading-relaxed bg-white rounded p-3 text-sm line-clamp-3">
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
              <section className="bg-white rounded-xl p-8 shadow-lg text-center transition-all duration-300 hover:shadow-xl mb-8">
                <div className="text-gray-400 mb-6">
                  <Star className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-ink mb-4">No Reviews Yet</h3>
                <p className="text-graphite text-lg max-w-2xl mx-auto leading-relaxed">
                  {isOwnProfile 
                    ? "You haven't received any reviews yet. Keep providing great products and service!"
                    : "This farmer hasn't received any reviews yet. Be the first to leave a review!"
                  }
                </p>
              </section>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className={`hidden lg:block w-80 flex-shrink-0 transition-all duration-300 ${
            showStickySidebar ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
          }`}>
            <div className="sticky top-20 space-y-4">
              {/* Combined Farmer Info Section */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Farmer Bio Header */}
                <div className="bg-gradient-to-r from-primary-500 to-green-600 p-6 text-white">
                  <div className="flex items-center space-x-4">
                    {profile.farmerPhoto ? (
                      <img
                        src={profile.farmerPhoto}
                        alt={profile.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <UserIcon className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold">{profile.name}</h3>
                      <p className="text-white/90 text-sm">Farmer & Owner</p>
                    </div>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="p-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-ink">{profile.productCount}</div>
                      <div className="text-sm text-graphite">Products</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-ink">{profile.totalReviews}</div>
                      <div className="text-sm text-graphite">Reviews</div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center">
                      {renderStarRating(profile.averageRating)}
                      <span className="ml-2 text-graphite text-sm">({profile.averageRating.toFixed(1)})</span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-3 text-primary-500" />
                      <span className="text-graphite">{profile.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-3 text-primary-500" />
                      <span className="text-graphite">{profile.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-3 text-primary-500" />
                      <span className="text-graphite">Member since {formatDate(profile.createdAt)}</span>
                    </div>
                  </div>

                  {/* Farming Practices */}
                  {profile.farmingPractices && profile.farmingPractices.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-ink mb-3">Farming Practices</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.farmingPractices.slice(0, 4).map((practice) => (
                          <span
                            key={practice.id}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              practice.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {practice.name}
                          </span>
                        ))}
                        {profile.farmingPractices.length > 4 && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{profile.farmingPractices.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  {!isOwnProfile && (
                    <Button 
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                      onClick={() => navigate(`/messages?user=${farmerId}`)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  )}
                </div>
              </div>

              {/* Quick Actions - Only for own profile */}
              {isOwnProfile && (
                <section className="bg-white rounded-xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button 
                      className="w-full justify-start bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105" 
                      onClick={() => navigate('/farmer/products')}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Manage Products
                    </Button>
                    <Button 
                      className="w-full justify-start bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105" 
                      onClick={() => navigate('/farmer/dashboard')}
                    >
                      <Building className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button 
                      className="w-full justify-start bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105" 
                      onClick={() => navigate('/messages')}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Messages
                    </Button>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isOwnProfile && (
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            user={currentUser || user!}
            farmerProfile={profile}
            onProfileUpdated={handleProfileUpdated}
          />
        )}
      </div>
    </ProfileLayout>
  );
};

