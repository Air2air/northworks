/**
 * Simple breadcrumb generation from frontmatter
 * 
 * SIMPLIFIED APPROACH:
 * - Uses slug prefix (w-, c-) to determine collection instead of type field
 * - Type field is now optional and only used for content classification/filtering
 */

import { getContentBySlug } from './content';
import { getPageTitle } from './fieldNormalization';
import { BreadcrumbItem } from '@/types';

/**
 * Generate breadcrumbs from any page slug
 * Automatically determines collection from slug prefix
 */
export function generateBreadcrumbsFromFrontmatter(slug: string): BreadcrumbItem[] {
  const content = getContentBySlug(slug, false);
  if (!content?.frontmatter) {
    return [{ label: 'Home', href: '/', active: true }];
  }

  const title = getPageTitle(content.frontmatter);
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/', active: false }
  ];

  // Determine collection parent from slug prefix instead of type field
  if (slug.startsWith('w-')) {
    breadcrumbs.push({
      label: 'D. Warner North',
      href: '/warner',
      active: false
    });
  } else if (slug.startsWith('c-')) {
    breadcrumbs.push({
      label: 'Cheryl North',
      href: '/cheryl',
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
