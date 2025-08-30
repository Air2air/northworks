/**
 * UNIFIED DATA LOADER
 * ===================
 * 
 * Simplified data access using frontmatter from markdown files
 * Provides navigation data for landing pages
 */

import { UnifiedContentItem, ContentType, ContentCategory } from '@/schemas/unified-content-schema';
import { getContentByType as getOriginalContentByType } from '@/lib/content';
import { getContentBySlug as getOriginalContentBySlug } from '@/lib/content';
import { ContentData } from '@/types';

// ===============================================
// CONTENT ADAPTERS
// ===============================================

/**
 * Convert ContentData to UnifiedContentItem
 */
function convertContentDataToUnified(data: ContentData): UnifiedContentItem {
  // Convert images from frontmatter to media format
  const media = data.frontmatter.images?.map((img: any) => ({
    url: img.src,
    type: 'image' as const,
    alt: img.alt || data.frontmatter.title,
    width: img.width || 300,
    height: img.height || 200
  }));

  return {
    id: data.frontmatter.id || data.slug,
    slug: data.slug,
    type: data.frontmatter.type as ContentType,
    category: (data.frontmatter.type + 's') as ContentCategory, // interview -> interviews
    title: data.frontmatter.title,
    summary: data.frontmatter.description,
    url: `/${data.frontmatter.type}s/${data.slug}`, // interviews/slug, articles/slug
    status: 'published' as const,
    source: 'markdown' as const,
    tags: data.frontmatter.tags || [],
    media: media,
    // Store original frontmatter in legacy property for backward compatibility
    legacy: {
      originalData: data.frontmatter
    }
  };
}

/**
 * Get content by type - unified version
 */
export function getContentByType(type: ContentType): UnifiedContentItem[] {
  const originalContent = getOriginalContentByType(type);
  return originalContent.map(convertContentDataToUnified);
}

/**
 * Get all content across all types
 */
export function getAllContent(): UnifiedContentItem[] {
  const interviews = getContentByType('interview');
  const articles = getContentByType('article');
  const reviews = getContentByType('review');
  
  return [...interviews, ...articles, ...reviews];
}

// ===============================================
// LANDING PAGE NAVIGATION
// ===============================================

/**
 * Get navigation items for collection landing pages using frontmatter (dynamic approach)
 */
export function getLandingPageNavigation(collection: 'warner' | 'cheryl'): UnifiedContentItem[] {
  try {
    const slug = collection === 'warner' ? 'w-main' : 'c-main';
    const mainContent = getOriginalContentBySlug(slug);
    
    if (!mainContent?.frontmatter) {
      console.warn(`No frontmatter found for ${slug}`);
      return [];
    }
    
    const navigation = mainContent.frontmatter.navigation || {};
    const images = mainContent.frontmatter.images || [];
    
    // Helper function to find image by section
    const getImageBySection = (section: string) => {
      const image = images.find((img: any) => img.section === section);
      return image ? [{
        url: image.src,
        type: 'image' as const,
        alt: image.alt || `${section} image`,
        width: image.width || 400,
        height: image.height || 300
      }] : undefined;
    };

    // Generate navigation items dynamically from frontmatter
    return Object.entries(navigation).map(([sectionKey, navData]: [string, any]) => {
      // Determine content type based on section key
      const getContentType = (key: string): ContentType => {
        if (key.includes('professional')) return 'professional';
        if (key.includes('publication')) return 'publication';
        if (key.includes('background')) return 'background';
        if (key.includes('interview')) return 'interview';
        if (key.includes('review')) return 'review';
        if (key.includes('article')) return 'article';
        if (key.includes('northworks') || key.includes('about')) return 'company';
        return 'other'; // fallback
      };

      const contentType = getContentType(sectionKey);
      
      return {
        id: `${sectionKey}-nav`,
        slug: sectionKey,
        type: contentType,
        category: contentType as ContentCategory,
        title: navData.title || sectionKey,
        summary: navData.summary || '',
        url: navData.url || `/${collection}/${sectionKey}`,
        status: 'published' as const,
        source: 'manual' as const,
        tags: navData.tags || [],
        media: getImageBySection(sectionKey)
      };
    });
  } catch (error) {
    console.error(`Error generating navigation for ${collection}:`, error);
    return [];
  }
}
