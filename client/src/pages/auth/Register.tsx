import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Leaf, User, Mail, Lock, MapPin, Building } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { RegisterRequest } from '@/types';

/**
 * Register Page
 * 
 * User registration page with role selection and conditional fields.
 * Shows additional fields for farmers (farm name, description, location).
 */
export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterRequest>();

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterRequest) => {
    try {
      setError('');
      await registerUser(data);
      
      // Navigation will be handled by the auth store and route protection
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const roleOptions = [
    { value: '', label: 'Select your role' },
    { value: 'customer', label: 'Customer - I want to buy fresh produce' },
    { value: 'farmer', label: 'Farmer - I want to sell my produce' },
  ];

  return (
    <div className="min-h-screen bg-gradient-mist flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient-primary">
              HarvestLink
            </span>
          </Link>
          
          <h2 className="text-3xl font-bold text-ink">
            Join HarvestLink
          </h2>
          <p className="mt-2 text-graphite">
            Connect farmers and customers directly
          </p>
        </div>

        {/* Registration Form */}
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-ink">Basic Information</h3>
                
                <Input
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                  type="text"
                  label="Full Name"
                  placeholder="Enter your full name"
                  error={errors.name?.message}
                  required
                />

                <Input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  error={errors.email?.message}
                  required
                />

                <Input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type="password"
                  label="Password"
                  placeholder="Create a password"
                  error={errors.password?.message}
                  helperText="Minimum 6 characters"
                  required
                />

                <Select
                  {...register('role', {
                    required: 'Please select your role',
                  })}
                  label="I am a..."
                  options={roleOptions}
                  error={errors.role?.message}
                  required
                />
              </div>

              {/* Farmer-specific fields */}
              {selectedRole === 'farmer' && (
                <div className="space-y-4 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-ink flex items-center space-x-2">
                    <Building className="w-5 h-5" />
                    <span>Farm Information</span>
                  </h3>
                  
                  <Input
                    {...register('farmName', {
                      required: selectedRole === 'farmer' ? 'Farm name is required' : false,
                    })}
                    type="text"
                    label="Farm Name"
                    placeholder="Enter your farm name"
                    error={errors.farmName?.message}
                    required={selectedRole === 'farmer'}
                  />

                  <Input
                    {...register('location', {
                      required: selectedRole === 'farmer' ? 'Location is required' : false,
                    })}
                    type="text"
                    label="Farm Location"
                    placeholder="City, State"
                    error={errors.location?.message}
                    helperText="This will be shown to customers"
                    required={selectedRole === 'farmer'}
                  />

                  <Textarea
                    {...register('farmDescription', {
                      required: selectedRole === 'farmer' ? 'Farm description is required' : false,
                      minLength: {
                        value: 20,
                        message: 'Description must be at least 20 characters',
                      },
                    })}
                    label="Farm Description"
                    placeholder="Tell customers about your farm, farming practices, and what makes your produce special..."
                    rows={4}
                    error={errors.farmDescription?.message}
                    helperText="Describe your farming practices and what makes your produce special"
                    required={selectedRole === 'farmer'}
                  />
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Create Account
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-graphite">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-500 hover:text-primary-600 transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-graphite hover:text-primary-500 transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
