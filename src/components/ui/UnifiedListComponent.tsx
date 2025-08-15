/**
 * UnifiedListComponent - Single reusable list component for all content types
 * Handles interviews, articles, reviews, projects, and professional lists based on frontmatter.type
 */

import React from 'react';
import { ContentImage } from '@/types/content';
import Image from 'next/image';
import Link from 'next/link';

// Unified interface that covers all content types
export interface UnifiedListItem {
  id: string;
  title?: string;
  name?: string; // For interviews
  description?: string;
  publication?: string;
  date?: string;
  author?: string;
  thumbnail?: ContentImage;
  link: string;
  type?: 'interview' | 'review' | 'article' | 'project' | 'professional' | 'other';
  venue?: string;
  organization?: string;
  timeframe?: string;
  category?: string;
  logo?: string;
}

interface UnifiedListComponentProps {
  items: UnifiedListItem[];
  contentType: 'interview' | 'article' | 'review' | 'project' | 'professional';
  title?: string;
  showThumbnails?: boolean;
  layout?: 'grid' | 'list';
  showDescription?: boolean;
}

export default function UnifiedListComponent({ 
  items, 
  contentType,
  title,
  showThumbnails = true,
  layout = 'grid',
  showDescription = true
}: UnifiedListComponentProps) {
  
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No {getContentTypeLabel(contentType)} Found
        </h3>
        <p className="text-gray-600">
          Check back later for new content.
        </p>
      </div>
    );
  }

  const layoutClasses = layout === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'space-y-6';

  return (
    <div className="space-y-8">
      {title && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        </div>
      )}

      <div className={layoutClasses}>
        {items.map((item) => (
          <UnifiedListItem
            key={item.id}
            item={item}
            contentType={contentType}
            showThumbnails={showThumbnails}
            layout={layout}
            showDescription={showDescription}
          />
        ))}
      </div>
    </div>
  );
}

// Individual item component
interface UnifiedListItemProps {
  item: UnifiedListItem;
  contentType: 'interview' | 'article' | 'review' | 'project' | 'professional';
  showThumbnails: boolean;
  layout: 'grid' | 'list';
  showDescription: boolean;
}

