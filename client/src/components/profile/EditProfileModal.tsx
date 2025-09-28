import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { X, User, Building, Save, Camera, Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { farmersAPI, authAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { User as UserType, FarmerProfile, FarmPhoto, WorkPhoto, FarmTimelineEvent } from '@/types';

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
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    // Farmer-specific fields
    farmName: farmerProfile?.farmName || '',
    location: farmerProfile?.location || '',
    description: farmerProfile?.description || '',
    farmHistory: farmerProfile?.farmHistory || '',
    ourStory: farmerProfile?.ourStory || '',
    aboutOurFarm: farmerProfile?.aboutOurFarm || '',
    farmerPhoto: farmerProfile?.farmerPhoto || '',
    farmPhotos: farmerProfile?.farmPhotos || [],
    workPhotos: farmerProfile?.workPhotos || [],
    timeline: farmerProfile?.timeline || [],
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
        ourStory: farmerProfile?.ourStory || '',
        aboutOurFarm: farmerProfile?.aboutOurFarm || '',
        farmerPhoto: farmerProfile?.farmerPhoto || '',
        farmPhotos: farmerProfile?.farmPhotos || [],
        workPhotos: farmerProfile?.workPhotos || [],
        timeline: farmerProfile?.timeline || [],
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

  const handlePhotoUpload = (type: 'farmer' | 'farm' | 'work', file: File) => {
    // In a real app, you'd upload to a cloud service
    // For now, we'll create a local URL
    const url = URL.createObjectURL(file);
    
    if (type === 'farmer') {
      setFormData(prev => ({ ...prev, farmerPhoto: url }));
    } else if (type === 'farm') {
      const newPhoto: FarmPhoto = {
        id: Date.now().toString(),
        url,
        type: 'farm',
        caption: '',
        createdAt: new Date().toISOString(),
      };
      setFormData(prev => ({ ...prev, farmPhotos: [...prev.farmPhotos, newPhoto] }));
    } else if (type === 'work') {
      const newPhoto: WorkPhoto = {
        id: Date.now().toString(),
        url,
        type: 'harvesting',
        caption: '',
        createdAt: new Date().toISOString(),
      };
      setFormData(prev => ({ ...prev, workPhotos: [...prev.workPhotos, newPhoto] }));
    }
  };

  const removePhoto = (type: 'farmer' | 'farm' | 'work', photoId?: string) => {
    if (type === 'farmer') {
      setFormData(prev => ({ ...prev, farmerPhoto: '' }));
    } else if (type === 'farm' && photoId) {
      setFormData(prev => ({ 
        ...prev, 
        farmPhotos: prev.farmPhotos.filter(photo => photo.id !== photoId) 
      }));
    } else if (type === 'work' && photoId) {
      setFormData(prev => ({ 
        ...prev, 
        workPhotos: prev.workPhotos.filter(photo => photo.id !== photoId) 
      }));
    }
  };

  const addTimelineEvent = () => {
    const newEvent: FarmTimelineEvent = {
      id: Date.now().toString(),
      year: new Date().getFullYear(),
      title: '',
      description: '',
      type: 'milestone',
    };
    setFormData(prev => ({ ...prev, timeline: [...prev.timeline, newEvent] }));
  };

  const updateTimelineEvent = (eventId: string, updates: Partial<FarmTimelineEvent>) => {
    setFormData(prev => ({
      ...prev,
      timeline: prev.timeline.map(event => 
        event.id === eventId ? { ...event, ...updates } : event
      )
    }));
  };

  const removeTimelineEvent = (eventId: string) => {
    setFormData(prev => ({
      ...prev,
      timeline: prev.timeline.filter(event => event.id !== eventId)
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
          ourStory: formData.ourStory,
          aboutOurFarm: formData.aboutOurFarm,
          farmerPhoto: formData.farmerPhoto,
          farmPhotos: formData.farmPhotos,
          workPhotos: formData.workPhotos,
          timeline: formData.timeline,
        };

        const farmerResponse = await farmersAPI.updateMyProfile(farmerUpdateData);
        updatedFarmerProfile = farmerResponse.data;
      }

      // Update local state
      setUser(updatedUser);
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

              {/* Our Story Section */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Our Story</h4>
                <div>
                  <label htmlFor="ourStory" className="block text-sm font-medium text-gray-700 mb-1">
                    Tell your personal story
                  </label>
                  <textarea
                    id="ourStory"
                    name="ourStory"
                    value={formData.ourStory}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Share your personal journey as a farmer..."
                  />
                </div>
              </div>

              {/* About Our Farm Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">About Our Farm</h4>
                <div>
                  <label htmlFor="aboutOurFarm" className="block text-sm font-medium text-gray-700 mb-1">
                    Describe your farm in detail
                  </label>
                  <textarea
                    id="aboutOurFarm"
                    name="aboutOurFarm"
                    value={formData.aboutOurFarm}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Describe your farm, practices, and what makes it special..."
                  />
                </div>
              </div>

              {/* Farmer Photo Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Farmer Photo</h4>
                <div className="space-y-4">
                  {formData.farmerPhoto ? (
                    <div className="relative inline-block">
                      <img
                        src={formData.farmerPhoto}
                        alt="Farmer"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto('farmer')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">No farmer photo uploaded</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload('farmer', file);
                        }}
                        className="hidden"
                        id="farmer-photo-upload"
                      />
                      <label
                        htmlFor="farmer-photo-upload"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Upload Photo
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Farm Photos Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Farm Photos</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.farmPhotos.map((photo) => (
                    <div key={photo.id} className="relative">
                      <img
                        src={photo.url}
                        alt="Farm photo"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto('farm', photo.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center flex items-center justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePhotoUpload('farm', file);
                      }}
                      className="hidden"
                      id="farm-photo-upload"
                    />
                    <label
                      htmlFor="farm-photo-upload"
                      className="cursor-pointer"
                    >
                      <Plus className="w-6 h-6 text-gray-400" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Work Photos Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Work Photos</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.workPhotos.map((photo) => (
                    <div key={photo.id} className="relative">
                      <img
                        src={photo.url}
                        alt="Work photo"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto('work', photo.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center flex items-center justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePhotoUpload('work', file);
                      }}
                      className="hidden"
                      id="work-photo-upload"
                    />
                    <label
                      htmlFor="work-photo-upload"
                      className="cursor-pointer"
                    >
                      <Plus className="w-6 h-6 text-gray-400" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Timeline Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Farm Timeline</h4>
                  <button
                    type="button"
                    onClick={addTimelineEvent}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.timeline.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Year
                          </label>
                          <input
                            type="number"
                            value={event.year}
                            onChange={(e) => updateTimelineEvent(event.id, { year: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select
                            value={event.type}
                            onChange={(e) => updateTimelineEvent(event.id, { type: e.target.value as FarmTimelineEvent['type'] })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="founding">Founded</option>
                            <option value="expansion">Expansion</option>
                            <option value="achievement">Achievement</option>
                            <option value="milestone">Milestone</option>
                            <option value="award">Award</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={event.title}
                          onChange={(e) => updateTimelineEvent(event.id, { title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Event title"
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={event.description}
                          onChange={(e) => updateTimelineEvent(event.id, { description: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Event description"
                        />
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeTimelineEvent(event.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
