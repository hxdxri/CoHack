import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MessageCircle, ShoppingCart, MapPin } from 'lucide-react';
import { productsAPI, reviewsAPI } from '@/lib/api';
import { Product, ReviewWithCustomer } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { useMessagesStore } from '@/store/messages';
import toast from 'react-hot-toast';

export const Listing: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sendMessage, loadConversations } = useMessagesStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ReviewWithCustomer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError('');
        const res = await productsAPI.getById(id);
        setProduct(res.data);

        // Fetch reviews for this product's farmer
        const farmerId = res.data.farmerId;
        if (farmerId) {
          const rev = await reviewsAPI.getByFarmerId(farmerId);
          setReviews(rev.data);
        }
        
        // Load conversations for contact functionality
        loadConversations();
      } catch (e: any) {
        setError(e?.response?.data?.error || 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleContact = async () => {
    if (!product?.farmerId) return;
    
    try {
      const { conversations, setActiveConversation, loadMessages } = useMessagesStore.getState();
      
      // Check if conversation already exists with this farmer
      const existingConversation = conversations.find(conv => conv.partnerId === product.farmerId);
      
      if (existingConversation) {
        // Conversation exists, navigate to messages and set it as active
        setActiveConversation(product.farmerId);
        await loadMessages(product.farmerId);
        toast.success(`Opening conversation with ${product.farmerName || 'farmer'}`);
        navigate('/customer/messages');
      } else {
        // No conversation exists, create a new one
        await sendMessage(product.farmerId, {
          content: `Hi! I'm interested in your ${product.name}. Could you tell me more about it?`
        });
        
        // Reload conversations to include the new one
        await loadConversations();
        
        // Set the new conversation as active and load its messages
        setActiveConversation(product.farmerId);
        await loadMessages(product.farmerId);
        
        toast.success(`Started new conversation with ${product.farmerName || 'farmer'}`);
        navigate('/customer/messages');
      }
    } catch (error) {
      console.error('Error handling farmer contact:', error);
      toast.error('Failed to contact farmer');
    }
  };

  const handleAddToCart = () => {
    toast.success('Added to cart! (Cart coming soon)');
  };

  if (loading) {
    return <LoadingPage message="Loading listing..." />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-semibold text-ink mb-2">Listing not available</h1>
            <p className="text-graphite mb-6">{error || 'We could not find this listing.'}</p>
            <Button variant="primary" onClick={() => navigate(-1)}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  return (
    <div className="page-content">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visual */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-80 object-cover rounded-card"
                />
              ) : (
                <div className="h-80 bg-gradient-to-br from-primary-50 to-accent-50 rounded-card flex items-center justify-center text-6xl">
                  {getCategoryIcon(product.category)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div>
                  <h1 className="text-3xl font-bold text-ink mb-2">{product.name}</h1>
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" size="sm">
                      {getCategoryIcon(product.category)} {product.category}
                    </Badge>
                    {product.farmer && product.farmer.averageRating > 0 && (
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm text-yellow-700 font-medium">
                          {product.farmer.averageRating.toFixed(1)} ({product.farmer.totalReviews})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-semibold text-ink">
                    ${product.price.toFixed(2)}
                    <span className="text-base text-graphite font-normal">/{product.unit}</span>
                  </div>
                  <div className="text-sm text-graphite">{product.quantity} {product.unit}{product.quantity !== 1 ? 's' : ''} available</div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-ink mb-2">Description</h2>
                <p className="text-graphite leading-relaxed">{product.description}</p>
              </div>

              {product.farmer && (
                <div className="mt-8 p-4 bg-mist rounded-lg">
                  <h3 className="text-md font-semibold text-ink mb-2">Farmer</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-ink font-medium">{product.farmerName || 'Farmer'}</p>
                      <div className="flex items-center text-sm text-graphite">
                        <MapPin className="w-4 h-4 mr-1" />
                        {product.farmer.farmName} • {product.farmer.location}
                      </div>
                    </div>
                    {product.farmer.averageRating > 0 && (
                      <div className="text-sm text-graphite">
                        <span className="font-medium text-ink">{product.farmer.averageRating.toFixed(1)}</span> avg • {product.farmer.totalReviews} reviews
                      </div>
                    )}
                  </div>
                  {product.farmer.description && (
                    <p className="mt-3 text-sm text-graphite">{product.farmer.description}</p>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex gap-3">
              <Button variant="outline" onClick={handleContact}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact
              </Button>
              <Button variant="primary" onClick={handleAddToCart}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-ink mb-4">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-graphite">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="p-4 border border-gray-100 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-ink text-sm">{review.customerName}</div>
                      <div className="flex items-center">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-graphite">{review.comment}</p>
                    )}
                    <div className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


