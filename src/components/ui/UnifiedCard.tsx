/**
 * UNIFIED CARD COMPONENT
 * =====================
 * 
 * Single reusable card component that handles ALL content types:
 * - c-* content (interviews, articles, reviews)
 * - w-* content (professional, publications, background, projects)
 * 
 * Replaces: ContentCard, SimpleNavigationCard, FeatureCard, InfoCard
 * 
 * Features:
 * - Unified data structure
 * - Configurable layouts (horizontal, vertical, minimal, detailed)
 * - Smart content adaptation based on type
 * - Consistent styling and behavior
 * - Type-safe props
 */

"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LazyImage from './LazyImage';
import Tags from './Tags';
import { 
  UnifiedContentItem, 
  CardDisplayOptions,
  MediaVariant,
  ContentType 
} from '@/schemas/unified-content-schema';
import { 
  FaCalendarAlt, 
  FaBuilding, 
  FaUser, 
  FaMusic, 
  FaCompass,
  FaGraduationCap,
  FaBriefcase,
  FaNewspaper,
  FaMicrophone,
  FaStar,
  FaExternalLinkAlt,
  FaDownload
} from 'react-icons/fa';

// ===============================================
// COMPONENT INTERFACE
// ===============================================

export interface UnifiedCardProps {
  item: UnifiedContentItem;
  options?: CardDisplayOptions;
  onClick?: (item: UnifiedContentItem) => void;
  className?: string;
}

// ===============================================
// MAIN COMPONENT
// ===============================================

