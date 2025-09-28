import React, { useState } from 'react';
import { X, Camera, User, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';
import { FarmPhoto, WorkPhoto } from '@/types';
import { Modal } from './Modal';

interface PhotoGalleryProps {
  farmPhotos?: FarmPhoto[];
  farmerPhoto?: string;
  workPhotos?: WorkPhoto[];
  isEditable?: boolean;
  onEdit?: () => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  farmPhotos = [],
  farmerPhoto,
  workPhotos = [],
  isEditable = false,
  onEdit,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allPhotos, setAllPhotos] = useState<Array<{url: string, caption?: string, type: string}>>([]);

  // Combine all photos for modal navigation
  React.useEffect(() => {
    const photos = [
      ...farmPhotos.map(photo => ({ url: photo.url, caption: photo.caption, type: photo.type })),
      ...(farmerPhoto ? [{ url: farmerPhoto, caption: 'Farmer', type: 'farmer' }] : []),
      ...workPhotos.map(photo => ({ url: photo.url, caption: photo.caption, type: photo.type })),
    ];
    setAllPhotos(photos);
  }, [farmPhotos, farmerPhoto, workPhotos]);

  const openModal = (photoUrl: string) => {
    const index = allPhotos.findIndex(photo => photo.url === photoUrl);
    setCurrentIndex(index);
    setSelectedPhoto(photoUrl);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentIndex(prev => prev > 0 ? prev - 1 : allPhotos.length - 1);
    } else {
      setCurrentIndex(prev => prev < allPhotos.length - 1 ? prev + 1 : 0);
    }
    setSelectedPhoto(allPhotos[currentIndex]?.url || null);
  };

  const getPhotoIcon = (type: string) => {
    switch (type) {
      case 'farmer':
        return <User className="w-4 h-4" />;
      case 'harvesting':
      case 'planting':
      case 'processing':
      case 'packaging':
      case 'delivery':
        return <Wrench className="w-4 h-4" />;
      default:
        return <Camera className="w-4 h-4" />;
    }
  };

  const getPhotoTypeLabel = (type: string) => {
    switch (type) {
      case 'farmer':
        return 'Farmer';
      case 'farm':
        return 'Farm';
      case 'landscape':
        return 'Landscape';
      case 'animals':
        return 'Animals';
      case 'crops':
        return 'Crops';
      case 'equipment':
        return 'Equipment';
      case 'harvesting':
        return 'Harvesting';
      case 'planting':
        return 'Planting';
      case 'processing':
        return 'Processing';
      case 'packaging':
        return 'Packaging';
      case 'delivery':
        return 'Delivery';
      default:
        return 'Photo';
    }
  };

  if (farmPhotos.length === 0 && !farmerPhoto && workPhotos.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <Camera className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Photos Yet</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          {isEditable 
            ? "Add photos to showcase your farm, work, and yourself to customers."
            : "This farmer hasn't added any photos yet."
          }
        </p>
        {isEditable && onEdit && (
          <button
            onClick={onEdit}
            className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Camera className="w-5 h-5 mr-2" />
            Add Photos
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-16">
        {/* Farmer Photo - Hero Section */}
        {farmerPhoto && (
          <div className="relative">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Meet the Farmer</h3>
              <p className="text-gray-600 text-lg">The person behind the farm</p>
            </div>
            <div className="relative group max-w-2xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src={farmerPhoto}
                  alt="Farmer"
                  className="w-full h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                  onClick={() => openModal(farmerPhoto)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Farm Photos - Masonry Layout */}
        {farmPhotos.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Our Farm</h3>
              <p className="text-gray-600 text-lg">A glimpse into our world</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farmPhotos.map((photo, index) => {
                const isLarge = index % 5 === 0; // Every 5th photo is larger
                return (
                  <div 
                    key={photo.id} 
                    className={`relative group ${isLarge ? 'md:col-span-2 lg:col-span-2' : ''}`}
                  >
                    <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                      <img
                        src={photo.url}
                        alt={photo.caption || 'Farm photo'}
                        className={`w-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500 ${
                          isLarge ? 'h-80' : 'h-64'
                        }`}
                        onClick={() => openModal(photo.url)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      {photo.caption && (
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <p className="text-white text-lg font-semibold mb-1">{photo.caption}</p>
                          <p className="text-white/80 text-sm">{getPhotoTypeLabel(photo.type)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Work Photos - Horizontal Scroll */}
        {workPhotos.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Our Work</h3>
              <p className="text-gray-600 text-lg">Behind the scenes of our daily operations</p>
            </div>
            <div className="relative">
              <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                {workPhotos.map((photo, index) => (
                  <div key={photo.id} className="relative group flex-shrink-0">
                    <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 w-80">
                      <img
                        src={photo.url}
                        alt={photo.caption || 'Work photo'}
                        className="w-full h-64 object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                        onClick={() => openModal(photo.url)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                          <Wrench className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      {photo.caption && (
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white text-lg font-semibold mb-1">{photo.caption}</p>
                          <p className="text-white/80 text-sm">{getPhotoTypeLabel(photo.type)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Edit Button */}
        {isEditable && onEdit && (
          <div className="flex justify-center pt-8">
            <button
              onClick={onEdit}
              className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Camera className="w-5 h-5 mr-2" />
              Edit Photos
            </button>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      <Modal isOpen={!!selectedPhoto} onClose={closeModal} size="xl">
        <div className="relative">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {allPhotos.length > 1 && (
            <>
              <button
                onClick={() => navigatePhoto('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigatePhoto('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="relative">
            <img
              src={selectedPhoto || ''}
              alt="Gallery photo"
              className="w-full h-96 object-contain rounded-lg"
            />
            {allPhotos[currentIndex]?.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                <p className="text-white text-lg font-medium">{allPhotos[currentIndex]?.caption}</p>
                <p className="text-white/80 text-sm">{getPhotoTypeLabel(allPhotos[currentIndex]?.type || '')}</p>
              </div>
            )}
          </div>

          {allPhotos.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {allPhotos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setSelectedPhoto(allPhotos[index].url);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
