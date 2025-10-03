
import React from 'react';
import Image, { ImageProps } from 'next/image';
import { getOptimizedUrl } from '@/lib/cloudinary';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'loading'> {
  publicId: string;
  loading?: 'eager' | 'lazy';
  preset?: 'default' | 'thumbnail' | 'banner' | 'avatar';
}

const imageSizePresets = {
  default: { width: 800, height: 600, quality: 75 },
  thumbnail: { width: 200, height: 200, quality: 70 },
  banner: { width: 1200, height: 400, quality: 80 },
  avatar: { width: 48, height: 48, quality: 90 },
} as const;

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  publicId, 
  alt,
  preset = 'default',
  width: customWidth,
  height: customHeight,
  quality: customQuality,
  priority = false,
  sizes = '100vw',
  className = '',
  fill,
  ...props 
}) => {
  const optimizedSrc = getOptimizedUrl(publicId);
  const presetConfig = imageSizePresets[preset];
  
  const width = Number(customWidth ?? presetConfig.width);
  const height = Number(customHeight ?? presetConfig.height);
  const quality = Number(customQuality ?? presetConfig.quality);

  // Menggunakan standard img tag untuk placeholder
  if (optimizedSrc.startsWith('https://via.placeholder.com')) {
    return (
      <img 
        src={optimizedSrc} 
        alt={alt} 
        width={width}
        height={height}
        className={cn('object-cover', className)}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  const commonProps = {
    src: optimizedSrc,
    alt,
    quality,
    priority,
    sizes,
    className: cn('object-cover', className),
    loading: priority ? 'eager' as const : 'lazy' as const,
    blurDataURL: `${optimizedSrc}?w=10&q=10&blur=1000`,
    placeholder: width > 40 && height > 40 ? 'blur' as const : undefined,
    ...props
  };

  // Return fill atau dimensioned version
  return fill ? (
    <Image {...commonProps} fill />
  ) : (
    <Image {...commonProps} width={width} height={height} />
  );
};

export default OptimizedImage;