export default function UnifiedCard({
  item,
  options = {},
  onClick,
  className = ''
}: UnifiedCardProps) {
  const router = useRouter();
  
  // Merge default options with provided options
  const config: Required<CardDisplayOptions> = {
    layout: 'horizontal',
    size: 'medium',
    showImage: true,
    showSummary: true,
    showTags: true,
    showDate: true,
    showAuthor: true,
    showCategory: true,
    showPublication: true,
    imageVariant: 'thumbnail',
    imagePosition: 'left',
    clickable: true,
    hoverable: true,
    selectable: false,
    variant: 'default',
    className: '',
    ...options
  };

  // ===============================================
  // CONTENT PROCESSING
  // ===============================================

  // Get primary image
  const primaryImage = getPrimaryImage(item, config.imageVariant);
  
  // Get display metadata
  const metadata = getDisplayMetadata(item);
  
  // Get appropriate icon for content type
  const TypeIcon = getTypeIcon(item.type);

  // ===============================================
  // EVENT HANDLERS
  // ===============================================

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as Element;
    if (target.closest('a') || target.closest('button') || target.closest('[role="button"]')) {
      e.stopPropagation();
      return;
    }
    
    // Prevent default to ensure clean navigation
    e.preventDefault();
    
    if (config.clickable) {
      const url = item.url || item.internalUrl;
      if (url) {
        if (url.startsWith('http') || url.startsWith('//')) {
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          // Use window.location for internal navigation as fallback
          try {
            router.push(url);
          } catch (error) {
            console.error('Router navigation failed, using window.location:', error);
            window.location.href = url;
          }
        }
      }
    }
    
    onClick?.(item);
  };

  // ===============================================
  // STYLING
  // ===============================================

  const cardClasses = getCardClasses(config, className);
  const imageClasses = getImageClasses(config);
  const contentClasses = getContentClasses(config);

  // ===============================================
  // LAYOUT COMPONENTS
  // ===============================================

  const ImageSection = () => {
    if (!config.showImage) return null;
    
    // If no primary image, hide entirely on mobile, show fallback on desktop
    if (!primaryImage) {
      return (
        <div className={`${imageClasses} hidden md:flex`}>
          <div className="w-full h-full bg-gradient-to-br from-sky-100 to-sky-300 flex items-center justify-center">
            <TypeIcon className="w-8 h-8 text-sky-500" />
          </div>
        </div>
      );
    }

    return (
      <div className={imageClasses}>
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
  };

  const ContentSection = () => (
    <div className={contentClasses}>
      {/* Header */}
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className={getTitleClasses(config.size)}>
            {item.title}
          </h3>
          {(item.externalUrl || item.professional?.project) && (
            <div className="ml-2 flex-shrink-0">
              {item.externalUrl && (
                <FaExternalLinkAlt className="w-4 h-4 text-sky-400" />
              )}
              {item.publication?.downloadUrl && (
                <FaDownload className="w-4 h-4 text-green-500 ml-1" />
              )}
            </div>
          )}
        </div>

        {item.subtitle && (
          <p className="text-sm text-sky-600 mb-2 font-medium">
            {item.subtitle}
          </p>
        )}

        {/* Metadata Row */}
        {(config.showDate || config.showAuthor || config.showPublication || config.showCategory) && (
          <div className="flex items-center text-xs text-sky-500 mb-2 space-x-3 flex-wrap">
            {config.showDate && metadata.date && (
              <div className="flex items-center space-x-1">
                <FaCalendarAlt className="text-sky-400" />
                <span>{metadata.date}</span>
              </div>
            )}
            
            {config.showAuthor && metadata.author && (
              <div className="flex items-center space-x-1">
                <FaUser className="text-sky-400" />
                <span>{metadata.author}</span>
              </div>
            )}
            
            {config.showPublication && metadata.publication && (
              <div className="flex items-center space-x-1">
                <FaBuilding className="text-sky-400" />
                <span>{metadata.publication}</span>
              </div>
            )}
            
            {config.showCategory && (
              <div className="flex items-center space-x-1">
                <TypeIcon className="w-3 h-3 text-sky-400" />
                <span className="capitalize">{item.category}</span>
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        {config.showSummary && item.summary && (
          <p className={getSummaryClasses(config.size)}>
            {truncateSummary(item.summary, config.size)}
          </p>
        )}

        {/* Professional-specific content */}
        {item.type === 'professional' && item.professional && (
          <div className="mt-2 space-y-1">
            {item.professional.position && (
              <div className="text-sm text-sky-700 font-medium">
                {item.professional.position.title} • {item.professional.position.organization}
              </div>
            )}
            {item.professional.project && (
              <div className="text-sm text-sky-600">
                {item.professional.project.description}
              </div>
            )}
          </div>
        )}

        {/* Publication-specific content */}
        {item.type === 'publication' && item.publication && (
          <div className="mt-2 space-y-1">
            {item.publication.volume && (
              <div className="text-sm text-sky-600">
                Vol. {item.publication.volume}
                {item.publication.issue && `, Issue ${item.publication.issue}`}
                {item.publication.pages && `, pp. ${item.publication.pages}`}
              </div>
            )}
          </div>
        )}

        {/* Interview/Performance subjects */}
        {(item.type === 'interview' || item.type === 'review') && item.subject?.people && (
          <div className="mt-2">
            <div className="text-sm text-sky-700 font-medium">
              {item.subject.people.slice(0, 2).map(person => person.name).join(', ')}
              {item.subject.people.length > 2 && ` +${item.subject.people.length - 2} more`}
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      {config.showTags && item.tags && item.tags.length > 0 && (
        <div className="mt-3">
          <Tags 
            tags={item.tags} 
            variant={config.size === 'small' ? 'compact' : 'medium'} 
          />
        </div>
      )}
    </div>
  );

  // ===============================================
  // LAYOUT RENDERING - SIMPLIFIED
  // ===============================================

  const renderContent = () => {
    // Responsive layout: vertical on mobile, horizontal on larger screens for horizontal layout
    if (config.layout === 'horizontal') {
      return (
        <div className="flex flex-col md:flex-row flex-1">
          <ImageSection />
          <ContentSection />
        </div>
      );
    } else if (config.layout === 'vertical') {
      return (
        <div className="flex flex-col flex-1">
          <ImageSection />
          <ContentSection />
        </div>
      );
    } else {
      // Default to responsive horizontal behavior
      return (
        <div className="flex flex-col md:flex-row flex-1">
          <ImageSection />
          <ContentSection />
        </div>
      );
    }
  };

  // ===============================================
  // FINAL RENDER
  // ===============================================

  const cardContent = (
    <div className="flex-1 flex flex-col">
      {renderContent()}
    </div>
  );

  // If card has a valid internal URL, wrap in Link component
  const url = item.url || item.internalUrl;
  const isInternalUrl = url && !url.startsWith('http') && !url.startsWith('//');
  const isExternalUrl = url && (url.startsWith('http') || url.startsWith('//'));

  if (config.clickable && isInternalUrl) {
    return (
      <article className={cardClasses}>
        <Link href={url} className="flex-1 flex flex-col no-underline">
          {cardContent}
        </Link>
      </article>
    );
  }

  if (config.clickable && isExternalUrl) {
    return (
      <article className={cardClasses}>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 flex flex-col no-underline"
        >
          {cardContent}
        </a>
      </article>
    );
  }

  // Fallback for non-clickable cards or cards without URLs
  return (
    <article 
      className={cardClasses}
      onClick={config.clickable ? handleClick : undefined}
      role={config.clickable ? "button" : "article"}
      tabIndex={config.clickable ? 0 : undefined}
      onKeyDown={config.clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      } : undefined}
    >
      {cardContent}
    </article>
  );
}

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

function getPrimaryImage(item: UnifiedContentItem, variant: MediaVariant) {
  if (!item.media || item.media.length === 0) return null;
  
  // Try to find image matching the requested variant
  const variantImage = item.media.find(media => 
    media.type === 'image' && media.variant === variant
  );
  
  if (variantImage) return variantImage;
  
  // Fall back to primary image
  const primaryImage = item.media.find(media => 
    media.type === 'image' && media.usage === 'primary'
  );
  
  if (primaryImage) return primaryImage;
  
  // Fall back to first image
  return item.media.find(media => media.type === 'image') || null;
}

function getDisplayMetadata(item: UnifiedContentItem) {
  return {
    date: item.publishedDate || item.publication?.date || item.createdDate,
    author: item.publication?.author || item.interview?.interviewer?.name,
    publication: item.publication?.publisher || item.publication?.publication,
    venue: item.performance?.venue?.name,
    organization: item.professional?.position?.organization
  };
}

function getTypeIcon(type: ContentType) {
  switch (type) {
    case 'interview': return FaMicrophone;
    case 'article': return FaNewspaper;
    case 'review': return FaStar;
    case 'professional': return FaBriefcase;
    case 'publication': return FaNewspaper;
    case 'background': return FaGraduationCap;
    case 'project': return FaBriefcase;
    case 'bio': return FaUser;
    case 'company': return FaBuilding;
    default: return FaCompass;
  }
}

function getCardClasses(config: Required<CardDisplayOptions>, className: string): string {
  // Base card classes with responsive behavior
  let cardClasses = [
    "unified-card", // Identifier for CSS exceptions
    "bg-white rounded-lg shadow-md overflow-hidden transition-shadow",
    config.hoverable ? "hover:shadow-lg" : "",
    config.clickable ? "cursor-pointer" : "",
    // Mobile-friendly touch targets and spacing
    "touch-manipulation", // Improves touch responsiveness
  ];

  // Layout-specific responsive classes
  if (config.layout === 'horizontal') {
    cardClasses.push(
      // Mobile: vertical stack with appropriate min height for touch
      "flex flex-col min-h-40 sm:min-h-48",
      // Tablet and up: horizontal layout with consistent height for image overflow
      "md:flex-row md:min-h-32 md:h-auto" // Provide height for image to fill
    );
  } else if (config.layout === 'vertical') {
    cardClasses.push(
      "flex flex-col",
      // Responsive min heights for vertical cards
      "min-h-56 sm:min-h-64 lg:min-h-72"
    );
  } else {
    // Default to horizontal responsive behavior
    cardClasses.push(
      "flex flex-col min-h-40 sm:min-h-48 md:flex-row md:min-h-32 md:h-auto" // Consistent with horizontal
    );
  }

  cardClasses.push(className);
  
  return cardClasses.filter(Boolean).join(' ');
}

function getImageClasses(config: Required<CardDisplayOptions>): string {
  // Mobile: width 100%/height overflow, Desktop: height 100%/width overflow
  let imageClasses = [
    "relative flex-shrink-0 rounded-lg overflow-hidden"
  ];

  if (config.layout === 'horizontal') {
    // Mobile: Full width, fixed height container
    imageClasses.push(
      "w-full h-40 sm:h-48", // Constrained container
      "md:h-full md:w-48 md:mr-4" // Desktop: smaller, more reasonable width
    );
  } else if (config.layout === 'vertical') {
    // Vertical layout
    imageClasses.push("w-full h-48 sm:h-56 lg:h-64 mb-4");
  } else {
    // Default responsive behavior
    imageClasses.push(
      "w-full h-40 sm:h-48 md:h-full md:w-48 md:mr-4"
    );
  }

  return imageClasses.join(' ');
}

function getContentClasses(config: Required<CardDisplayOptions>): string {
  const baseClasses = "flex flex-col justify-between flex-1";
  
  // Responsive padding based on screen size and card size
  let paddingClasses = "";
  
  switch (config.size) {
    case 'small':
      paddingClasses = "p-3 sm:p-4";
      break;
    case 'medium':
      paddingClasses = "p-4 sm:p-5 lg:p-6";
      break;
    case 'large':
      paddingClasses = "p-5 sm:p-6 lg:p-8";
      break;
    case 'xl':
      paddingClasses = "p-6 sm:p-8 lg:p-10";
      break;
    default:
      paddingClasses = "p-4 sm:p-5 lg:p-6";
  }

  return [baseClasses, paddingClasses].join(' ');
}

function getTitleClasses(size: CardDisplayOptions['size']): string {
  // Responsive title classes based on screen size and card size
  let baseClasses = "text-sky-900 leading-tight line-clamp-2";
  
  switch (size) {
    case 'small':
      return `${baseClasses} text-sm sm:text-base font-semibold`;
    case 'medium':
      return `${baseClasses} text-base sm:text-lg lg:text-xl font-semibold`;
    case 'large':
      return `${baseClasses} text-lg sm:text-xl lg:text-2xl font-semibold`;
    case 'xl':
      return `${baseClasses} text-xl sm:text-2xl lg:text-3xl font-semibold`;
    default:
      return `${baseClasses} text-base sm:text-lg lg:text-xl font-semibold`;
  }
}

function getSummaryClasses(size: CardDisplayOptions['size']): string {
  let baseClasses = "text-sky-600 leading-relaxed mt-2 line-clamp-3";
  
  switch (size) {
    case 'small':
      return `${baseClasses} text-xs sm:text-sm`;
    case 'medium':
      return `${baseClasses} text-sm sm:text-base`;
    case 'large':
      return `${baseClasses} text-base sm:text-lg`;
    case 'xl':
      return `${baseClasses} text-lg sm:text-xl`;
    default:
      return `${baseClasses} text-sm sm:text-base`;
  }
}

function truncateSummary(summary: string, size: CardDisplayOptions['size']): string {
  const maxLengths = {
    small: 80,
    medium: 150,
    large: 250,
    xl: 400
  };
  
  const maxLength = maxLengths[size || 'medium'];
  
  if (summary.length <= maxLength) return summary;
  
  return summary.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}
