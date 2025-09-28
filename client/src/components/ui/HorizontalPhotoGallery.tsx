import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { ChevronLeft, ChevronRight, Edit3, Plus } from 'lucide-react';

interface HorizontalPhotoGalleryProps {
  photos: Array<{
    id: string;
    url: string;
    caption?: string;
    type?: string;
  }>;
  title?: string;
  isEditable?: boolean;
  onEdit?: () => void;
  onAddPhoto?: () => void;
  className?: string;
}

export const HorizontalPhotoGallery: React.FC<HorizontalPhotoGalleryProps> = ({
  photos,
  title = "Photo Gallery",
  isEditable = false,
  onEdit,
  onAddPhoto,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  if (photos.length === 0 && !isEditable) {
    return null;
  }

  return (
    <div className={`bg-white rounded-xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {isEditable && (
          <div className="flex gap-2">
            {onAddPhoto && (
              <Button
                onClick={onAddPhoto}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Photo
              </Button>
            )}
            {onEdit && (
              <Button
                onClick={onEdit}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        )}
      </div>

      {photos.length > 0 ? (
        <div className="relative">
          {/* Scroll buttons */}
          <Button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
            size="sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
            size="sm"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Photo container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="flex-shrink-0 relative group"
              >
                <div className="relative w-48 h-32 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={photo.url}
                    alt={photo.caption || `Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-white text-xs font-medium truncate">{photo.caption}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm mb-4">No photos added yet</p>
          {isEditable && onAddPhoto && (
            <Button
              onClick={onAddPhoto}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Photos
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
