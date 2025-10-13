/**
 * Normalized page templates for consistent content page generation
 * Consolidates common patterns across different content types
 */

import { notFound } from 'next/navigation';
import { getContentBySlug } from '@/lib/content';
import { generateDetailBreadcrumbsFromFrontmatter } from '@/lib/breadcrumbUtils';
import { cleanTitle } from '@/lib/pathUtils';
import { shouldUseSectionCards } from '@/lib/sectionParser';
import { getCollectionFromSlug, CollectionType } from '@/types';
import { getDescription } from '@/lib/fieldNormalization';
import type { Metadata } from 'next';

// Content type configuration for normalized handling
export const CONTENT_TYPE_CONFIG = {
  interview: {
    routePath: '/interviews',
    routeLabel: 'Interviews',
    defaultCollection: 'cheryl' as CollectionType
  },
  article: {
    routePath: '/articles', 
    routeLabel: 'Articles',
    defaultCollection: 'cheryl' as CollectionType
  },
  review: {
    routePath: '/reviews',
    routeLabel: 'Reviews', 
    defaultCollection: 'cheryl' as CollectionType
  },
  background: {
    routePath: '/background',
    routeLabel: 'Background',
    defaultCollection: 'warner' as CollectionType
  },
  professional: {
    routePath: '/projects',
    routeLabel: 'Projects & Professional Experience',
    defaultCollection: 'warner' as CollectionType
  },
  publication: {
    routePath: '/publications',
    routeLabel: 'Publications',
    defaultCollection: 'warner' as CollectionType
  }
} as const;

export type ContentTypeKey = keyof typeof CONTENT_TYPE_CONFIG;

/**
 * Normalized content data interface for consistent processing
 */
export interface NormalizedContentData {
  slug: string;
  contentType: ContentTypeKey;
  frontmatter: any;
  content: string;
  htmlContent: string;
  collection: CollectionType;
  breadcrumbs: Array<{ label: string; href: string; active: boolean }>;
  useSectionCards: boolean;
  isWarnerContent: boolean;
}

/**
 * Load and normalize content data for any content type
 */
export async function loadNormalizedContent(slug: string, expectedType?: ContentTypeKey): Promise<NormalizedContentData | null> {
  try {
    // Get raw content for type checking
    const rawContent = getContentBySlug(slug, false);
    if (!rawContent) return null;

    // Verify content type if specified
    const contentType = rawContent.frontmatter.type as ContentTypeKey;
    if (expectedType && contentType !== expectedType) return null;

    // Validate content type exists in config
    if (!CONTENT_TYPE_CONFIG[contentType]) return null;

    // Get HTML content for rendering
    const htmlContent = getContentBySlug(slug, true);
    if (!htmlContent) return null;

    // Determine collection and other metadata
    const isWarnerContent = slug.startsWith('w-');
    const collection = getCollectionFromSlug(slug);
    const useSectionCards = shouldUseSectionCards(rawContent.content);

    // Generate standardized breadcrumbs
    const breadcrumbs = generateDetailBreadcrumbsFromFrontmatter(
      slug
    );

    return {
      slug,
      contentType,
      frontmatter: rawContent.frontmatter,
      content: rawContent.content,
      htmlContent: htmlContent.content,
      collection,
      breadcrumbs,
      useSectionCards,
      isWarnerContent
    };
  } catch (error) {
    console.error(`Error loading normalized content for slug: ${slug}`, error);
    return null;
  }
}

/**
 * Generate normalized metadata for content pages
 */
export function generateNormalizedMetadata(
  data: NormalizedContentData, 
  routePrefix?: string
): Metadata {
  const { frontmatter, contentType, slug, isWarnerContent } = data;
  const config = CONTENT_TYPE_CONFIG[contentType];
  
  const title = cleanTitle(frontmatter.title);
  const authorName = isWarnerContent ? 'D. Warner North' : 'Cheryl North';
  
  // Generate contextual description using normalized field access
  const getContextualDescription = () => {
    const normalizedDescription = getDescription(frontmatter);
    if (normalizedDescription) return normalizedDescription;
    
    const publicationInfo = frontmatter.publication?.outlet || frontmatter.publication?.publisher;
    
    switch (contentType) {
      case 'interview':
        return `Interview ${publicationInfo ? `published in ${publicationInfo}` : `by ${authorName}`}`;
      case 'article':
        return `Article ${publicationInfo ? `published in ${publicationInfo}` : `by ${authorName}`}`;
      case 'review':
        return `Review ${publicationInfo ? `published in ${publicationInfo}` : `by ${authorName}`}`;
      case 'professional':
        return `Professional work by ${authorName}`;
      case 'publication':
        return `Publication by ${authorName}`;
      case 'background':
        return `Background information about ${authorName}`;
      default:
        return `Content by ${authorName}`;
    }
  };

  // Extract keywords/tags consistently
  const getKeywords = () => {
    if (frontmatter.tags && Array.isArray(frontmatter.tags)) return frontmatter.tags;
    if (frontmatter.keywords && Array.isArray(frontmatter.keywords)) return frontmatter.keywords;
    if (frontmatter.subjects && Array.isArray(frontmatter.subjects)) return frontmatter.subjects;
    return [];
  };

  const description = getContextualDescription();
  const keywords = getKeywords();
  const fullTitle = `${title} | ${authorName} | NorthWorks`;

  return {
    title: fullTitle,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'NorthWorks'
    }
  };
}

/**
 * Check if a slug should use direct routing (w- prefixed content)
 */
export function shouldUseDirectRouting(slug: string): boolean {
  return slug.startsWith('w-');
}

/**
 * Get the appropriate route path for content
 */
export function getContentRoutePath(contentType: ContentTypeKey, slug: string): string {
  if (shouldUseDirectRouting(slug)) {
    return `/${slug}`;
  }
  return `${CONTENT_TYPE_CONFIG[contentType].routePath}/${slug}`;
}

/**
 * Generate static params for a specific content type
 */
export function generateContentTypeParams(contentType: ContentTypeKey, allSlugs: string[]) {
  return allSlugs
    .filter(slug => {
      const content = getContentBySlug(slug, false);
      return content?.frontmatter.type === contentType;
    })
    .map(slug => ({ slug }));
}
