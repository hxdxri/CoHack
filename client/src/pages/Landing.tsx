import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Users, ShoppingCart, MessageCircle, Star, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

/**
 * Landing Page
 * 
 * Main landing page with hero section, features, and call-to-action.
 * Provides options for both farmers and customers to get started.
 */
export const Landing: React.FC = () => {
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
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                <Leaf className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Fresh from Farm to Table
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Connect directly with local farmers and enjoy the freshest produce while supporting your community
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Get Started Today
                </Button>
              </Link>
              
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-500"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="py-16 bg-mist">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              Choose Your Path
            </h2>
            <p className="text-xl text-graphite">
              Whether you're growing or buying, HarvestLink connects you to fresh, local produce
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Farmer Card */}
            <Card hover className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Leaf className="w-8 h-8 text-primary-500" />
                </div>
                
                <h3 className="text-2xl font-bold text-ink mb-4">I'm a Farmer</h3>
                <p className="text-graphite mb-6">
                  Sell your fresh produce directly to customers, set your own prices, and build lasting relationships with your community.
                </p>
                
                <ul className="text-left space-y-2 mb-8 text-graphite">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>Create product listings</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>Manage your farm profile</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>Chat with customers</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>Build your reputation</span>
                  </li>
                </ul>

                <Link to="/register" className="block">
                  <Button variant="primary" size="lg" className="w-full">
                    Start Selling
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Customer Card */}
            <Card hover className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-8 h-8 text-accent-500" />
                </div>
                
                <h3 className="text-2xl font-bold text-ink mb-4">I'm a Customer</h3>
                <p className="text-graphite mb-6">
                  Discover fresh, local produce from trusted farmers in your area. Support your community while enjoying the best quality food.
                </p>
                
                <ul className="text-left space-y-2 mb-8 text-graphite">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <span>Browse local farms</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <span>View product details</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <span>Chat with farmers</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <span>Leave reviews</span>
                  </li>
                </ul>

                <Link to="/register" className="block">
                  <Button variant="success" size="lg" className="w-full">
                    Start Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-bone">
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
      <section className="py-16 bg-mist">
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
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Create Account
              </Button>
            </Link>
            <Link to="/login">
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
    </div>
  );
};