function UnifiedListItem({ 
  item, 
  contentType, 
  showThumbnails, 
  layout,
  showDescription 
}: UnifiedListItemProps) {
  const displayTitle = item.title || item.name || 'Untitled';
  const isGridLayout = layout === 'grid';

  return (
    <Link href={item.link} className="block group">
      <div className={`
        bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 
        border border-gray-200 hover:border-gray-300 overflow-hidden
        ${isGridLayout ? 'h-full' : 'flex items-start gap-4 p-4'}
      `}>
        
        {/* Thumbnail */}
        {showThumbnails && item.thumbnail && (
          <div className={`
            flex-shrink-0 overflow-hidden
            ${isGridLayout ? 'w-full h-48' : 'w-24 h-24 rounded-lg'}
          `}>
            <Image
              src={item.thumbnail.src}
              alt={item.thumbnail.alt || displayTitle}
              width={isGridLayout ? 400 : 96}
              height={isGridLayout ? 300 : 96}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}

        {/* Content */}
        <div className={`
          ${isGridLayout ? 'p-6' : 'flex-1 min-w-0'}
        `}>
          {/* Title */}
          <h3 className={`
            font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2
            ${isGridLayout ? 'text-lg' : 'text-base'}
          `}>
            {displayTitle}
          </h3>

          {/* Content type specific metadata */}
          {renderContentMetadata(item, contentType)}

          {/* Description */}
          {showDescription && item.description && (
            <p className={`
              text-gray-600 leading-relaxed
              ${isGridLayout ? 'text-sm mt-3' : 'text-sm mt-2'}
            `}>
              {truncateText(item.description, isGridLayout ? 120 : 200)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

// Render metadata based on content type
function renderContentMetadata(item: UnifiedListItem, contentType: string) {
  switch (contentType) {
    case 'interview':
      return (
        <div className="text-sm text-gray-500 space-y-1">
          {item.publication && <div><strong>Publication:</strong> {item.publication}</div>}
          {item.date && <div><strong>Date:</strong> {item.date}</div>}
        </div>
      );
    
    case 'article':
    case 'review':
      return (
        <div className="text-sm text-gray-500 space-y-1">
          {item.author && <div><strong>Author:</strong> {item.author}</div>}
          {item.publication && <div><strong>Publication:</strong> {item.publication}</div>}
          {item.date && <div><strong>Date:</strong> {item.date}</div>}
          {item.venue && <div><strong>Venue:</strong> {item.venue}</div>}
        </div>
      );
    
    case 'project':
      return (
        <div className="text-sm text-gray-500 space-y-1">
          {item.organization && <div><strong>Organization:</strong> {item.organization}</div>}
          {item.timeframe && <div><strong>Timeframe:</strong> {item.timeframe}</div>}
          {item.category && <div><strong>Category:</strong> {item.category}</div>}
        </div>
      );
    
    case 'professional':
      return (
        <div className="text-sm text-gray-500 space-y-1">
          {item.organization && <div><strong>Organization:</strong> {item.organization}</div>}
          {item.category && <div><strong>Category:</strong> {item.category}</div>}
        </div>
      );
    
    default:
      return null;
  }
}

// Helper functions
function getContentTypeLabel(contentType: string): string {
  const labels = {
    interview: 'Interviews',
    article: 'Articles', 
    review: 'Reviews',
    project: 'Projects',
    professional: 'Professional Items'
  };
  return labels[contentType as keyof typeof labels] || 'Items';
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

// Parsing functions for different content types (migrated from existing components)
export function parseInterviewsFromMarkdown(content: string, images: ContentImage[]): UnifiedListItem[] {
  const interviews: UnifiedListItem[] = [];
  const lines = content.split('\n');
  let currentInterview: Partial<UnifiedListItem> | null = null;
  let inImageList = false;
  let description: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('### ')) {
      if (currentInterview) {
        interviews.push({
          ...currentInterview,
          description: description.join(' ').trim(),
          type: 'interview'
        } as UnifiedListItem);
      }

      const name = line.replace('### ', '').trim();
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      currentInterview = {
        id: slug,
        name: name,
        link: `/interviews/${slug}`,
        thumbnail: images.find(img => 
          img.src.toLowerCase().includes(name.toLowerCase().split(' ')[0]) ||
          img.alt?.toLowerCase().includes(name.toLowerCase())
        )
      };
      description = [];
      inImageList = false;
    } else if (line.startsWith('**Publication:**')) {
      if (currentInterview) {
        currentInterview.publication = line.replace('**Publication:**', '').trim();
      }
    } else if (line.startsWith('**Date:**')) {
      if (currentInterview) {
        currentInterview.date = line.replace('**Date:**', '').trim();
      }
    } else if (line.includes('![') && line.includes('](')) {
      inImageList = true;
    } else if (line === '' && inImageList) {
      inImageList = false;
    } else if (!inImageList && line && !line.startsWith('**') && currentInterview) {
      description.push(line);
    }
  }

  if (currentInterview) {
    interviews.push({
      ...currentInterview,
      description: description.join(' ').trim(),
      type: 'interview'
    } as UnifiedListItem);
  }

  return interviews;
}

export function parseArticlesFromMarkdown(content: string, images: ContentImage[]): UnifiedListItem[] {
  const articles: UnifiedListItem[] = [];
  const sections = content.split(/(?=^###\s)/m);

  sections.forEach(section => {
    if (!section.trim()) return;

    const lines = section.trim().split('\n');
    const titleLine = lines.find(line => line.startsWith('### '));
    
    if (!titleLine) return;

    const title = titleLine.replace('### ', '').trim();
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const article: Partial<UnifiedListItem> = {
      id: slug,
      title: title,
      link: `/articles/${slug}`,
      type: 'article'
    };

    // Parse metadata
    lines.forEach(line => {
      if (line.startsWith('**Author:**')) {
        article.author = line.replace('**Author:**', '').trim();
      } else if (line.startsWith('**Publication:**')) {
        article.publication = line.replace('**Publication:**', '').trim();
      } else if (line.startsWith('**Date:**')) {
        article.date = line.replace('**Date:**', '').trim();
      }
    });

    // Get description (first non-metadata paragraph)
    const descriptionLines = lines.filter(line => 
      !line.startsWith('###') && 
      !line.startsWith('**') && 
      !line.includes('![') &&
      line.trim()
    );
    article.description = descriptionLines.slice(0, 3).join(' ').trim();

    // Find thumbnail
    article.thumbnail = images.find(img => 
      img.src.toLowerCase().includes(title.toLowerCase().split(' ')[0]) ||
      img.alt?.toLowerCase().includes(title.toLowerCase())
    );

    if (article.title) {
      articles.push(article as UnifiedListItem);
    }
  });

  return articles;
}

export function parseReviewsFromMarkdown(content: string, images: ContentImage[]): UnifiedListItem[] {
  const reviews: UnifiedListItem[] = [];
  const sections = content.split(/(?=^###\s)/m);

  sections.forEach(section => {
    if (!section.trim()) return;

    const lines = section.trim().split('\n');
    const titleLine = lines.find(line => line.startsWith('### '));
    
    if (!titleLine) return;

    const title = titleLine.replace('### ', '').trim();
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const review: Partial<UnifiedListItem> = {
      id: slug,
      title: title,
      link: `/reviews/${slug}`,
      type: 'review'
    };

    // Parse metadata
    lines.forEach(line => {
      if (line.startsWith('**Author:**')) {
        review.author = line.replace('**Author:**', '').trim();
      } else if (line.startsWith('**Publication:**')) {
        review.publication = line.replace('**Publication:**', '').trim();
      } else if (line.startsWith('**Date:**')) {
        review.date = line.replace('**Date:**', '').trim();
      } else if (line.startsWith('**Venue:**')) {
        review.venue = line.replace('**Venue:**', '').trim();
      }
    });

    // Get description
    const descriptionLines = lines.filter(line => 
      !line.startsWith('###') && 
      !line.startsWith('**') && 
      !line.includes('![') &&
      line.trim()
    );
    review.description = descriptionLines.slice(0, 3).join(' ').trim();

    // Find thumbnail
    review.thumbnail = images.find(img => 
      img.src.toLowerCase().includes(title.toLowerCase().split(' ')[0]) ||
      img.alt?.toLowerCase().includes(title.toLowerCase())
    );

    if (review.title) {
      reviews.push(review as UnifiedListItem);
    }
  });

  return reviews;
}

export function parseProjectsFromMarkdown(content: string, images: any[]): UnifiedListItem[] {
  const projects: UnifiedListItem[] = [];
  
  // Split content by logo markers and project descriptions
  const sections = content.split(/!\[.*?\]\(images\/logo_.*?\)/);
  
  sections.forEach((section, index) => {
    if (section.trim() && index > 0) {
      const lines = section.trim().split('\n');
      const firstLine = lines[0];
      
      // Extract organization and description
      const orgMatch = firstLine.match(/\*\*(.*?)\*\*/);
      const organization = orgMatch ? orgMatch[1].trim() : '';
      
      if (organization) {
        // Get description from remaining lines
        const description = lines.slice(1)
          .filter(line => line.trim() && !line.startsWith('*'))
          .join(' ')
          .trim();
        
        // Create slug for link
        const slug = organization.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        
        projects.push({
          id: slug,
          title: organization,
          organization: organization,
          description: description,
          link: `/warner/projects/${slug}`,
          type: 'project',
          category: 'project'
        });
      }
    }
  });
  
  return projects;
}
