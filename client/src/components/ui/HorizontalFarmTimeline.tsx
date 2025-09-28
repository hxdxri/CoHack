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
    founding: '•',
    expansion: '•',
    achievement: '•',
    milestone: '•',
    award: '•',
    certification: '•',
    partnership: '•',
    innovation: '•'
  };
  return iconMap[type] || '•';
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
    <div className={`${className}`}>
      {isEditable && (
        <div className="flex justify-end gap-2 mb-4">
          <Button
            onClick={onAddEvent}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Event
          </Button>
          <Button
            onClick={onEdit}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            size="sm"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      )}

      {sortedTimeline.length > 0 ? (
        <div className="relative">
          {/* Scroll buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Timeline container */}
          <div
            ref={scrollContainerRef}
            className="relative overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex items-start min-w-max px-8">
              {/* Timeline line - extends across all events */}
              <div className="absolute top-8 left-0 h-0.5 bg-gray-200" style={{ width: 'calc(100% + 1250px)' }}></div>
              
              {sortedTimeline.map((event, index) => (
                <div
                  key={event.id}
                  className="flex-shrink-0 relative group px-8"
                >
                  {/* Timeline bullet */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-900 rounded-full border-4 border-white shadow-lg z-10"></div>
                  
                  {/* Event content */}
                  <div className="pt-8 text-center max-w-xs">
                    <div className="text-2xl font-bold text-gray-900 mb-2">{event.year}</div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2 leading-tight">{event.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">{event.description}</p>
                    
                    {event.imageUrl && (
                      <div className="mb-3">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-32 object-cover rounded-lg shadow-sm"
                        />
                      </div>
                    )}

                    {isEditable && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 justify-center">
                        <Button
                          onClick={() => onEditEvent?.(event)}
                          size="sm"
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs"
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => onDeleteEvent?.(event.id)}
                          size="sm"
                          className="bg-red-100 hover:bg-red-200 text-red-700 text-xs"
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
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-gray-400">•</span>
          </div>
          <p className="text-gray-500 mb-4 text-sm">
            Share your farm's journey by adding important milestones and achievements.
          </p>
          {isEditable && onAddEvent && (
            <Button
              onClick={onAddEvent}
              className="bg-green-600 hover:bg-green-700 text-white"
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
