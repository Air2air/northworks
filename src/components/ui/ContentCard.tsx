/**
 * ContentCard component - Consistent horizontal layout with thumbnail always on left
 * Shows either actual image or fallback compass icon when no image available
 * Supports interviews, articles, profiles, and any future content
 */

"use client";

import React from 'react';
import Tags from './Tags';
import { useRouter } from 'next/navigation';
import LazyImage from './LazyImage';
import { FaCalendarAlt, FaBuilding, FaCompass } from 'react-icons/fa';
import { UnifiedContentItem } from '@/types/content';

interface ContentCardProps {
  item: UnifiedContentItem;
  showImage?: boolean;
  showTags?: boolean;
  showPublication?: boolean;
  className?: string;
  onItemClick?: (item: UnifiedContentItem) => void;
}

export function ContentCard({
  item,
  showImage = true,
  showTags = true,
  showPublication = true,
  className = '',
  onItemClick
}: ContentCardProps) {
  // Get the first image (prioritized non-thumbnail) or fallback to any image
  const primaryImage = item.media?.images?.[0];
  const primaryPerson = item.subject?.people?.[0];
  const router = useRouter();
  
  const cardClasses = `bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer min-h-48 ${className}`;

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on a tag link or any other interactive element
    const target = e.target as Element;
    if (target.closest('a') || target.closest('button')) {
      e.stopPropagation();
      return;
    }
    
    if (item.content.url) {
      router.push(item.content.url);
    }
    onItemClick?.(item);
  };

  const CardContent = () => (
    <div className="flex h-full">
      {/* Image */}
      <div className="flex-shrink-0 w-48 h-48 relative">
        {showImage && primaryImage ? (
          <LazyImage
            src={primaryImage.url}
            alt={primaryImage.alt || item.content.title}
            width={primaryImage.width || 192}
            height={primaryImage.height || 128}
            className="rounded-l-lg object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sky-100 to-sky-300 rounded-l-lg flex items-center justify-center">
            <FaCompass className="w-8 h-8 text-sky-400" />
          </div>
        )}
      </div>
      
      <div className="flex-1 p-6">
        <h3 className="text-xl font-semibold text-sky-900 mb-2">
          {item.content.title}
        </h3>
        
        {/* Metadata row */}
        {showPublication && (
          <div className="flex items-center text-sm text-sky-500 mb-3 space-x-4">
            {item.publication?.date && (
              <div className="flex items-center space-x-1">
                <FaCalendarAlt className="text-sky-500" />
                <span>{item.publication.date}</span>
              </div>
            )}
            {item.publication?.publisher && (
              <div className="flex items-center space-x-1">
                <FaBuilding className="text-sky-500" />
                <span>{item.publication.publisher}</span>
              </div>
            )}
            {item.metadata.type && (
              <span className="text-sky-400">• {item.metadata.type}</span>
            )}
            {primaryPerson?.role && (
              <span className="text-sky-400">• {primaryPerson.role}</span>
            )}
          </div>
        )}

        {/* Tags */}
        {showTags && item.tags && item.tags.length > 0 && (
          <Tags tags={item.tags} maxVisible={5} variant="medium" />
        )}
      </div>
    </div>
  );

  return (
    <article className={cardClasses} onClick={handleClick}>
      <CardContent />
    </article>
  );
}

export default ContentCard;
