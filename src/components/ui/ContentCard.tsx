/**
 * ContentCard component - Consistent horizontal layout with thumbnail always on left
 * Shows either actual image or fallback compass icon when no image available
 * Supports interviews, articles, profiles, and any future content
 */

import React from 'react';
import Tags from './Tags';
import Link from 'next/link';
import LazyImage from './LazyImage';
import { FaCompass, FaCalendarAlt, FaBuilding } from 'react-icons/fa';
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
  const handleClick = () => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const hasUrl = item.content.url;
  const thumbnail = item.media?.images?.find(img => img.type === 'thumbnail');
  const primaryPerson = item.subject?.people?.[0];

  const cardStyles = `
    bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow
    ${className}
  `;

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (hasUrl) {
      return (
        <Link href={item.content.url!} className="block">
          <article className={cardStyles} onClick={handleClick}>
            {children}
          </article>
        </Link>
      );
    }
    return (
      <article className={cardStyles} onClick={handleClick}>
        {children}
      </article>
    );
  };

  return (
    <CardWrapper>
      <div className="flex">
        {/* Thumbnail image on the left - always present */}
        <div className="flex-shrink-0 w-48 h-32 relative">
          {showImage && thumbnail ? (
            <LazyImage
              src={thumbnail.url}
              alt={thumbnail.alt || item.content.title}
              width={192}
              height={128}
              className="rounded-l-lg"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-l-lg flex items-center justify-center">
              <FaCompass className="text-4xl text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="flex-1 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {hasUrl ? (
              <span className="hover:text-blue-600 transition-colors">
                {item.content.title}
              </span>
            ) : (
              <span>{item.content.title}</span>
            )}
          </h3>
          
          {/* Metadata row */}
          {showPublication && (
            <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
              {item.publication?.date && (
                <div className="flex items-center space-x-1">
                  <FaCalendarAlt className="text-blue-500" />
                  <span>{item.publication.date}</span>
                </div>
              )}
              {item.publication?.publisher && (
                <div className="flex items-center space-x-1">
                  <FaBuilding className="text-blue-500" />
                  <span>{item.publication.publisher}</span>
                </div>
              )}
              {item.metadata.type && (
                <span className="text-gray-400">• {item.metadata.type}</span>
              )}
              {primaryPerson?.role && (
                <span className="text-gray-400">• {primaryPerson.role}</span>
              )}
            </div>
          )}

          {/* Tags */}
          {showTags && item.tags && item.tags.length > 0 && (
            <div className="mb-3">
              <Tags 
                tags={item.tags} 
                maxVisible={5} 
                variant="medium"
              />
            </div>
          )}
        </div>
      </div>
    </CardWrapper>
  );
}

// Export optimized version with React.memo
export const OptimizedContentCard = React.memo(ContentCard);
