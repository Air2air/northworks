/**
 * LANDING CARD
 * ============
 * 
 * A specialized card component for landing page navigation sections.
 * Designed to work perfectly with TwoColumnGrid for featured content display.
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ===============================================
// TYPE DEFINITIONS
// ===============================================

export interface LandingCardProps {
  /** Card title */
  title: string;
  
  /** Card description/summary */
  description: string;
  
  /** Navigation URL */
  href: string;
  
  /** Primary image for the card */
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  
  /** Additional CSS classes */
  className?: string;
  
  /** Card variant */
  variant?: 'default' | 'featured' | 'minimal';
  
  /** Whether to show the image */
  showImage?: boolean;
  
  /** Whether to show tags */
  showTags?: boolean;
  
  /** Tags to display if showTags is true */
  tags?: string[];
}

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

function getCardClasses(variant: LandingCardProps['variant'], hasImage: boolean): string {
  const baseClasses = 'group block bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-sky-300 no-underline';
  
  // Adjust height based on whether there's an image
  const heightClasses = hasImage ? 'h-full' : 'h-auto min-h-[200px]';
  
  const variantClasses = {
    'default': 'shadow-sm',
    'featured': 'shadow-md hover:shadow-xl',
    'minimal': 'shadow-none border-gray-100'
  };
  
  return `${baseClasses} ${heightClasses} ${variantClasses[variant || 'default']}`;
}

function getImageClasses(): string {
  // Increased height for better visual impact on landing page
  return 'w-full h-64 sm:h-72 md:h-80 object-cover transition-transform duration-300 group-hover:scale-105';
}

function getContentClasses(): string {
  return 'p-6 flex flex-col flex-grow';
}

function getTitleClasses(): string {
  return 'text-2xl font-bold text-sky-900 mb-3 group-hover:text-sky-700 transition-colors duration-300';
}

function getDescriptionClasses(): string {
  return 'text-gray-600 text-base leading-relaxed flex-grow';
}

// ===============================================
// MAIN COMPONENT
// ===============================================

export default function LandingCard({
  title,
  description,
  href,
  image,
  className = '',
  variant = 'featured',
  showImage = true,
  showTags = false,
  tags = []
}: LandingCardProps) {
  
  const hasImage = Boolean(showImage && image);
  const cardClasses = getCardClasses(variant, hasImage);
  const imageClasses = getImageClasses();
  const contentClasses = getContentClasses();
  const titleClasses = getTitleClasses();
  const descriptionClasses = getDescriptionClasses();
  
  return (
    <Link 
      href={href}
      className={`${cardClasses} ${className}`}
    >
      {/* Image Section */}
      {showImage && image && (
        <div className="relative overflow-hidden">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width || 400}
            height={image.height || 180}
            className={imageClasses}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      {/* Content Section */}
      <div className={contentClasses}>
        <h3 className={titleClasses}>
          {title}
        </h3>
        
        <p className={descriptionClasses}>
          {description}
        </p>
        
        {/* Tags Section */}
        {showTags && tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 text-sm font-medium bg-sky-100 text-sky-800 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* More Button */}
        <div className="mt-4">
          <div className="inline-flex items-center px-4 py-2 bg-sky-600 text-white text-base font-medium rounded-md transition-all duration-300 group-hover:bg-sky-700 group-hover:shadow-md">
            <span>More</span>
            <svg 
              className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ===============================================
// PRESET VARIANTS
// ===============================================

export const FeaturedLandingCard = (props: Omit<LandingCardProps, 'variant'>) => (
  <LandingCard {...props} variant="featured" />
);

export const MinimalLandingCard = (props: Omit<LandingCardProps, 'variant'>) => (
  <LandingCard {...props} variant="minimal" />
);
