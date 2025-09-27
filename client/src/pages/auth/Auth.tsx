import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Leaf, Building } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { LoginRequest, RegisterRequest } from '@/types';

/**
 * Combined Authentication Page
 * 
 * Shows login form first with option to switch to registration.
 * Users can toggle between login and register modes.
 */
export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login, register: registerUser, isLoading } = useAuthStore();
  const [error, setError] = useState<string>('');
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Login form
  const loginForm = useForm<LoginRequest>();
  
  // Register form
  const registerForm = useForm<RegisterRequest>();
  const selectedRole = registerForm.watch('role');

  const handleLogin = async (data: LoginRequest) => {
    try {
      setError('');
      await login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleRegister = async (data: RegisterRequest) => {
    try {
      setError('');
      await registerUser(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const switchToRegister = () => {
    setIsLoginMode(false);
    setError('');
    loginForm.reset();
  };

  const switchToLogin = () => {
    setIsLoginMode(true);
    setError('');
    registerForm.reset();
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
            {isLoginMode ? 'Welcome back' : 'Join HarvestLink'}
          </h2>
          <p className="mt-2 text-graphite">
            {isLoginMode 
              ? 'Sign in to your account to continue'
              : 'Connect farmers and customers directly'
            }
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={switchToLogin}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
              isLoginMode
                ? 'bg-white text-ink shadow-sm'
                : 'text-graphite hover:text-ink'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={switchToRegister}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
              !isLoginMode
                ? 'bg-white text-ink shadow-sm'
                : 'text-graphite hover:text-ink'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {isLoginMode && (
          <Card>
            <CardContent>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div>
                  <Input
                    {...loginForm.register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    error={loginForm.formState.errors.email?.message}
                    required
                  />
                </div>

                <div>
                  <Input
                    {...loginForm.register('password', {
                      required: 'Password is required',
                    })}
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    error={loginForm.formState.errors.password?.message}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Sign In
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-wheat bg-opacity-30 rounded-md">
                <h4 className="text-sm font-medium text-ink mb-2">Demo Credentials:</h4>
                <div className="text-xs text-graphite space-y-1">
                  <p><strong>Farmer:</strong> farmer@harvestlink.com / password123</p>
                  <p><strong>Customer:</strong> customer@harvestlink.com / password123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Registration Form */}
        {!isLoginMode && (
          <Card>
            <CardContent>
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-ink">Basic Information</h3>
                  
                  <Input
                    {...registerForm.register('name', {
                      required: 'Full name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                    })}
                    type="text"
                    label="Full Name"
                    placeholder="Enter your full name"
                    error={registerForm.formState.errors.name?.message}
                    required
                  />

                  <Input
                    {...registerForm.register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    error={registerForm.formState.errors.email?.message}
                    required
                  />

                  <Input
                    {...registerForm.register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    type="password"
                    label="Password"
                    placeholder="Create a password"
                    error={registerForm.formState.errors.password?.message}
                    helperText="Minimum 6 characters"
                    required
                  />

                  <Select
                    {...registerForm.register('role', {
                      required: 'Please select your role',
                    })}
                    label="I am a..."
                    options={roleOptions}
                    error={registerForm.formState.errors.role?.message}
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
                      {...registerForm.register('farmName', {
                        required: selectedRole === 'farmer' ? 'Farm name is required' : false,
                      })}
                      type="text"
                      label="Farm Name"
                      placeholder="Enter your farm name"
                      error={registerForm.formState.errors.farmName?.message}
                      required={selectedRole === 'farmer'}
                    />

                    <Input
                      {...registerForm.register('location', {
                        required: selectedRole === 'farmer' ? 'Location is required' : false,
                      })}
                      type="text"
                      label="Farm Location"
                      placeholder="City, State"
                      error={registerForm.formState.errors.location?.message}
                      helperText="This will be shown to customers"
                      required={selectedRole === 'farmer'}
                    />

                    <Textarea
                      {...registerForm.register('farmDescription', {
                        required: selectedRole === 'farmer' ? 'Farm description is required' : false,
                        minLength: {
                          value: 20,
                          message: 'Description must be at least 20 characters',
                        },
                      })}
                      label="Farm Description"
                      placeholder="Tell customers about your farm, farming practices, and what makes your produce special..."
                      rows={4}
                      error={registerForm.formState.errors.farmDescription?.message}
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
            </CardContent>
          </Card>
        )}

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
