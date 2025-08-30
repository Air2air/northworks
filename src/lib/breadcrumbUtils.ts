/**
 * Simple breadcrumb generation from frontmatter
 */

import { getContentBySlug } from './content';
import { getPageTitle } from './fieldNormalization';
import { BreadcrumbItem } from '@/types';

/**
 * Generate breadcrumbs from any page slug
 */
export function generateBreadcrumbsFromFrontmatter(slug: string): BreadcrumbItem[] {
  const content = getContentBySlug(slug, false);
  if (!content?.frontmatter) {
    return [{ label: 'Home', href: '/', active: true }];
  }

  const title = getPageTitle(content.frontmatter);
  const type = content.frontmatter.type;
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/', active: false }
  ];

  // Add parent based on content type
  const parentMap: Record<string, { path: string; label: string }> = {
    'professional': { path: '/warner', label: 'D. Warner North' },
    'publication': { path: '/warner', label: 'D. Warner North' },
    'background': { path: '/warner', label: 'D. Warner North' },
    'company': { path: '/warner', label: 'D. Warner North' },
    'interview': { path: '/cheryl', label: 'Cheryl North' },
    'article': { path: '/cheryl', label: 'Cheryl North' },
    'review': { path: '/cheryl', label: 'Cheryl North' },
    'bio': { path: '/cheryl', label: 'Cheryl North' }
  };

  const parent = parentMap[type];
  if (parent) {
    breadcrumbs.push({
      label: parent.label,
      href: parent.path,
      active: false
    });
  }

  breadcrumbs.push({
    label: title,
    href: `/${slug}`,
    active: true
  });

  return breadcrumbs;
}

/**
 * Generate breadcrumbs for content detail pages
 */
export function generateDetailBreadcrumbsFromFrontmatter(contentSlug: string): BreadcrumbItem[] {
  return generateBreadcrumbsFromFrontmatter(contentSlug);
}

/**
 * Generate breadcrumbs for collection pages (e.g., /warner, /cheryl)
 */
export function generateCollectionBreadcrumbs(collection: 'warner' | 'cheryl'): BreadcrumbItem[] {
  const configs = {
    warner: { label: 'D. Warner North', href: '/warner' },
    cheryl: { label: 'Cheryl North', href: '/cheryl' }
  };

  const config = configs[collection];
  
  return [
    { label: 'Home', href: '/', active: false },
    { label: config.label, href: config.href, active: true }
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
