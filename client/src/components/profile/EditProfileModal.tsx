import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { X, User, Mail, MapPin, Building, FileText, Save } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { farmersAPI, authAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { User as UserType, FarmerProfile } from '@/types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  farmerProfile?: FarmerProfile;
  onProfileUpdated: (updatedUser: UserType, updatedFarmerProfile?: FarmerProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  farmerProfile,
  onProfileUpdated,
}) => {
  const { updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    // Farmer-specific fields
    farmName: farmerProfile?.farmName || '',
    location: farmerProfile?.location || '',
    description: farmerProfile?.description || '',
    farmHistory: farmerProfile?.farmHistory || '',
  });

  const isFarmer = user.role === 'farmer';

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        farmName: farmerProfile?.farmName || '',
        location: farmerProfile?.location || '',
        description: farmerProfile?.description || '',
        farmHistory: farmerProfile?.farmHistory || '',
      });
    }
  }, [isOpen, user, farmerProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update basic user info
      const userUpdateData = {
        name: formData.name,
        email: formData.email,
      };

      const userResponse = await authAPI.updateUser(userUpdateData);
      const updatedUser = userResponse.data.user;

      let updatedFarmerProfile = farmerProfile;

      // Update farmer profile if applicable
      if (isFarmer) {
        const farmerUpdateData = {
          farmName: formData.farmName,
          location: formData.location,
          description: formData.description,
          farmHistory: formData.farmHistory,
        };

        const farmerResponse = await farmersAPI.updateMyProfile(farmerUpdateData);
        updatedFarmerProfile = farmerResponse.data;
      }

      // Update local state
      updateUser(updatedUser);
      onProfileUpdated(updatedUser, updatedFarmerProfile);

      toast.success('Profile updated successfully!');
      onClose();
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>

          {/* Farmer-specific fields */}
          {isFarmer && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Farm Information
              </h3>
              
              <div>
                <label htmlFor="farmName" className="block text-sm font-medium text-gray-700 mb-1">
                  Farm Name
                </label>
                <Input
                  id="farmName"
                  name="farmName"
                  type="text"
                  value={formData.farmName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your farm name"
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your farm location"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Farm Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Tell us about your farm..."
                />
              </div>
              
              <div>
                <label htmlFor="farmHistory" className="block text-sm font-medium text-gray-700 mb-1">
                  Farm History (Optional)
                </label>
                <textarea
                  id="farmHistory"
                  name="farmHistory"
                  value={formData.farmHistory}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Share your farm's story..."
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex items-center"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
