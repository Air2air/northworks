/**
 * CARD IMAGE COMPONENT
 * ===================
 * 
 * Handles image display for UnifiedCard with:
 * - Lazy loading
 * - Fallback icons
 * - Featured badges
 * - Responsive sizing
 */

"use client";

import React from 'react';
import OptimizedImage from './OptimizedImage';
import { 
  FaStar,
  FaMusic, 
  FaCompass,
  FaGraduationCap,
  FaBriefcase,
  FaNewspaper,
  FaMicrophone,
  FaUser,
  FaBuilding
} from 'react-icons/fa';
import { UnifiedContentItem, MediaVariant, ContentType } from '@/schemas/unified-content-schema';
import type { CardImageProps } from '@/types';

export default function CardImage({ 
  item, 
  variant, 
  showImage, 
  className = "" 
}: CardImageProps) {
  if (!showImage) return null;

  const TypeIcon = getTypeIcon(item.type);
  
  // Check for images in frontmatter first, then media
  const imageSource = getImageSource(item);

  // If no image found, show fallback icon
  if (!imageSource) {
    return (
      <div className={`${className} flex`}>
        <div className="w-full h-full bg-gradient-to-br from-sky-100 to-sky-300 flex items-center justify-center">
          <TypeIcon className="w-8 h-8 text-sky-500" />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <OptimizedImage
        src={imageSource.src}
        alt={imageSource.alt || item.title}
        width={imageSource.width || 300}
        height={imageSource.height || 200}
        className="w-full h-full object-cover object-top"
      />
      
      {item.featured && (
        <div className="absolute top-2 right-2">
          <FaStar className="w-4 h-4 text-yellow-500" />
        </div>
      )}
    </div>
  );
}

function getImageSource(item: UnifiedContentItem) {
  // First check for media array (new unified schema)
  if (item.media && item.media.length > 0) {
    const image = item.media.find(m => m.type === 'image') || item.media[0];
    return {
      src: image.url,
      alt: image.alt || item.title,
      width: image.width || 300,
      height: image.height || 200
    };
  }
  
  // Check for images in legacy data (original frontmatter)
  const legacyImages = item.legacy?.originalData?.images;
  if (legacyImages && Array.isArray(legacyImages) && legacyImages.length > 0) {
    const image = legacyImages[0];
    return {
      src: image.src,
      alt: image.alt || item.title,
      width: image.width || 300,
      height: image.height || 200
    };
  }
  
  // Type assertion for backward compatibility
  const itemAny = item as any;
  
  // Check for images array in various possible locations
  const images = itemAny.images || itemAny.frontmatter?.images || itemAny.content?.images;
  
  if (images && Array.isArray(images) && images.length > 0) {
    const image = images[0];
    return {
      src: image.src,
      alt: image.alt || item.title,
      width: image.width || 300,
      height: image.height || 200
    };
  }

  return null;
}

function getTypeIcon(type: ContentType) {
  const iconMap: Record<ContentType, any> = {
    interview: FaMicrophone,
    article: FaNewspaper,
    review: FaMusic,
    professional: FaBriefcase,
    publication: FaGraduationCap,
    background: FaCompass,
    project: FaBriefcase,
    bio: FaUser,
    company: FaBuilding,
    other: FaCompass,
  };
  
  return iconMap[type] || FaCompass;
}
