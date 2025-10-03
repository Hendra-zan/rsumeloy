'use client';

import React, { useState, useEffect, useCallback } from 'react';
import OptimizedImage from './OptimizedImage';
import { ArrowLeft, ArrowRight } from '../icons';
import { cn } from '../../lib/utils';

interface CardImageSliderProps {
  imagePublicIds: string[];
  alt: string;
}

const CardImageSlider: React.FC<CardImageSliderProps> = ({ imagePublicIds, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    if (imagePublicIds.length > 1) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imagePublicIds.length);
    }
  }, [imagePublicIds.length]);

  const goToPrevious = () => {
    if (imagePublicIds.length > 1) {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + imagePublicIds.length) % imagePublicIds.length);
    }
  };

  useEffect(() => {
    if (imagePublicIds.length > 1) {
      const timer = setTimeout(goToNext, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, imagePublicIds.length, goToNext]);

  if (!imagePublicIds || imagePublicIds.length === 0) {
    return <div className="w-full h-56 bg-secondary flex items-center justify-center text-muted-foreground">No Image</div>;
  }

  if (imagePublicIds.length === 1) {
    return <OptimizedImage publicId={imagePublicIds[0]} alt={alt} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />;
  }

  return (
    <div className="relative h-56 w-full overflow-hidden group/slider">
      <div className="flex h-full transition-transform ease-in-out duration-700" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {imagePublicIds.map((id, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <OptimizedImage publicId={id} alt={`${alt} ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        ))}
      </div>

      <button onClick={goToPrevious} aria-label="Previous image" className="absolute top-1/2 -translate-y-1/2 left-2 p-1 bg-black/40 text-white rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity focus:opacity-100 outline-none">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <button onClick={goToNext} aria-label="Next image" className="absolute top-1/2 -translate-y-1/2 right-2 p-1 bg-black/40 text-white rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity focus:opacity-100 outline-none">
        <ArrowRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {imagePublicIds.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to image ${index + 1}`}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              currentIndex === index ? 'w-4 bg-white' : 'bg-white/50 hover:bg-white'
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default CardImageSlider;
