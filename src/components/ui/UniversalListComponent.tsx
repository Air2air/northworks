/**
 * UNIVERSAL LIST COMPONENT
 * Unified list component that handles all content types with props
 * Replaces: InterviewsListComponent, ContentListComponent, ProjectListComponent
 */

import React from 'react';
import { ContentCard, ContentItem } from './ContentCard';
import { ContentImage } from '@/types/content';

// Universal item interface that covers all use cases
export interface UniversalListItem {
  id: string;
  title: string;
  description?: string;
  publication?: string;
  date?: string;
  author?: string;
  thumbnail?: ContentImage;
  link: string;
  type?: 'interview' | 'review' | 'article' | 'project' | 'other';
  venue?: string;
  organization?: string;
  category?: string;
  timeframe?: string;
  tags?: string[];
}

interface UniversalListComponentProps {
  items: UniversalListItem[];
  title?: string;
  showThumbnails?: boolean;
  layout?: 'grid' | 'list';
  contentType?: 'interviews' | 'reviews' | 'articles' | 'projects';
  emptyMessage?: string;
  filterByCategory?: string;
  showFilters?: boolean;
  gridCols?: 1 | 2 | 3 | 4;
}

export default function UniversalListComponent({ 
  items, 
  title,
  showThumbnails = false,
  layout = 'list',
  contentType = 'articles',
  emptyMessage,
  filterByCategory,
  showFilters = false,
  gridCols = 3
}: UniversalListComponentProps) {
  
  // Filter items by category if specified
  const filteredItems = filterByCategory 
    ? items.filter(item => item.category === filterByCategory)
    : items;

  // Convert to ContentCard format
  const contentItems: ContentItem[] = filteredItems.map(item => ({
    metadata: {
      id: item.id,
      type: (item.type === 'other' || item.type === 'project') ? 'professional' : (item.type as any),
      category: item.category || contentType,
      subcategory: item.organization,
      status: 'published' as const
    },
    content: {
      title: item.title,
      summary: item.description,
      url: item.link
    },
    subject: item.author ? {
      people: [{
        name: item.author,
        role: 'author',
        description: item.description
      }]
    } : undefined,
    publication: {
      date: item.date || item.timeframe,
      publisher: item.publication,
      publication: item.venue
    },
    media: item.thumbnail ? {
      images: [{
        url: item.thumbnail.src || '',
        type: item.thumbnail.type || 'image',
        alt: item.thumbnail.alt || item.title
      }]
    } : undefined,
    tags: item.tags || []
  }));

  // Handle empty state
  if (!filteredItems || filteredItems.length === 0) {
    const defaultEmptyMessage = getDefaultEmptyMessage(contentType);
    return (
      <div className="text-center py-12">
        {title && <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>}
        <p className="text-gray-600">
          {emptyMessage || defaultEmptyMessage}
        </p>
      </div>
    );
  }

  const gridClass = layout === 'grid' 
    ? `grid gap-6 ${getGridColumns(gridCols)}` 
    : 'space-y-4';

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      )}
      
      <div className={gridClass}>
        {contentItems.map((item, index) => (
          <ContentCard 
            key={item.metadata.id} 
            item={item} 
            showImage={showThumbnails}
            showTags={contentType !== 'projects'}
          />
        ))}
      </div>
    </div>
  );
}

// Helper functions
function getDefaultEmptyMessage(contentType: string): string {
  switch (contentType) {
    case 'interviews':
      return 'No interviews available at this time.';
    case 'reviews':
      return 'No reviews available at this time.';
    case 'articles':
      return 'No articles available at this time.';
    case 'projects':
      return 'No projects available at this time.';
    default:
      return 'No content available at this time.';
  }
}

function getGridColumns(cols: number): string {
  switch (cols) {
    case 1: return 'grid-cols-1';
    case 2: return 'grid-cols-1 md:grid-cols-2';
    case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  }
}

// Parsing utility functions (moved from individual components)
export function parseInterviewsFromMarkdown(content: string, images: any[]): UniversalListItem[] {
  const interviews: UniversalListItem[] = [];
  
  // Parse interview content from markdown
  const sections = content.split(/#{1,3}\s+/);
  
  sections.forEach((section, index) => {
    if (section.trim() && index > 0) {
      const lines = section.trim().split('\n');
      const title = lines[0].trim();
      
      if (title) {
        const description = lines.slice(1)
          .join(' ')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
          .trim()
          .substring(0, 200);
        
        interviews.push({
          id: `interview-${index}`,
          title,
          description,
          link: `/interviews/${title.toLowerCase().replace(/\s+/g, '-')}`,
          type: 'interview',
          thumbnail: images?.[0]
        });
      }
    }
  });
  
  return interviews;
}

export function parseArticlesFromMarkdown(content: string, images: any[]): UniversalListItem[] {
  const articles: UniversalListItem[] = [];
  
  // Parse article content from markdown
  const sections = content.split(/#{1,3}\s+/);
  
  sections.forEach((section, index) => {
    if (section.trim() && index > 0) {
      const lines = section.trim().split('\n');
      const title = lines[0].trim();
      
      if (title) {
        const description = lines.slice(1)
          .join(' ')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .trim()
          .substring(0, 200);
        
        articles.push({
          id: `article-${index}`,
          title,
          description,
          link: `/articles/${title.toLowerCase().replace(/\s+/g, '-')}`,
          type: 'article',
          thumbnail: images?.[0]
        });
      }
    }
  });
  
  return articles;
}

export function parseReviewsFromMarkdown(content: string, images: any[]): UniversalListItem[] {
  const reviews: UniversalListItem[] = [];
  
  // Parse review content from markdown
  const sections = content.split(/#{1,3}\s+/);
  
  sections.forEach((section, index) => {
    if (section.trim() && index > 0) {
      const lines = section.trim().split('\n');
      const title = lines[0].trim();
      
      if (title) {
        const description = lines.slice(1)
          .join(' ')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .trim()
          .substring(0, 200);
        
        reviews.push({
          id: `review-${index}`,
          title,
          description,
          link: `/reviews/${title.toLowerCase().replace(/\s+/g, '-')}`,
          type: 'review',
          thumbnail: images?.[0]
        });
      }
    }
  });
  
  return reviews;
}

export function parseProjectsFromMarkdown(content: string, images: any[]): UniversalListItem[] {
  const projects: UniversalListItem[] = [];
  
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
          .join(' ')
          .replace(/\*\*/g, '')
          .trim()
          .substring(0, 200);
        
        // Determine category based on organization type
        let category = 'Other';
        if (organization.includes('EPA') || organization.includes('Environmental')) {
          category = 'Environmental';
        } else if (organization.includes('Nuclear') || organization.includes('NRC')) {
          category = 'Nuclear Safety';
        } else if (organization.includes('Stanford') || organization.includes('University')) {
          category = 'Academic';
        } else if (organization.includes('DOE') || organization.includes('Energy')) {
          category = 'Energy';
        }
        
        projects.push({
          id: `project-${index}`,
          title: organization,
          description,
          link: '#',
          type: 'project',
          organization,
          category,
          timeframe: extractTimeframe(section)
        });
      }
    }
  });
  
  return projects;
}

function extractTimeframe(text: string): string | undefined {
  // Look for year patterns like (1989-1994) or "1979-1982"
  const timeMatch = text.match(/\((\d{4}[\s-]*\d{4})\)|(\d{4}[\s-]*\d{4})/);
  return timeMatch ? (timeMatch[1] || timeMatch[2]) : undefined;
}
