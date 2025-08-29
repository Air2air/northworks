/**
 * UNIFIED DATA LOADER
 * ===================
 * 
 * Simplified data access using frontmatter from markdown files
 * Provides navigation data for landing pages
 */

import { UnifiedContentItem, ContentType, ContentCategory } from '@/schemas/unified-content-schema';

// ===============================================
// LANDING PAGE NAVIGATION
// ===============================================

/**
 * Get navigation items for collection landing pages using frontmatter (simplified approach)
 */
export function getLandingPageNavigation(collection: 'warner' | 'cheryl'): UnifiedContentItem[] {
  if (collection === 'warner') {
    return [
      {
        id: 'professional-nav',
        slug: 'professional',
        type: 'professional' as ContentType,
        category: 'professional' as ContentCategory,
        title: 'Professional Experience',
        summary: 'Consulting work, government service, and academic collaborations',
        url: '/professional',
        status: 'published' as const,
        source: 'manual' as const,
        tags: ['consulting', 'government', 'academic', 'professional']
      },
      {
        id: 'publications-nav',
        slug: 'publications',
        type: 'publication' as ContentType,
        category: 'publications' as ContentCategory,
        title: 'Publications',
        summary: 'Books, research papers, reports, and articles',
        url: '/publications',
        status: 'published' as const,
        source: 'manual' as const,
        tags: ['research', 'papers', 'books', 'articles']
      },
      {
        id: 'background-nav',
        slug: 'background',
        type: 'background' as ContentType,
        category: 'background' as ContentCategory,
        title: 'Background',
        summary: 'Education, training, honors, and biographical information',
        url: '/background',
        status: 'published' as const,
        source: 'manual' as const,
        tags: ['education', 'training', 'honors', 'biography']
      }
    ];
  }

  if (collection === 'cheryl') {
    return [
      {
        id: 'interviews-nav',
        slug: 'interviews',
        type: 'interview' as ContentType,
        category: 'interviews' as ContentCategory,
        title: 'Interviews',
        summary: 'In-depth conversations with musicians, conductors, and performers',
        url: '/interviews',
        status: 'published' as const,
        source: 'manual' as const,
        tags: ['interviews', 'musicians', 'conductors', 'performers']
      },
      {
        id: 'reviews-nav',
        slug: 'reviews',
        type: 'review' as ContentType,
        category: 'reviews' as ContentCategory,
        title: 'Reviews',
        summary: 'Concert reviews, opera critiques, and performance analysis',
        url: '/reviews',
        status: 'published' as const,
        source: 'manual' as const,
        tags: ['reviews', 'concerts', 'opera', 'performances']
      },
      {
        id: 'articles-nav',
        slug: 'articles',
        type: 'article' as ContentType,
        category: 'articles' as ContentCategory,
        title: 'Articles',
        summary: 'Music journalism, features, and cultural commentary',
        url: '/articles',
        status: 'published' as const,
        source: 'manual' as const,
        tags: ['articles', 'journalism', 'features', 'commentary']
      }
    ];
  }

  return [];
}
