/**
 * UNIFIED DATA LOADER
 * ===================
 * 
 * Loads normalized JSON data from the data normalization utility
 * Provides consistent data access for UnifiedCard and UnifiedList components
 */

import fs from 'fs';
import path from 'path';
import { UnifiedContentItem, ContentType, ContentCategory } from '@/schemas/unified-content-schema';

const dataDirectory = path.join(process.cwd(), 'src/data/normalized');

// ===============================================
// CORE DATA LOADING
// ===============================================

export function loadNormalizedData(filename: string): UnifiedContentItem[] {
  try {
    const filePath = path.join(dataDirectory, filename);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`Normalized data file not found: ${filename}`);
      return [];
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return data.items || [];
  } catch (error) {
    console.error(`Error loading normalized data from ${filename}:`, error);
    return [];
  }
}

// ===============================================
// CONTENT TYPE LOADERS
// ===============================================

export function getProfessionalContent(): UnifiedContentItem[] {
  return loadNormalizedData('warner-professional.json');
}

export function getPublicationContent(): UnifiedContentItem[] {
  return loadNormalizedData('warner-publications.json');
}

export function getBackgroundContent(): UnifiedContentItem[] {
  return loadNormalizedData('warner-background.json');
}

export function getWarnerRoutes() {
  try {
    const filePath = path.join(dataDirectory, 'warner-routes.json');
    
    if (!fs.existsSync(filePath)) {
      console.warn('Warner routes file not found');
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error loading Warner routes:', error);
    return null;
  }
}

export function getWarnerRoutesByCollection(collectionId: string) {
  const routes = getWarnerRoutes();
  if (!routes) return [];
  
  return routes.routes.filter((route: any) => route.parentCollection === `/${collectionId}`);
}

export function getWarnerCollections() {
  const routes = getWarnerRoutes();
  return routes?.collections || [];
}

export function getWarnerTopLevelPages() {
  const routes = getWarnerRoutes();
  return routes?.navigation?.topLevelPages || [];
}

export function getInterviewContent(): UnifiedContentItem[] {
  return loadNormalizedData('cheryl-interviews.json');
}

export function getArticleContent(): UnifiedContentItem[] {
  return loadNormalizedData('cheryl-articles.json');
}

export function getReviewContent(): UnifiedContentItem[] {
  return loadNormalizedData('cheryl-reviews.json');
}

// ===============================================
// AGGREGATED LOADERS
// ===============================================

export function getAllWarnerContent(): UnifiedContentItem[] {
  return [
    ...getProfessionalContent(),
    ...getPublicationContent(),
    ...getBackgroundContent()
  ];
}

export function getAllCherylContent(): UnifiedContentItem[] {
  return [
    ...getInterviewContent(),
    ...getArticleContent(),
    ...getReviewContent()
  ];
}

export function getAllContent(): UnifiedContentItem[] {
  return [
    ...getAllWarnerContent(),
    ...getAllCherylContent()
  ];
}

// ===============================================
// CONTENT FILTERING
// ===============================================

export function getContentByType(type: ContentType): UnifiedContentItem[] {
  const allContent = getAllContent();
  return allContent.filter(item => item.type === type);
}

export function getContentByCategory(category: ContentCategory): UnifiedContentItem[] {
  const allContent = getAllContent();
  return allContent.filter(item => item.category === category);
}

export function getContentById(id: string): UnifiedContentItem | null {
  const allContent = getAllContent();
  return allContent.find(item => item.id === id) || null;
}

// ===============================================
// LEGACY COMPATIBILITY FUNCTIONS
// ===============================================

/**
 * Legacy-compatible function for loading content by slug
 * Replaces getContentBySlug from the old content.ts system
 */
export function getContentBySlug(slug: string, processHtml: boolean = true): UnifiedContentItem | null {
  const allContent = getAllContent();
  return allContent.find(item => item.slug === slug) || null;
}

/**
 * Legacy-compatible function for getting all content slugs
 * Replaces getAllContentSlugs from the old content.ts system
 */
export function getAllContentSlugs(): string[] {
  const allContent = getAllContent();
  return allContent
    .map(item => item.slug)
    .filter((slug): slug is string => slug !== undefined);
}

// ===============================================
// UTILITIES
// ===============================================

export function getContentStats() {
  const allContent = getAllContent();
  
  const stats = {
    total: allContent.length,
    byType: {} as Record<ContentType, number>,
    byCategory: {} as Record<ContentCategory, number>,
    warner: getAllWarnerContent().length,
    cheryl: getAllCherylContent().length
  };
  
  allContent.forEach(item => {
    stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
    stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;
  });
  
  return stats;
}

// ===============================================
// LANDING PAGE NAVIGATION
// ===============================================

/**
 * Get navigation items for collection landing pages
 */
export function getLandingPageNavigation(collection: 'warner' | 'cheryl'): UnifiedContentItem[] {
  if (collection === 'warner') {
    return [
      {
        id: 'professional-nav',
        slug: 'professional',
        type: 'professional',
        category: 'professional',
        title: 'Professional Experience',
        summary: 'Consulting work, government service, and academic collaborations',
        url: '/professional',
        status: 'published',
        source: 'manual',
        tags: ['consulting', 'government', 'academic', 'professional'],
      },
      {
        id: 'publications-nav',
        slug: 'publications',
        type: 'publication',
        category: 'publications',
        title: 'Publications',
        summary: 'Books, research papers, reports, and articles',
        url: '/publications',
        status: 'published',
        source: 'manual',
        tags: ['research', 'papers', 'books', 'articles'],
      },
      {
        id: 'background-nav',
        slug: 'background',
        type: 'background',
        category: 'background',
        title: 'Background',
        summary: 'Education, training, honors, and biographical information',
        url: '/background',
        status: 'published',
        source: 'manual',
        tags: ['education', 'training', 'honors', 'biography'],
      }
    ];
  }

  if (collection === 'cheryl') {
    return [
      {
        id: 'interviews-nav',
        slug: 'interviews',
        type: 'interview',
        category: 'interviews',
        title: 'Interviews',
        summary: 'In-depth conversations with musicians, conductors, and performers',
        url: '/interviews',
        status: 'published',
        source: 'manual',
        tags: ['interviews', 'musicians', 'conductors', 'performers']
      },
      {
        id: 'reviews-nav',
        slug: 'reviews',
        type: 'review',
        category: 'reviews',
        title: 'Reviews',
        summary: 'Concert reviews, opera critiques, and performance analysis',
        url: '/reviews',
        status: 'published',
        source: 'manual',
        tags: ['reviews', 'concerts', 'opera', 'performances']
      },
      {
        id: 'articles-nav',
        slug: 'articles',
        type: 'article',
        category: 'articles',
        title: 'Articles',
        summary: 'Music journalism, features, and cultural commentary',
        url: '/articles',
        status: 'published',
        source: 'manual',
        tags: ['articles', 'journalism', 'features', 'commentary']
      }
    ];
  }

  return [];
}
