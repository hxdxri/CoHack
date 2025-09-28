import React, { useState, useRef, useEffect } from 'react';
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

  // Auto-scroll effect
  useEffect(() => {
    if (photos.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollAmount = 400; // Scroll by image width + gap
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScroll) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [photos.length]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      });
    }
  };

  if (photos.length === 0 && !isEditable) {
    return null;
  }

  return (
    <div className={`${className}`}>
      {isEditable && (
        <div className="flex justify-end gap-2 mb-4">
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

      {photos.length > 0 ? (
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

          {/* Photo container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="flex-shrink-0 relative group"
              >
                <div className="relative w-80 h-48 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <img
                    src={photo.url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
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
