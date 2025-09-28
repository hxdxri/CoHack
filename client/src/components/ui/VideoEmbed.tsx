import React, { useState } from 'react';
import { Button } from './Button';
import { Play, Edit3, X } from 'lucide-react';

interface VideoEmbedProps {
  videoUrl?: string;
  title?: string;
  isEditable?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
  className?: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({
  videoUrl,
  title = "Farm Introduction Video",
  isEditable = false,
  onEdit,
  onRemove,
  className = ""
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const getVideoId = (url: string) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatch) {
      return { type: 'youtube', id: youtubeMatch[1] };
    }

    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/)([0-9]+)/);
    if (vimeoMatch) {
      return { type: 'vimeo', id: vimeoMatch[1] };
    }

    return null;
  };

  const videoInfo = videoUrl ? getVideoId(videoUrl) : null;

  if (!videoUrl || !videoInfo) {
    return (
      <div className={`bg-gray-100 rounded-2xl p-8 text-center ${className}`}>
        <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Video Added</h3>
        <p className="text-gray-500 mb-4">
          Add an introduction video to help customers connect with your farm.
        </p>
        {isEditable && onEdit && (
          <Button
            onClick={onEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Add Video
          </Button>
        )}
      </div>
    );
  }

  const embedUrl = videoInfo.type === 'youtube' 
    ? `https://www.youtube.com/embed/${videoInfo.id}?autoplay=0&rel=0`
    : `https://player.vimeo.com/video/${videoInfo.id}?autoplay=0`;

  return (
    <div className={`relative group ${className}`}>
      <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
        <div className="relative aspect-video">
          {isPlaying ? (
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
              <img
                src={videoInfo.type === 'youtube' 
                  ? `https://img.youtube.com/vi/${videoInfo.id}/maxresdefault.jpg`
                  : `https://vumbnail.com/${videoInfo.id}.jpg`
                }
                alt={title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
              >
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-gray-900 ml-1" />
                </div>
              </button>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>

      {/* Edit/Remove buttons */}
      {isEditable && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
            {onEdit && (
              <Button
                onClick={onEdit}
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            )}
            {onRemove && (
              <Button
                onClick={onRemove}
                size="sm"
                className="bg-red-500/20 hover:bg-red-500/30 text-red-200 backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
