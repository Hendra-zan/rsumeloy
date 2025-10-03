import React from 'react';
import { getOptimizedUrl } from '../../lib/cloudinary';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  imagePublicId: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, description, imagePublicId }) => {
    const optimizedImageUrl = getOptimizedUrl(imagePublicId);
    return (
        <div 
          className="relative h-64 md:h-80 w-full flex items-center justify-center text-center text-white bg-cover bg-center pt-20" 
          style={{ backgroundImage: `url(${optimizedImageUrl})` }}
          role="banner"
          aria-labelledby="page-title"
        >
          <div className="absolute inset-0 bg-primary/60" />
          <div className="relative z-10 max-w-2xl px-4">
              <h1 id="page-title" className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">{title}</h1>
              {subtitle && <p className="mt-2 text-lg text-primary-foreground/80 md:text-xl">{subtitle}</p>}
              {description && <p className="mt-4 text-base text-primary-foreground/70 md:text-lg">{description}</p>}
          </div>
        </div>
    );
};

export default PageHeader;
