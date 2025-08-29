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
import LazyImage from './LazyImage';
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
  const primaryImage = getPrimaryImage(item, variant);

  // If no primary image, show fallback icon
  if (!primaryImage) {
    return (
      <div className={`${className} flex`}>
        <div className="w-full h-full bg-gradient-to-br from-sky-100 to-sky-300 flex-centered">
          <TypeIcon className="w-8 h-8 text-sky-500" />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <LazyImage
        src={primaryImage.url}
        alt={primaryImage.alt || item.title}
        width={undefined}
        height={undefined}
        className="overflow-thumbnail"
      />
      
      {item.featured && (
        <div className="absolute top-2 right-2">
          <FaStar className="w-4 h-4 text-yellow-500" />
        </div>
      )}
    </div>
  );
}

function getPrimaryImage(item: UnifiedContentItem, variant: MediaVariant) {
  if (!item.media || item.media.length === 0) return null;
  
  // Find appropriate image based on variant
  const preferredTypes: Record<MediaVariant, string[]> = {
    thumbnail: ['thumbnail', 'square', 'icon'],
    hero: ['hero', 'landscape', 'original'],
    portrait: ['portrait', 'original', 'hero'],
    landscape: ['landscape', 'hero', 'original'],
    square: ['square', 'thumbnail', 'icon'],
    icon: ['icon', 'thumbnail', 'square'],
    logo: ['logo', 'icon', 'thumbnail'],
    original: ['original', 'hero', 'landscape']
  };
  
  const types = preferredTypes[variant] || preferredTypes.thumbnail;
  
  for (const type of types) {
    const image = item.media.find(m => m.variant === type);
    if (image) return image;
  }
  
  // Fallback to first image
  return item.media[0];
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
