/**
 * BREADCRUMB UTILITIES
 * ===================
 * 
 * Centralized breadcrumb generation to eliminate duplication across 10+ route pages
 * Provides smart breadcrumb generation based on content types and collections
 */

import { CollectionType } from '@/types';

export interface BreadcrumbItem {
  label: string;
  href: string;
  active: boolean;
}

// ===============================================
// BREADCRUMB CONFIGURATION
// ===============================================

interface BreadcrumbConfig {
  parentPath: string;
  parentLabel: string;
  grandParentPath?: string;
  grandParentLabel?: string;
}

const CONTENT_TYPE_CONFIGS: Record<string, BreadcrumbConfig> = {
  // Warner content types
  professional: {
    parentPath: '/professional',
    parentLabel: 'Professional Experience',
    grandParentPath: '/warner',
    grandParentLabel: 'D. Warner North'
  },
  project: {
    parentPath: '/professional',
    parentLabel: 'Professional Experience',
    grandParentPath: '/warner',
    grandParentLabel: 'D. Warner North'
  },
  publication: {
    parentPath: '/publications',
    parentLabel: 'Publications',
    grandParentPath: '/warner',
    grandParentLabel: 'D. Warner North'
  },
  background: {
    parentPath: '/background',
    parentLabel: 'Background',
    grandParentPath: '/warner',
    grandParentLabel: 'D. Warner North'
  },
  
  // Cheryl content types
  interview: {
    parentPath: '/interviews',
    parentLabel: 'Interviews',
    grandParentPath: '/cheryl',
    grandParentLabel: 'Cheryl North'
  },
  article: {
    parentPath: '/articles',
    parentLabel: 'Articles',
    grandParentPath: '/cheryl',
    grandParentLabel: 'Cheryl North'
  },
  review: {
    parentPath: '/reviews',
    parentLabel: 'Reviews',
    grandParentPath: '/cheryl',
    grandParentLabel: 'Cheryl North'
  }
};

const COLLECTION_CONFIGS: Record<CollectionType, BreadcrumbConfig> = {
  warner: {
    parentPath: '/warner',
    parentLabel: 'D. Warner North'
  },
  cheryl: {
    parentPath: '/cheryl',
    parentLabel: 'Cheryl North'
  },
  global: {
    parentPath: '/',
    parentLabel: 'Home'
  }
};

// ===============================================
// BREADCRUMB GENERATORS
// ===============================================

/**
 * Generate breadcrumbs for a content listing page (e.g., /interviews, /professional)
 */
export function generateListingBreadcrumbs(contentType: string): BreadcrumbItem[] {
  const config = CONTENT_TYPE_CONFIGS[contentType];
  
  if (!config) {
    return [
      { label: 'Home', href: '/', active: false },
      { label: 'Content', href: '#', active: true }
    ];
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/', active: false }
  ];

  if (config.grandParentPath && config.grandParentLabel) {
    breadcrumbs.push({
      label: config.grandParentLabel,
      href: config.grandParentPath,
      active: false
    });
  }

  breadcrumbs.push({
    label: config.parentLabel,
    href: config.parentPath,
    active: true
  });

  return breadcrumbs;
}

/**
 * Generate breadcrumbs for a content detail page (e.g., /interviews/specific-interview)
 */
export function generateDetailBreadcrumbs(
  contentType: string,
  itemTitle: string,
  itemSlug: string
): BreadcrumbItem[] {
  const config = CONTENT_TYPE_CONFIGS[contentType];
  
  if (!config) {
    return [
      { label: 'Home', href: '/', active: false },
      { label: 'Content', href: '#', active: false },
      { label: itemTitle, href: `#`, active: true }
    ];
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/', active: false }
  ];

  if (config.grandParentPath && config.grandParentLabel) {
    breadcrumbs.push({
      label: config.grandParentLabel,
      href: config.grandParentPath,
      active: false
    });
  }

  breadcrumbs.push({
    label: config.parentLabel,
    href: config.parentPath,
    active: false
  });

  breadcrumbs.push({
    label: itemTitle,
    href: `${config.parentPath}/${itemSlug}`,
    active: true
  });

  return breadcrumbs;
}

/**
 * Generate breadcrumbs for collection pages (e.g., /warner, /cheryl)
 */
export function generateCollectionBreadcrumbs(collection: CollectionType): BreadcrumbItem[] {
  const config = COLLECTION_CONFIGS[collection];
  
  if (collection === 'global') {
    return [
      { label: 'Home', href: '/', active: true }
    ];
  }

  return [
    { label: 'Home', href: '/', active: false },
    { label: config.parentLabel, href: config.parentPath, active: true }
  ];
}

/**
 * Generate breadcrumbs for special pages (e.g., /search)
 */
export function generateSpecialBreadcrumbs(pageType: 'search' | 'about'): BreadcrumbItem[] {
  const configs = {
    search: { label: 'Search', href: '/search' },
    about: { label: 'About', href: '/about' }
  };

  const config = configs[pageType];
  
  return [
    { label: 'Home', href: '/', active: false },
    { label: config.label, href: config.href, active: true }
  ];
}

/**
 * Generate breadcrumbs automatically based on URL path
 */
export function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) {
    return [{ label: 'Home', href: '/', active: true }];
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/', active: false }
  ];

  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Map common segments to readable labels
    const labelMap: Record<string, string> = {
      warner: 'D. Warner North',
      cheryl: 'Cheryl North',
      interviews: 'Interviews',
      articles: 'Articles',
      reviews: 'Reviews',
      professional: 'Professional Experience',
      publications: 'Publications',
      background: 'Background',
      search: 'Search'
    };

    const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    breadcrumbs.push({
      label,
      href: currentPath,
      active: isLast
    });
  });

  return breadcrumbs;
}

// ===============================================
// HELPER FUNCTIONS
// ===============================================

/**
 * Clean title for breadcrumb display (remove common prefixes, truncate if needed)
 */
export function cleanBreadcrumbTitle(title: string, maxLength: number = 50): string {
  // Remove common prefixes
  const cleanedTitle = title
    .replace(/^(Interview with|Review of|Article about)\s+/i, '')
    .replace(/^(A|An|The)\s+/i, '');
  
  // Truncate if too long
  if (cleanedTitle.length > maxLength) {
    return cleanedTitle.substring(0, maxLength - 3) + '...';
  }
  
  return cleanedTitle;
}

/**
 * Determine content type from slug or path
 */
export function getContentTypeFromPath(path: string): string | null {
  const segments = path.split('/').filter(Boolean);
  
  if (segments.length === 0) return null;
  
  const firstSegment = segments[0];
  
  // Direct mapping from path to content type
  const pathToContentType: Record<string, string> = {
    interviews: 'interview',
    articles: 'article', 
    reviews: 'review',
    professional: 'professional',
    publications: 'publication',
    background: 'background'
  };
  
  return pathToContentType[firstSegment] || null;
}
