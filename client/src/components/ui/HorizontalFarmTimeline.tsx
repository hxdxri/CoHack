import React, { useState, useRef } from 'react';
import { FarmTimelineEvent } from '@/types';
import { Button } from './Button';
import { Plus, Edit3, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalFarmTimelineProps {
  timeline: FarmTimelineEvent[];
  isEditable?: boolean;
  onEdit?: () => void;
  onAddEvent?: () => void;
  onEditEvent?: (event: FarmTimelineEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
  className?: string;
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

export const HorizontalFarmTimeline: React.FC<HorizontalFarmTimelineProps> = ({
  timeline,
  isEditable = false,
  onEdit,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  className = ""
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sortedTimeline = [...timeline].sort((a, b) => a.year - b.year);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`bg-gradient-to-r from-gray-900 to-black rounded-xl p-4 text-white ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Farm History Timeline</h3>
        {isEditable && (
          <div className="flex gap-2">
            <Button
              onClick={onAddEvent}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Event
            </Button>
            <Button
              onClick={onEdit}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              size="sm"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        )}
      </div>

      {sortedTimeline.length > 0 ? (
        <div className="relative">
          {/* Scroll buttons */}
          <Button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white"
            size="sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white"
            size="sm"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Timeline container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {sortedTimeline.map((event, index) => (
              <div
                key={event.id}
                className="flex-shrink-0 relative group"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 group-hover:scale-105 w-64">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getTimelineIcon(event.type)}</span>
                      <span className="text-2xl font-bold">{event.year}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTimelineColor(event.type)}`}>
                      {event.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-white mb-2 line-clamp-2">{event.title}</h4>
                  <p className="text-white/80 text-sm line-clamp-3 mb-3">{event.description}</p>
                  
                  {event.imageUrl && (
                    <div className="mb-3">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-24 object-cover rounded"
                      />
                    </div>
                  )}

                  {isEditable && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        onClick={() => onEditEvent?.(event)}
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white flex-1"
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => onDeleteEvent?.(event.id)}
                        size="sm"
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-200"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📅</span>
          </div>
          <h4 className="text-lg font-semibold text-white/80 mb-2">No Timeline Events Yet</h4>
          <p className="text-white/60 mb-4 text-sm">
            Share your farm's journey by adding important milestones and achievements.
          </p>
          {isEditable && onAddEvent && (
            <Button
              onClick={onAddEvent}
              className="bg-white/20 hover:bg-white/30 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add First Event
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
