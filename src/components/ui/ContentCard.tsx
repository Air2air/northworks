/**
 * Base ContentCard component - reusable across all content types
 * Supports interviews, articles, profiles, and any future content
 */

import React from 'react';
import Link from 'next/link';

export interface ContentItem {
  metadata: {
    id: string;
    type: string;
    category: string;
    subcategory?: string;
    status: string;
  };
  content: {
    title: string;
    summary?: string;
    url?: string;
  };
  subject?: {
    people?: Array<{
      name: string;
      role: string;
      description?: string;
    }>;
  };
  publication?: {
    date?: string;
    publisher?: string;
    publication?: string;
  };
  media?: {
    images?: Array<{
      url: string;
      type: string;
      alt: string;
    }>;
  };
  tags?: string[];
}

interface ContentCardProps {
  item: ContentItem;
  variant?: 'compact' | 'detailed' | 'grid';
  showImage?: boolean;
  showTags?: boolean;
  showPublication?: boolean;
  className?: string;
  onItemClick?: (item: ContentItem) => void;
}

export function ContentCard({
  item,
  variant = 'detailed',
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
  const publishDate = item.publication?.date ? new Date(item.publication.date) : null;

  const cardStyles = `
    bg-white rounded-lg border border-gray-200 shadow-sm p-6 
    ${onItemClick || hasUrl ? 'cursor-pointer hover:shadow-md transition-shadow duration-200' : ''}
    ${className}
  `;

  const badgeStyles = (type: 'primary' | 'secondary') => `
    inline-block px-2 py-1 text-xs font-medium rounded-md
    ${type === 'primary' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-gray-100 text-gray-800 border border-gray-300'
    }
  `;

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (hasUrl) {
      return (
        <Link href={item.content.url!} className="block">
          <div className={cardStyles} onClick={handleClick}>
            {children}
          </div>
        </Link>
      );
    }
    
    return (
      <div className={cardStyles} onClick={handleClick}>
        {children}
      </div>
    );
  };

  return (
    <CardWrapper>
      {/* Header */}
      <div className={`${variant === 'compact' ? 'mb-2' : 'mb-4'}`}>
        <div className="flex items-start gap-3">
          {/* Thumbnail */}
          {showImage && thumbnail && variant !== 'compact' && (
            <div className="flex-shrink-0">
              <img
                src={thumbnail.url}
                alt={thumbnail.alt}
                className="w-16 h-16 rounded-lg object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className={`${variant === 'compact' ? 'text-lg' : 'text-xl'} font-semibold text-gray-900 leading-tight line-clamp-2`}>
              {item.content.title}
              {hasUrl && (
                <span className="inline-block w-4 h-4 ml-2 opacity-60">↗</span>
              )}
            </h3>
            
            {/* Type and Category Badges */}
            <div className="flex gap-2 mt-2">
              <span className={badgeStyles('primary')}>
                {item.metadata.type}
              </span>
              {item.metadata.subcategory && (
                <span className={badgeStyles('secondary')}>
                  {item.metadata.subcategory.replace('-', ' ')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {variant !== 'compact' && (
        <div className="space-y-3">
          {/* Primary Person (for interviews) */}
          {primaryPerson && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="inline-block w-4 h-4">👤</span>
              <span className="font-medium">{primaryPerson.name}</span>
              {primaryPerson.role && primaryPerson.role !== 'classical musician' && (
                <>
                  <span>•</span>
                  <span className="capitalize">{primaryPerson.role}</span>
                </>
              )}
            </div>
          )}

          {/* Summary */}
          {item.content.summary && variant === 'detailed' && (
            <p className="text-sm text-gray-600 line-clamp-3">
              {item.content.summary}
            </p>
          )}

          {/* Publication Info */}
          {showPublication && (publishDate || item.publication?.publisher) && (
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {publishDate && (
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3">📅</span>
                  <span>
                    {publishDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
              {item.publication?.publisher && (
                <span className="truncate">{item.publication.publisher}</span>
              )}
            </div>
          )}

          {/* Tags */}
          {showTags && item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, variant === 'grid' ? 3 : 5).map((tag, index) => (
                <span key={index} className={badgeStyles('secondary')}>
                  {tag}
                </span>
              ))}
              {item.tags.length > (variant === 'grid' ? 3 : 5) && (
                <span className={badgeStyles('secondary')}>
                  +{item.tags.length - (variant === 'grid' ? 3 : 5)}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </CardWrapper>
  );
}
