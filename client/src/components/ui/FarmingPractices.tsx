import React from 'react';
import { FarmingPractice } from '@/types';
import { Button } from './Button';
import { Badge } from './Badge';
import { Edit3, Leaf, Heart, Recycle, Users, Shield, CheckCircle } from 'lucide-react';

interface FarmingPracticesProps {
  practices: FarmingPractice[];
  isEditable?: boolean;
  onEdit?: () => void;
  onTogglePractice?: (practiceId: string) => void;
}

const practiceCategories = {
  sustainability: { icon: Recycle, color: 'bg-green-100 text-green-800 border-green-200', label: 'Sustainability' },
  organic: { icon: Leaf, color: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Organic' },
  animal_welfare: { icon: Heart, color: 'bg-pink-100 text-pink-800 border-pink-200', label: 'Animal Welfare' },
  environmental: { icon: Shield, color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Environmental' },
  social: { icon: Users, color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Social' }
};

const predefinedPractices: Omit<FarmingPractice, 'id' | 'isActive'>[] = [
  { name: 'Certified Organic', description: 'USDA Organic certified', category: 'organic' },
  { name: 'No Pesticides', description: 'No synthetic pesticides used', category: 'organic' },
  { name: 'Rotational Crops', description: 'Crop rotation for soil health', category: 'sustainability' },
  { name: 'Cover Crops', description: 'Planting cover crops to improve soil', category: 'sustainability' },
  { name: 'Composting', description: 'On-farm composting program', category: 'sustainability' },
  { name: 'Water Conservation', description: 'Efficient irrigation and water management', category: 'environmental' },
  { name: 'Renewable Energy', description: 'Solar panels or wind power', category: 'environmental' },
  { name: 'Fair Labor Practices', description: 'Fair wages and working conditions', category: 'social' },
  { name: 'Local Community Support', description: 'Supporting local community initiatives', category: 'social' },
  { name: 'Pasture-Raised Animals', description: 'Animals have access to pasture', category: 'animal_welfare' },
  { name: 'No Antibiotics', description: 'No routine antibiotic use', category: 'animal_welfare' },
  { name: 'Biodiversity Conservation', description: 'Protecting native species and habitats', category: 'environmental' }
];

export const FarmingPractices: React.FC<FarmingPracticesProps> = ({
  practices,
  isEditable = false,
  onEdit,
  onTogglePractice
}) => {
  const practicesByCategory = practices.reduce((acc, practice) => {
    if (!acc[practice.category]) {
      acc[practice.category] = [];
    }
    acc[practice.category].push(practice);
    return acc;
  }, {} as Record<string, FarmingPractice[]>);

  const activePractices = practices.filter(p => p.isActive);
  const inactivePractices = practices.filter(p => !p.isActive);

  return (
    <div className="bg-white rounded-xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <Leaf className="w-5 h-5 mr-2 text-green-600" />
          Farming Practices
        </h3>
        {isEditable && (
          <Button
            onClick={onEdit}
            variant="outline"
            className="flex items-center"
            size="sm"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Practices
          </Button>
        )}
      </div>

      {activePractices.length > 0 ? (
        <div className="space-y-6">
          {/* Active Practices by Category */}
          {Object.entries(practicesByCategory).map(([category, categoryPractices]) => {
            const activeCategoryPractices = categoryPractices.filter(p => p.isActive);
            if (activeCategoryPractices.length === 0) return null;

            const categoryInfo = practiceCategories[category as keyof typeof practiceCategories];
            const IconComponent = categoryInfo.icon;

            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">{categoryInfo.label}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeCategoryPractices.map((practice) => (
                    <div
                      key={practice.id}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${categoryInfo.color} ${
                        isEditable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
                      }`}
                      onClick={() => isEditable && onTogglePractice?.(practice.id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {practice.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-600 mb-2">No Practices Selected</h4>
          <p className="text-gray-500 mb-4">
            Share your farming practices to help customers understand your values and methods.
          </p>
          {isEditable && (
            <Button
              onClick={onEdit}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Add Practices
            </Button>
          )}
        </div>
      )}

      {/* Inactive Practices (for editing) */}
      {isEditable && inactivePractices.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-600 mb-3">Available Practices</h4>
          <div className="flex flex-wrap gap-2">
            {inactivePractices.map((practice) => {
              const categoryInfo = practiceCategories[practice.category as keyof typeof practiceCategories];
              return (
                <div
                  key={practice.id}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onTogglePractice?.(practice.id)}
                >
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  {practice.name}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
