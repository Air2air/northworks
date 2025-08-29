import { getContentBySlug } from './content';
import { getDescription, getKeywords } from './fieldNormalization';
import type { Metadata } from 'next';

/**
 * METADATA GENERATION UTILITIES
 * =============================
 * 
 * Centralized metadata generation that pulls from frontmatter when available,
 * eliminating redundancy between page metadata and content frontmatter.
 */

interface MetadataConfig {
  defaultTitle?: string;
  defaultDescription?: string;
  defaultKeywords?: string[];
  siteName?: string;
  type?: 'website' | 'article' | 'profile';
  collection?: 'warner' | 'cheryl' | 'global';
}

/**
 * Generate metadata from content frontmatter
 */
export function generateMetadataFromContent(
  slug: string, 
  config: MetadataConfig = {}
): Metadata {
  const content = getContentBySlug(slug, false);
  
  if (!content?.frontmatter) {
    return generateFallbackMetadata(config);
  }

  const { frontmatter } = content;
  const {
    defaultTitle = 'NorthWorks',
    defaultDescription = '',
    defaultKeywords = [],
    siteName = 'NorthWorks',
    type = 'website',
    collection = 'global'
  } = config;

  // Build title with hierarchy
  const title = buildPageTitle(frontmatter.title, collection, defaultTitle);
  
  // Get description using normalized field access
  const description = getDescription(frontmatter) || defaultDescription;

  // Get keywords using normalized field access with defaults
  const normalizedKeywords = getKeywords(frontmatter);
  const keywords = normalizedKeywords.length > 0 
    ? [...normalizedKeywords, ...defaultKeywords].filter((keyword, index, arr) => arr.indexOf(keyword) === index)
    : defaultKeywords;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: frontmatter.title || title,
      description,
      type,
      siteName
    }
  };
}

/**
 * Generate metadata for collection landing pages
 */
export function generateCollectionMetadata(collection: 'warner' | 'cheryl'): Metadata {
  const slugMap = {
    warner: 'w-main',
    cheryl: 'c-main'
  };
  
  const content = getContentBySlug(slugMap[collection], false);
  
  if (!content?.frontmatter) {
    // Fallback to hardcoded values if frontmatter unavailable
    const fallbacks = {
      warner: {
        title: 'D. Warner North - Risk Analysis Consultant | NorthWorks',
        description: 'Dr. D. Warner North is principal scientist of NorthWorks, a leading expert in risk analysis and nuclear waste issues with over 50 years of experience.',
        keywords: ['risk analysis', 'nuclear waste', 'consulting', 'Stanford University', 'EPA Science Advisory Board', 'decision analysis'],
      },
      cheryl: {
        title: 'Cheryl North - Classical Music Journalist | NorthWorks',
        description: 'Cheryl North is a noted music columnist for Classical Voice of North Carolina and ANG Newspapers, specializing in opera, symphony, and chamber music interviews.',
        keywords: ['classical music', 'opera', 'music journalism', 'interviews', 'music reviews', 'symphony', 'chamber music'],
      }
    };
    
    const fallback = fallbacks[collection];
    return {
      title: fallback.title,
      description: fallback.description,
      keywords: fallback.keywords,
      openGraph: {
        title: fallback.title.replace(' | NorthWorks', ''),
        description: fallback.description,
        type: 'profile',
        siteName: 'NorthWorks'
      }
    };
  }

  const { frontmatter } = content;
  const title = buildPageTitle(frontmatter.title, collection, 'NorthWorks');
  
  return {
    title,
    description: getDescription(frontmatter) || '',
    keywords: getKeywords(frontmatter),
    openGraph: {
      title: frontmatter.title || title,
      description: getDescription(frontmatter) || '',
      type: 'profile',
      siteName: 'NorthWorks'
    }
  };
}

/**
 * Generate metadata for content listing pages (articles, interviews, etc.)
 */
export function generateListingMetadata(
  contentType: string,
  collection: 'warner' | 'cheryl' = 'cheryl'
): Metadata {
  const content = getContentBySlug(contentType, false);
  
  if (!content?.frontmatter) {
    // Fallback to hardcoded values if frontmatter unavailable
    const fallbacks = {
      articles: {
        title: 'Articles',
        description: 'Music journalism, features, and cultural commentary',
        keywords: ['articles', 'journalism', 'features', 'commentary']
      },
      interviews: {
        title: 'Interviews', 
        description: 'In-depth conversations with musicians, conductors, and performers',
        keywords: ['interviews', 'musicians', 'conductors', 'performers']
      },
      reviews: {
        title: 'Reviews',
        description: 'Concert reviews, opera critiques, and performance analysis', 
        keywords: ['reviews', 'concerts', 'opera', 'performances']
      },
      background: {
        title: 'Background',
        description: 'Background information, education, and biographical details',
        keywords: ['biography', 'education', 'background', 'career history']
      },
      professional: {
        title: 'Professional Experience',
        description: 'Consulting work, government service, and academic collaborations',
        keywords: ['consulting', 'government', 'academic', 'professional']
      },
      publications: {
        title: 'Publications',
        description: 'Books, research papers, reports, and articles',
        keywords: ['research', 'papers', 'books', 'articles', 'publications']
      }
    };
    
    const fallback = fallbacks[contentType as keyof typeof fallbacks];
    if (!fallback) {
      return generateFallbackMetadata({});
    }
    
    const collectionName = collection === 'warner' ? 'D. Warner North' : 'Cheryl North';
    const title = `${fallback.title} | ${collectionName} | NorthWorks`;
    
    return {
      title,
      description: fallback.description,
      keywords: fallback.keywords,
      openGraph: {
        title: `${fallback.title} | ${collectionName}`,
        description: fallback.description,
        type: 'website',
        siteName: 'NorthWorks'
      }
    };
  }

  const { frontmatter } = content;
  const title = buildPageTitle(frontmatter.title, collection, 'NorthWorks');
  
  return {
    title,
    description: getDescription(frontmatter) || '',
    keywords: getKeywords(frontmatter),
    openGraph: {
      title: frontmatter.title || title,
      description: getDescription(frontmatter) || '',
      type: 'website',
      siteName: 'NorthWorks'
    }
  };
}

/**
 * Build hierarchical page title
 */
function buildPageTitle(
  pageTitle: string, 
  collection: string, 
  defaultTitle: string
): string {
  if (!pageTitle) return defaultTitle;
  
  const collectionNames = {
    warner: 'D. Warner North',
    cheryl: 'Cheryl North'
  };
  
  const collectionName = collectionNames[collection as keyof typeof collectionNames];
  
  if (collectionName) {
    return `${pageTitle} | ${collectionName} | NorthWorks`;
  }
  
  return `${pageTitle} | ${defaultTitle}`;
}

/**
 * Fallback metadata when content is not available
 */
function generateFallbackMetadata(config: MetadataConfig): Metadata {
  return {
    title: config.defaultTitle || 'NorthWorks',
    description: config.defaultDescription || 'NorthWorks - Risk Analysis and Music Journalism',
    keywords: config.defaultKeywords || [],
    openGraph: {
      title: config.defaultTitle || 'NorthWorks',
      description: config.defaultDescription || 'NorthWorks - Risk Analysis and Music Journalism',
      type: config.type || 'website',
      siteName: config.siteName || 'NorthWorks'
    }
  };
}
