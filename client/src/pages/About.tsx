import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Users, Heart, Target, Eye, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Footer } from '@/components/layout/Footer';

/**
 * About Page
 * 
 * Information about HarvestLink's mission, vision, and motivation.
 */
export const About: React.FC = () => {
  const values = [
    {
      icon: Users,
      title: 'Community First',
      description: 'We believe in building strong connections between farmers and consumers, fostering a sense of community and mutual support.',
    },
    {
      icon: Heart,
      title: 'Sustainability',
      description: 'Our platform promotes sustainable farming practices and reduces the environmental impact of food distribution.',
    },
    {
      icon: Target,
      title: 'Fair Trade',
      description: 'We ensure fair prices for farmers while providing consumers with transparent, affordable access to fresh produce.',
    },
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Founder & CEO',
      description: 'Former agricultural economist with 15 years of experience in sustainable farming initiatives.',
    },
    {
      name: 'Mike Rodriguez',
      role: 'CTO',
      description: 'Tech entrepreneur passionate about using technology to solve real-world problems in agriculture.',
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Head of Sustainability',
      description: 'Environmental scientist and advocate for sustainable farming practices across North America.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-green-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-ink mb-6">
              About HarvestLink
            </h1>
            <p className="text-xl text-graphite mb-8 leading-relaxed">
              We're on a mission to revolutionize the way people connect with their food sources, 
              creating a more sustainable and equitable food system for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="primary" size="lg">
                  Explore Our Platform
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg">
                  Join Our Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-2xl font-bold text-ink mb-4">Our Mission</h3>
                <p className="text-graphite leading-relaxed">
                  To connect farmers directly with consumers, eliminating middlemen and creating 
                  a transparent, fair marketplace where everyone benefits from fresh, local produce.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-2xl font-bold text-ink mb-4">Our Vision</h3>
                <p className="text-graphite leading-relaxed">
                  A world where every community has access to fresh, sustainable food while 
                  supporting local farmers and reducing environmental impact.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-2xl font-bold text-ink mb-4">Our Motivation</h3>
                <p className="text-graphite leading-relaxed">
                  We believe that food should be a source of connection, not just sustenance. 
                  Our platform empowers communities to build stronger, more sustainable food systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-bone">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-graphite">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-ink mb-3">{value.title}</h3>
                  <p className="text-graphite">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
                Our Story
              </h2>
            </div>
            
            <div className="prose prose-lg max-w-none text-graphite">
              <p className="text-lg leading-relaxed mb-6">
                HarvestLink was born from a simple observation: the disconnect between farmers and consumers 
                was growing, while food waste and environmental concerns were mounting. Our founders, having 
                worked in both agriculture and technology, saw an opportunity to bridge this gap.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                Starting in Saskatchewan, we've built a platform that empowers local farmers to reach customers 
                directly, while giving consumers access to the freshest, most sustainable produce available. 
                We've seen firsthand how this direct connection benefits everyone involved.
              </p>
              
              <p className="text-lg leading-relaxed">
                Today, we're proud to support hundreds of farmers and thousands of customers across the province, 
                and we're just getting started. Our vision extends beyond Saskatchewan to create a nationwide 
                network of sustainable, community-driven food systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-bone">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-graphite">
              The passionate people behind HarvestLink
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-ink mb-2">{member.name}</h3>
                  <p className="text-primary-500 font-medium mb-3">{member.role}</p>
                  <p className="text-graphite text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-green-100">
              Making a difference in communities across Saskatchewan
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-green-100">Active Farmers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-green-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-green-100">Products Sold</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-green-100">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
            Ready to Join Our Mission?
          </h2>
          <p className="text-xl text-graphite mb-8 max-w-2xl mx-auto">
            Whether you're a farmer looking to reach more customers or a consumer wanting 
            fresh, local produce, we'd love to have you as part of our community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?role=customer">
              <Button variant="primary" size="lg">
                Start Shopping
              </Button>
            </Link>
            <Link to="/auth?role=farmer">
              <Button variant="outline" size="lg">
                Start Selling
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

