import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Users, ShoppingCart, MessageCircle, Star, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Slideshow } from '@/components/ui/Slideshow';
import { FarmMap } from '@/components/ui/FarmMap';
import { ScrollNavbar } from '@/components/layout/ScrollNavbar';
import { Footer } from '@/components/layout/Footer';

/**
 * Landing Page
 * 
 * New homepage with automatic slideshow, farm map, scroll-triggered navigation, and footer.
 */
export const Landing: React.FC = () => {
  // Sample slideshow data
  const slideshowData = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Fresh from Farm to Table',
      subtitle: 'Connect with Local Farmers',
      description: 'Discover the freshest produce from trusted farmers in your community. Support local agriculture while enjoying the best quality food.',
      primaryButton: {
        text: 'Start Shopping',
        link: '/auth?role=customer',
        variant: 'primary' as const,
      },
      secondaryButton: {
        text: 'Learn More',
        link: '/about',
        variant: 'outline' as const,
      },
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Sell Your Harvest',
      subtitle: 'Direct to Customers',
      description: 'Join our platform and sell your fresh produce directly to customers. Set your own prices and build lasting relationships with your community.',
      primaryButton: {
        text: 'Start Selling',
        link: '/auth?role=farmer',
        variant: 'success' as const,
      },
      secondaryButton: {
        text: 'View Success Stories',
        link: '/success-stories',
        variant: 'outline' as const,
      },
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Sustainable Future',
      subtitle: 'Building Better Food Systems',
      description: 'Together, we\'re creating a more sustainable and equitable food system that benefits farmers, customers, and the environment.',
      primaryButton: {
        text: 'Join Our Mission',
        link: '/auth',
        variant: 'secondary' as const,
      },
      secondaryButton: {
        text: 'Our Impact',
        link: '/impact',
        variant: 'outline' as const,
      },
    },
  ];

  // Sample farm data for the map
  const sampleFarms = [
    {
      id: '1',
      name: 'Green Valley Organic Farm',
      location: 'Green Valley, CA',
      coordinates: { lat: 37.7749, lng: -122.4194 },
      rating: 4.8,
      productCount: 24,
      specialties: ['vegetables', 'fruits', 'herbs'],
    },
    {
      id: '2',
      name: 'Sunrise Dairy Farm',
      location: 'Sunrise Valley, CA',
      coordinates: { lat: 37.7849, lng: -122.4094 },
      rating: 4.6,
      productCount: 12,
      specialties: ['dairy', 'eggs', 'cheese'],
    },
    {
      id: '3',
      name: 'Mountain View Produce',
      location: 'Mountain View, CA',
      coordinates: { lat: 37.7649, lng: -122.4294 },
      rating: 4.9,
      productCount: 18,
      specialties: ['fruits', 'vegetables', 'grains'],
    },
    {
      id: '4',
      name: 'Riverside Farm',
      location: 'Riverside, CA',
      coordinates: { lat: 37.7549, lng: -122.4394 },
      rating: 4.7,
      productCount: 15,
      specialties: ['vegetables', 'herbs', 'flowers'],
    },
    {
      id: '5',
      name: 'Golden Gate Ranch',
      location: 'Golden Gate, CA',
      coordinates: { lat: 37.7949, lng: -122.3994 },
      rating: 4.5,
      productCount: 8,
      specialties: ['meat', 'dairy', 'eggs'],
    },
  ];

  const features = [
    {
      icon: Users,
      title: 'Direct Connection',
      description: 'Connect farmers and customers without middlemen, ensuring fair prices and fresh produce.',
    },
    {
      icon: ShoppingCart,
      title: 'Easy Shopping',
      description: 'Browse local farms, view product details, and purchase directly from producers.',
    },
    {
      icon: MessageCircle,
      title: 'Direct Communication',
      description: 'Chat directly with farmers to ask questions, place custom orders, or arrange pickup.',
    },
    {
      icon: Star,
      title: 'Quality Assurance',
      description: 'Read reviews and ratings from other customers to make informed purchasing decisions.',
    },
    {
      icon: Shield,
      title: 'Trusted Platform',
      description: 'Secure platform with verified farmers and transparent business practices.',
    },
    {
      icon: Truck,
      title: 'Local Focus',
      description: 'Support your local farming community and reduce environmental impact.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Organic Farmer',
      content: 'HarvestLink has transformed how I sell my produce. I can connect directly with customers who appreciate quality organic vegetables.',
      rating: 5,
    },
    {
      name: 'Mike Chen',
      role: 'Customer',
      content: 'The freshness and quality of produce I get through HarvestLink is amazing. Plus, I love supporting local farmers directly.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Scroll-triggered Navigation */}
      <ScrollNavbar />

      {/* Automatic Slideshow */}
      <Slideshow 
        slides={slideshowData}
        autoPlay={true}
        autoPlayInterval={6000}
        showControls={true}
        showIndicators={true}
      />

      {/* Farm Map Section */}
      <section className="py-16 bg-bone">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              Discover Local Farms
            </h2>
            <p className="text-xl text-graphite">
              Find fresh produce from farms in your area
            </p>
          </div>
          
          <FarmMap 
            farms={sampleFarms}
            onFarmSelect={(farm) => console.log('Selected farm:', farm)}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-mist">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              Why Choose HarvestLink?
            </h2>
            <p className="text-xl text-graphite">
              We're building a better food system that benefits everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-ink mb-2">{feature.title}</h3>
                <p className="text-graphite">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-bone">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              What Our Community Says
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-graphite mb-4 italic">"{testimonial.content}"</p>
                  
                  <div>
                    <p className="font-semibold text-ink">{testimonial.name}</p>
                    <p className="text-sm text-graphite">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands of farmers and customers already using HarvestLink
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button variant="secondary" size="lg">
                Create Account
              </Button>
            </Link>
            <Link to="/auth">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary-500"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
