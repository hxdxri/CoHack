import React from 'react';
import { Calendar, Award, TrendingUp, Home, Star, Plus, ChevronRight } from 'lucide-react';
import { FarmTimelineEvent } from '@/types';

interface FarmTimelineProps {
  timeline?: FarmTimelineEvent[];
  isEditable?: boolean;
  onEdit?: () => void;
}

export const FarmTimeline: React.FC<FarmTimelineProps> = ({
  timeline = [],
  isEditable = false,
  onEdit,
}) => {
  const getTimelineIcon = (type: FarmTimelineEvent['type']) => {
    switch (type) {
      case 'founding':
        return <Home className="w-5 h-5" />;
      case 'expansion':
        return <TrendingUp className="w-5 h-5" />;
      case 'achievement':
        return <Award className="w-5 h-5" />;
      case 'milestone':
        return <Star className="w-5 h-5" />;
      case 'award':
        return <Award className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getTimelineColor = (type: FarmTimelineEvent['type']) => {
    switch (type) {
      case 'founding':
        return 'bg-green-500';
      case 'expansion':
        return 'bg-blue-500';
      case 'achievement':
        return 'bg-yellow-500';
      case 'milestone':
        return 'bg-purple-500';
      case 'award':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTimelineLabel = (type: FarmTimelineEvent['type']) => {
    switch (type) {
      case 'founding':
        return 'Founded';
      case 'expansion':
        return 'Expansion';
      case 'achievement':
        return 'Achievement';
      case 'milestone':
        return 'Milestone';
      case 'award':
        return 'Award';
      default:
        return 'Event';
    }
  };

  if (timeline.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Timeline Yet</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          {isEditable 
            ? "Share your farm's journey by adding important milestones and achievements."
            : "This farmer hasn't shared their farm's timeline yet."
          }
        </p>
        {isEditable && onEdit && (
          <button
            onClick={onEdit}
            className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Timeline Events
          </button>
        )}
      </div>
    );
  }

  // Sort timeline by year (newest first)
  const sortedTimeline = [...timeline].sort((a, b) => b.year - a.year);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-bold text-white mb-2">Our Farm's Journey</h3>
          <p className="text-white/70">Milestones that shaped our story</p>
        </div>
        {isEditable && onEdit && (
          <button
            onClick={onEdit}
            className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-colors backdrop-blur-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Edit Timeline
          </button>
        )}
      </div>

      <div className="relative">
        {/* Horizontal line */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        
        <div className="flex overflow-x-auto pb-8 space-x-8 scrollbar-hide">
          {sortedTimeline.map((event, index) => (
            <div key={event.id} className="relative flex-shrink-0 w-80">
              {/* Timeline dot */}
              <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-xl mx-auto mb-6">
                <div className="text-black text-lg font-bold">
                  {event.year.toString().slice(-2)}
                </div>
              </div>
              
              {/* Timeline content */}
              <div className="bg-white text-black rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 min-h-[300px] flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h4 className="text-xl font-bold text-black">{event.title}</h4>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black/10 text-black">
                      {getTimelineLabel(event.type)}
                    </span>
                  </div>
                  <div className="flex items-center text-black/60 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{event.year}</span>
                  </div>
                  <p className="text-black/80 leading-relaxed text-sm font-light">{event.description}</p>
                </div>
                
                {event.imageUrl && (
                  <div className="mt-4 flex-shrink-0">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                {/* Decorative element */}
                <div className="flex items-center text-black/30 mt-4">
                  <ChevronRight className="w-4 h-4" />
                  <div className="w-6 h-0.5 bg-black/20 ml-2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
