import React, { useState, useEffect, useRef } from 'react';
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
  Mail,
  Building,
  Clock,
  Camera,
  User as UserIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { HorizontalPhotoGallery } from '@/components/ui/HorizontalPhotoGallery';
import { HorizontalFarmTimeline } from '@/components/ui/HorizontalFarmTimeline';
import { VideoEmbed } from '@/components/ui/VideoEmbed';
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
  const { sendMessage, loadConversations } = useMessagesStore();
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showStickySidebar, setShowStickySidebar] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (farmerId) {
      fetchFarmData();
      loadConversations();
    }
  }, [farmerId]);

  // Scroll detection for sticky sidebar
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerBottom = headerRef.current.getBoundingClientRect().bottom;
        const footer = document.querySelector('footer');
        
        // Show sidebar when header is scrolled past
        const headerPassed = headerBottom < 80;
        
        // Hide sidebar when footer comes into view
        let footerNotReached = true;
        if (footer) {
          const footerRect = footer.getBoundingClientRect();
          footerNotReached = footerRect.top > window.innerHeight * 0.3; // Hide when footer is 30% into viewport
        }
        
        setShowStickySidebar(headerPassed && footerNotReached);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      const { conversations, setActiveConversation, loadMessages } = useMessagesStore.getState();
      
      // Check if conversation already exists with this farmer
      const existingConversation = conversations.find(conv => conv.partnerId === farmer.userId);
      
      if (existingConversation) {
        // Conversation exists, navigate to messages and set it as active
        setActiveConversation(farmer.userId);
        await loadMessages(farmer.userId);
        toast.success(`Opening conversation with ${farmer.farmName}`);
        navigate('/customer/messages');
      } else {
        // No conversation exists, create a new one
        await sendMessage(farmer.userId, {
          content: `Hi ${farmer.name}! I'm interested in learning more about your farm and products.`
        });
        
        // Reload conversations to include the new one
        await loadConversations();
        
        // Set the new conversation as active and load its messages
        setActiveConversation(farmer.userId);
        await loadMessages(farmer.userId);
        
        toast.success(`Started new conversation with ${farmer.farmName}`);
        navigate('/customer/messages');
      }
    } catch (error) {
      console.error('Error handling farmer contact:', error);
      toast.error('Failed to contact farmer');
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
    <div className="page-content lg:pr-96">
      {/* Cover Photo Section */}
      {farmer.coverPhoto && (
        <section className="mb-6 relative">
          <div className="relative h-48 lg:h-56 rounded-xl overflow-hidden shadow-lg">
            <img
              src={farmer.coverPhoto}
              alt="Farm Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        </section>
      )}

      {/* Header */}
      <div ref={headerRef} className="mb-8 transition-all duration-300">
        <Button
          variant="outline"
          onClick={() => navigate('/customer/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            {/* Farmer Portrait */}
            <div className="relative">
              {farmer.farmerPhoto ? (
                <img
                  src={farmer.farmerPhoto}
                  alt={farmer.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
                  <Building className="w-10 h-10 text-white" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-ink">{farmer.farmName}</h1>
              <p className="text-lg text-graphite">by {farmer.name}</p>
              {farmer.yearsFarming && (
                <p className="text-sm text-graphite">{farmer.yearsFarming} years farming</p>
              )}
            </div>
          </div>
          <Button
            onClick={handleContactFarmer}
            variant="primary"
            size="lg"
            className="flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Contact Farmer
          </Button>
        </div>
        
        {/* Farm Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-mist rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="w-5 h-5 text-primary-500 mr-2" />
              <span className="text-sm font-medium text-ink">Location</span>
            </div>
            <p className="text-graphite text-sm">{farmer.location}</p>
          </div>
          <div className="bg-mist rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Package className="w-5 h-5 text-primary-500 mr-2" />
              <span className="text-sm font-medium text-ink">Products</span>
            </div>
            <p className="text-2xl font-bold text-ink">{products.length}</p>
          </div>
          <div className="bg-mist rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-ink">Rating</span>
            </div>
            <div className="flex items-center justify-center">
              {renderStarRating(farmer.averageRating)}
              <span className="ml-1 text-sm text-graphite">({farmer.totalReviews})</span>
            </div>
          </div>
          {farmer.farmSize && (
            <div className="bg-mist rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Building className="w-5 h-5 text-primary-500 mr-2" />
                <span className="text-sm font-medium text-ink">Farm Size</span>
              </div>
              <p className="text-2xl font-bold text-ink">{farmer.farmSize}</p>
              <p className="text-xs text-graphite">acres</p>
            </div>
          )}
        </div>
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
            <h2 className="text-5xl font-bold mb-3 drop-shadow-lg text-white">Welcome to {farmer.farmName}</h2>
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
                {farmer.ourStoryRich ? (
                  <div dangerouslySetInnerHTML={{ __html: farmer.ourStoryRich }} />
                ) : farmer.ourStory ? (
                  <p>{farmer.ourStory}</p>
                ) : (
                  <p className="text-graphite italic">No story shared yet.</p>
                )}
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
                {farmer.aboutOurFarmRich ? (
                  <div dangerouslySetInnerHTML={{ __html: farmer.aboutOurFarmRich }} />
                ) : farmer.aboutOurFarm ? (
                  <p>{farmer.aboutOurFarm}</p>
                ) : farmer.description ? (
                  <p>{farmer.description}</p>
                ) : (
                  <p className="text-graphite italic">No farm description available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Farm Stats Highlight */}
      <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-ink mb-6 text-center">Farm Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-primary-600" />
            </div>
            <div className="text-3xl font-bold text-ink mb-2">{farmer.farmSize || '2,400'}</div>
            <div className="text-graphite">Acres of farmland</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-primary-600" />
            </div>
            <div className="text-3xl font-bold text-ink mb-2">{products.length}+</div>
            <div className="text-graphite">Product varieties</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-primary-600" />
            </div>
            <div className="text-3xl font-bold text-ink mb-2">{farmer.yearsFarming || '15'}</div>
            <div className="text-graphite">Years farming</div>
          </div>
        </div>
      </div>

      {/* Photo Gallery Section */}
      <HorizontalPhotoGallery
        photos={[
          ...(farmer.farmPhotos || []).map(photo => ({ ...photo, type: 'farm' })),
          ...(farmer.workPhotos || []).map(photo => ({ ...photo, type: 'work' })),
          ...(farmer.farmerPhoto ? [{ id: 'farmer', url: farmer.farmerPhoto, caption: 'Farmer Portrait', type: 'farmer' }] : [])
        ]}
        title="Farm Photos"
        isEditable={false}
      />

      {/* Video Introduction Section */}
      {farmer.introVideoUrl && (
        <section className="bg-white rounded-xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl mb-8">
          <VideoEmbed
            videoUrl={farmer.introVideoUrl}
            title="Farm Introduction Video"
            isEditable={false}
          />
        </section>
      )}

      {/* Farm Timeline Section */}
      {farmer.timeline && farmer.timeline.length > 0 && (
        <div className="mb-8 mt-12">
          <HorizontalFarmTimeline
            timeline={farmer.timeline}
            isEditable={false}
          />
        </div>
      )}

      {/* Farming Practices Section */}
      {farmer.farmingPractices && farmer.farmingPractices.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <Award className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-ink">Farming Practices</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {farmer.farmingPractices.map((practice) => (
                <div
                  key={practice.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    practice.isActive
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-ink">{practice.name}</h3>
                    <Badge
                      variant={practice.isActive ? "success" : "secondary"}
                      size="sm"
                    >
                      {practice.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  {practice.description && (
                    <p className="text-sm text-graphite">{practice.description}</p>
                  )}
                  <div className="mt-2">
                    <Badge variant="outline" size="sm">
                      {practice.category.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Section */}
      {products.length > 0 && (
        <section className="bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-ink">Our Products</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(0, 6).map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-900 text-base">{product.name}</h3>
                  <Badge variant="primary" className="px-2 py-1 text-xs">{product.category}</Badge>
                </div>
                <p className="text-gray-600 mb-3 leading-relaxed text-sm line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-primary-600">
                    ${product.price.toFixed(2)}/{product.unit}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {product.quantity} {product.unit}s
                  </span>
                </div>
                <Button
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  disabled={!product.isActive}
                >
                  {product.isActive ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* No Products Message */}
      {products.length === 0 && (
        <Card className="mb-8">
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
      )}

      {/* Customer Reviews Section */}
      {farmer.reviews && farmer.reviews.length > 0 && (
        <section className="bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl mb-8">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
              <Star className="w-6 h-6 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-ink">Customer Reviews</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {farmer.reviews.slice(0, 4).map((review) => (
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
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
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
      {(!farmer.reviews || farmer.reviews.length === 0) && (
        <section className="bg-white rounded-xl p-8 shadow-lg text-center transition-all duration-300 hover:shadow-xl mb-8">
          <div className="text-gray-400 mb-6">
            <Star className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-ink mb-4">No Reviews Yet</h3>
          <p className="text-graphite text-lg max-w-2xl mx-auto leading-relaxed">
            This farmer hasn't received any reviews yet. Be the first to leave a review!
          </p>
        </section>
      )}

      {/* Enhanced Farm Stats */}
      <Card className="bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
        <CardContent className="py-8">
          <h3 className="text-2xl font-bold text-ink mb-6 text-center">
            Farm Statistics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">
                {farmer.yearsFarming || 'N/A'}
              </div>
              <div className="text-graphite">Years Farming</div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {farmer.farmSize && (
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <Building className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <div className="text-lg font-semibold text-ink">{farmer.farmSize} acres</div>
                <div className="text-graphite">Farm Size</div>
              </div>
            )}
            
            {farmer.specialties && farmer.specialties.length > 0 && (
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <Award className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <div className="text-lg font-semibold text-ink">{farmer.specialties.length} specialties</div>
                <div className="text-graphite">Farm Specialties</div>
              </div>
            )}
          </div>

          {/* Specialties List */}
          {farmer.specialties && farmer.specialties.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-ink mb-3 text-center">Farm Specialties</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {farmer.specialties.map((specialty, index) => (
                  <Badge key={index} variant="primary" size="sm">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sticky Sidebar */}
      <div className={`hidden lg:block fixed right-4 top-20 w-72 z-50 transition-all duration-300 ${
        showStickySidebar ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
      }`}>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Farmer Bio Header */}
          <div className="bg-gradient-to-r from-primary-500 to-green-600 p-6 text-white">
            <div className="flex items-center space-x-4">
              {farmer.farmerPhoto ? (
                <img
                  src={farmer.farmerPhoto}
                  alt={farmer.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold">{farmer.name}</h3>
                <p className="text-white/90 text-sm">Farmer & Owner</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-ink">{products.length}</div>
                <div className="text-sm text-graphite">Products</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-ink">{farmer.totalReviews || 0}</div>
                <div className="text-sm text-graphite">Reviews</div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center">
                {renderStarRating(farmer.averageRating)}
                <span className="ml-2 text-graphite text-sm">({farmer.averageRating.toFixed(1)})</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 mr-3 text-primary-500" />
                <span className="text-graphite">{farmer.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-3 text-primary-500" />
                <span className="text-graphite">{farmer.location}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-3 text-primary-500" />
                <span className="text-graphite">Member since {new Date(farmer.createdAt).getFullYear()}</span>
              </div>
            </div>

            {/* Farming Practices */}
            {farmer.farmingPractices && farmer.farmingPractices.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-ink mb-3">Farming Practices</h4>
                <div className="flex flex-wrap gap-2">
                  {farmer.farmingPractices.slice(0, 4).map((practice) => (
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
                  {farmer.farmingPractices.length > 4 && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      +{farmer.farmingPractices.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button 
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              onClick={handleContactFarmer}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
