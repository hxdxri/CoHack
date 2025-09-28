import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from './Button';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  primaryButton: {
    text: string;
    link: string;
    variant: 'primary' | 'secondary' | 'outline' | 'success';
  };
  secondaryButton: {
    text: string;
    link: string;
    variant: 'primary' | 'secondary' | 'outline' | 'success';
  };
}

interface SlideshowProps {
  slides: Slide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
}

export const Slideshow: React.FC<SlideshowProps> = ({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
  showControls = true,
  showIndicators = true,
  className = '',
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [imageLoaded, setImageLoaded] = useState<boolean[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, slides.length, autoPlayInterval]);

  // Preload images
  useEffect(() => {
    const preloadImages = () => {
      slides.forEach((slide, index) => {
        const img = new Image();
        img.onload = () => {
          setImageLoaded(prev => {
            const newLoaded = [...prev];
            newLoaded[index] = true;
            return newLoaded;
          });
        };
        img.src = slide.image;
      });
    };
    preloadImages();
  }, [slides]);

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (slides.length === 0) return null;

  const currentSlideData = slides[currentSlide];

  return (
    <div className={`relative w-full h-screen overflow-hidden ${className}`}>
      {/* Slide Images with Crossfade */}
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((slide, index) => (
          <img
            key={slide.id}
            src={slide.image}
            alt={slide.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentSlide && imageLoaded[index] 
                ? 'opacity-100' 
                : 'opacity-0'
            }`}
            onLoad={() => {
              setImageLoaded(prev => {
                const newLoaded = [...prev];
                newLoaded[index] = true;
                return newLoaded;
              });
            }}
          />
        ))}
        
        {/* Loading placeholder */}
        {!imageLoaded[currentSlide] && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* Slide Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">
            {currentSlideData.title}
          </h1>
          <h2 className="text-2xl md:text-3xl mb-6 text-green-100 animate-fade-in-delay">
            {currentSlideData.subtitle}
          </h2>
          <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto animate-fade-in-delay-2">
            {currentSlideData.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-3">
            <Link to={currentSlideData.primaryButton.link}>
              <Button 
                variant={currentSlideData.primaryButton.variant} 
                size="lg" 
                className="w-full sm:w-auto"
              >
                {currentSlideData.primaryButton.text}
              </Button>
            </Link>
            
            <Link to={currentSlideData.secondaryButton.link}>
              <Button 
                variant={currentSlideData.secondaryButton.variant} 
                size="lg" 
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-500"
              >
                {currentSlideData.secondaryButton.text}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {showControls && slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Play/Pause Button */}
      {autoPlay && slides.length > 1 && (
        <button
          onClick={togglePlayPause}
          className="absolute top-4 right-4 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200"
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
      )}

      {/* Slide Indicators */}
      {showIndicators && slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? 'bg-white'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
