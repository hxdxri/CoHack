import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from './Button';
import { Input } from './Input';
import { Card, CardContent, CardHeader } from './Card';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  User,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock Stripe publishable key for development
const stripePromise = loadStripe('pk_test_mock_key_for_development');

interface PaymentFormProps {
  totalAmount: number;
  farmerName: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

const PaymentFormComponent: React.FC<PaymentFormProps> = ({
  totalAmount,
  farmerName,
  onPaymentSuccess,
  onPaymentError
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: ''
  });
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};
    
    if (!customerInfo.name.trim()) newErrors.name = 'Name is required';
    if (!customerInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) newErrors.email = 'Invalid email format';
    if (!customerInfo.phone.trim()) newErrors.phone = 'Phone is required';
    if (!customerInfo.address.trim()) newErrors.address = 'Address is required';
    if (!customerInfo.city.trim()) newErrors.city = 'City is required';
    if (!customerInfo.province.trim()) newErrors.province = 'Province is required';
    if (!customerInfo.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    else if (!/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(customerInfo.postalCode)) {
      newErrors.postalCode = 'Invalid Canadian postal code format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    try {
      // Mock payment processing - in real app, this would call your backend
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful payment
      const mockPaymentResult = {
        id: `pi_mock_${Date.now()}`,
        status: 'succeeded',
        amount: totalAmount * 100, // Convert to cents
        customer: customerInfo,
        farmerName,
        timestamp: new Date().toISOString()
      };

      onPaymentSuccess(mockPaymentResult);
      toast.success('Payment successful!');
      
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError(error instanceof Error ? error.message : 'Payment failed');
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Customer Information
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Full Name *
              </label>
              <Input
                type="text"
                value={customerInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Email Address *
              </label>
              <Input
                type="email"
                value={customerInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Phone Number *
            </label>
            <Input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter your phone number"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Street Address *
            </label>
            <Input
              type="text"
              value={customerInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter your street address"
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.address}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                City *
              </label>
              <Input
                type="text"
                value={customerInfo.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="City"
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.city}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Province *
              </label>
              <select
                value={customerInfo.province}
                onChange={(e) => handleInputChange('province', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.province ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Province</option>
                <option value="AB">Alberta</option>
                <option value="BC">British Columbia</option>
                <option value="MB">Manitoba</option>
                <option value="NB">New Brunswick</option>
                <option value="NL">Newfoundland and Labrador</option>
                <option value="NS">Nova Scotia</option>
                <option value="ON">Ontario</option>
                <option value="PE">Prince Edward Island</option>
                <option value="QC">Quebec</option>
                <option value="SK">Saskatchewan</option>
                <option value="NT">Northwest Territories</option>
                <option value="NU">Nunavut</option>
                <option value="YT">Yukon</option>
              </select>
              {errors.province && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.province}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Postal Code *
              </label>
              <Input
                type="text"
                value={customerInfo.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value.toUpperCase())}
                placeholder="A1A 1A1"
                className={errors.postalCode ? 'border-red-500' : ''}
              />
              {errors.postalCode && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.postalCode}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            Payment Information
          </h3>
        </CardHeader>
        <CardContent>
          <div className="p-4 border border-gray-300 rounded-lg bg-white">
            <label className="block text-sm font-medium text-ink mb-2">
              Card Details
            </label>
            <CardElement options={cardElementOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing Payment...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Pay ${totalAmount.toFixed(2)}
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};

export const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormComponent {...props} />
    </Elements>
  );
};
