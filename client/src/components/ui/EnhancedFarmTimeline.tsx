import React from 'react';
import { FarmTimelineEvent } from '@/types';
import { Button } from './Button';
import { Plus, Edit3, Trash2, Calendar, Award, TreePine, Tractor, Leaf, Users, Zap } from 'lucide-react';

interface EnhancedFarmTimelineProps {
  timeline: FarmTimelineEvent[];
  isEditable?: boolean;
  onEdit?: () => void;
  onAddEvent?: () => void;
  onEditEvent?: (event: FarmTimelineEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
}

const getTimelineIcon = (type: FarmTimelineEvent['type']) => {
  const iconMap = {
    founding: '🌱',
    expansion: '🚜',
    achievement: '🏆',
    milestone: '⭐',
    award: '🏅',
    certification: '📜',
    partnership: '🤝',
    innovation: '💡'
  };
  return iconMap[type] || '📅';
};

const getTimelineColor = (type: FarmTimelineEvent['type']) => {
  const colorMap = {
    founding: 'bg-green-100 text-green-800 border-green-200',
    expansion: 'bg-blue-100 text-blue-800 border-blue-200',
    achievement: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    milestone: 'bg-purple-100 text-purple-800 border-purple-200',
    award: 'bg-orange-100 text-orange-800 border-orange-200',
    certification: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    partnership: 'bg-pink-100 text-pink-800 border-pink-200',
    innovation: 'bg-cyan-100 text-cyan-800 border-cyan-200'
  };
  return colorMap[type] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const EnhancedFarmTimeline: React.FC<EnhancedFarmTimelineProps> = ({
  timeline,
  isEditable = false,
  onEdit,
  onAddEvent,
  onEditEvent,
  onDeleteEvent
}) => {
  const sortedTimeline = [...timeline].sort((a, b) => a.year - b.year);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <Calendar className="w-8 h-8 mr-3" />
          Farm History Timeline
        </h2>
        {isEditable && (
          <div className="flex gap-2">
            <Button
              onClick={onAddEvent}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
            <Button
              onClick={onEdit}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              size="sm"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Timeline
            </Button>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white/30 via-white/50 to-white/30"></div>
        
        <div className="space-y-8">
          {sortedTimeline.map((event, index) => (
            <div key={event.id} className="relative flex items-start group">
              {/* Timeline dot */}
              <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/30">
                <span className="text-2xl">{getTimelineIcon(event.type)}</span>
              </div>
              
              {/* Event content */}
              <div className="ml-8 flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group-hover:scale-105">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl font-bold text-white">{event.year}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTimelineColor(event.type)}`}>
                        {event.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-white/80 leading-relaxed">{event.description}</p>
                    {event.imageUrl && (
                      <div className="mt-4">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full max-w-md h-48 object-cover rounded-xl"
                        />
                      </div>
                    )}
                  </div>
                  
                  {isEditable && (
                    <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        onClick={() => onEditEvent?.(event)}
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => onDeleteEvent?.(event.id)}
                        size="sm"
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {timeline.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white/80 mb-2">No Timeline Events Yet</h3>
          <p className="text-white/60 mb-6">
            Share your farm's journey by adding important milestones and achievements.
          </p>
          {isEditable && onAddEvent && (
            <Button
              onClick={onAddEvent}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add First Event
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
