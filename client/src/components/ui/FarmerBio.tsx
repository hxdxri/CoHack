import React from 'react';
import { Button } from './Button';
import { Edit3, User, Calendar, MapPin, Heart, Award, Users } from 'lucide-react';

interface FarmerBioProps {
  farmerName: string;
  farmerBio?: string;
  farmerInterests?: string[];
  yearsFarming?: number;
  farmSize?: string;
  specialties?: string[];
  location?: string;
  isEditable?: boolean;
  onEdit?: () => void;
}

export const FarmerBio: React.FC<FarmerBioProps> = ({
  farmerName,
  farmerBio,
  farmerInterests = [],
  yearsFarming,
  farmSize,
  specialties = [],
  location,
  isEditable = false,
  onEdit
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          <User className="w-6 h-6 mr-3 text-blue-600" />
          About the Farmer
        </h3>
        {isEditable && (
          <Button
            onClick={onEdit}
            variant="outline"
            className="flex items-center"
            size="sm"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Bio
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Farmer Name and Basic Info */}
        <div>
          <h4 className="text-xl font-semibold text-gray-900 mb-3">{farmerName}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            {yearsFarming && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{yearsFarming} years farming</span>
              </div>
            )}
            {farmSize && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{farmSize} acres</span>
              </div>
            )}
            {location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {farmerBio ? (
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Bio</h5>
            <p className="text-gray-700 leading-relaxed">{farmerBio}</p>
          </div>
        ) : isEditable ? (
          <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
            <User className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm mb-3">No bio added yet</p>
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
            >
              Add Bio
            </Button>
          </div>
        ) : null}

        {/* Specialties */}
        {specialties.length > 0 && (
          <div>
            <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Award className="w-4 h-4 mr-2" />
              Specialties
            </h5>
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {farmerInterests.length > 0 && (
          <div>
            <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Heart className="w-4 h-4 mr-2" />
              Interests & Hobbies
            </h5>
            <div className="flex flex-wrap gap-2">
              {farmerInterests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Empty state for interests */}
        {farmerInterests.length === 0 && isEditable && (
          <div className="text-center py-4 border border-gray-200 rounded-lg">
            <Heart className="w-6 h-6 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm mb-2">No interests added yet</p>
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
            >
              Add Interests
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
