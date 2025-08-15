/**
 * ContentCard component - Consistent horizontal layout with thumbnail always on left
 * Shows either actual image or fallback compass icon when no image available
 * Supports interviews, articles, profiles, and any future content
 */

import React from 'react';
import Tags from './Tags';
import Link from 'next/link';
import LazyImage from './LazyImage';
import { FaCompass } from 'react-icons/fa';

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
  showImage?: boolean;
  showTags?: boolean;
  showPublication?: boolean;
  className?: string;
  onItemClick?: (item: ContentItem) => void;
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
            <div className="text-sm text-gray-500 mb-3">
              {item.publication?.date && (
                <span>{item.publication.date}</span>
              )}
              {item.publication?.publisher && (
                <span>{item.publication?.date ? ' • ' : ''}{item.publication.publisher}</span>
              )}
              {item.metadata.type && (
                <span>{(item.publication?.date || item.publication?.publisher) ? ' • ' : ''}{item.metadata.type}</span>
              )}
              {primaryPerson?.role && (
                <span>{(item.publication?.date || item.publication?.publisher || item.metadata.type) ? ' • ' : ''}{primaryPerson.role}</span>
              )}
            </div>
          )}

          {/* Tags */}
          {showTags && item.tags && item.tags.length > 0 && (
            <div className="mb-3">
              <Tags 
                tags={item.tags} 
                maxVisible={5} 
                variant="compact"
              />
            </div>
          )}

          {/* Summary/Description */}
          {item.content.summary && (
            <p className="text-gray-600 text-sm">
              {item.content.summary.length > 200 
                ? `${item.content.summary.substring(0, 200)}...`
                : item.content.summary
              }
            </p>
          )}
        </div>
      </div>
    </CardWrapper>
  );
}

// Export optimized version with React.memo
export const OptimizedContentCard = React.memo(ContentCard);
