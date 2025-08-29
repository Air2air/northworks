/**
 * Centralized Content Processing Utilities
 * Normalizes special content features across all content types
 */

import { shouldUseSectionCards } from '@/lib/sectionParser';
import { formatDate } from '@/lib/dateUtils';
import { cleanTitle } from '@/lib/pathUtils';
import { getDescription } from '@/lib/fieldNormalization';

/**
 * Content processing configuration for different types
 */
export const CONTENT_PROCESSING_CONFIG = {
  interview: {
    supportsSectionCards: false,
    defaultImageDisplay: true,
    defaultTagsLabel: 'Tags',
    metadataFields: ['publication', 'date', 'author']
  },
  article: {
    supportsSectionCards: false,
    defaultImageDisplay: false,
    defaultTagsLabel: 'Tags',
    metadataFields: ['publication', 'date', 'author']
  },
  review: {
    supportsSectionCards: false,
    defaultImageDisplay: false,
    defaultTagsLabel: 'Tags',
    metadataFields: ['publication', 'date', 'author']
  },
  professional: {
    supportsSectionCards: true,
    defaultImageDisplay: false,
    defaultTagsLabel: 'Subjects',
    metadataFields: ['organization', 'position', 'duration']
  },
  publication: {
    supportsSectionCards: false,
    defaultImageDisplay: false,
    defaultTagsLabel: 'Subjects',
    metadataFields: ['journal', 'publisher', 'year', 'pages']
  },
  background: {
    supportsSectionCards: true,
    defaultImageDisplay: false,
    defaultTagsLabel: 'Subjects',
    metadataFields: ['organization', 'position', 'duration']
  }
} as const;

/**
 * Unified content feature detection
 */
export interface ContentFeatures {
  useSectionCards: boolean;
  showImages: boolean;
  tagsLabel: string;
  metadataFields: readonly string[];
}

export function detectContentFeatures(
  contentType: keyof typeof CONTENT_PROCESSING_CONFIG,
  content: string,
  frontmatter: any
): ContentFeatures {
  const config = CONTENT_PROCESSING_CONFIG[contentType];
  
  return {
    useSectionCards: config.supportsSectionCards && shouldUseSectionCards(content),
    showImages: config.defaultImageDisplay && (frontmatter.images?.length > 0),
    tagsLabel: config.defaultTagsLabel,
    metadataFields: config.metadataFields
  };
}

/**
 * Unified metadata extraction for consistent display
 */
export interface ExtractedMetadata {
  title: string;
  description?: string;
  publication?: {
    outlet?: string;
    author?: string;
    date?: string;
    journal?: string;
    publisher?: string;
    year?: string;
    pages?: string;
  };
  professional?: {
    organization?: string;
    position?: string;
    duration?: string;
  };
  tags: string[];
  images: any[];
}

export function extractContentMetadata(frontmatter: any, contentType: string): ExtractedMetadata {
  // Extract tags from various possible fields
  const extractTags = () => {
    if (frontmatter.tags && Array.isArray(frontmatter.tags)) return frontmatter.tags;
    if (frontmatter.subjects && Array.isArray(frontmatter.subjects)) return frontmatter.subjects;
    if (frontmatter.keywords && Array.isArray(frontmatter.keywords)) return frontmatter.keywords;
    return [];
  };

  // Extract images
  const extractImages = () => {
    if (frontmatter.images && Array.isArray(frontmatter.images)) return frontmatter.images;
    return [];
  };

  // Extract publication info
  const extractPublication = () => {
    const pub = frontmatter.publication || {};
    return {
      outlet: pub.outlet || pub.publication,
      author: pub.author,
      date: frontmatter.date || pub.date,
      journal: pub.journal,
      publisher: pub.publisher,
      year: pub.year,
      pages: pub.pages
    };
  };

  // Extract professional info
  const extractProfessional = () => {
    return {
      organization: frontmatter.organization,
      position: frontmatter.position,
      duration: frontmatter.duration
    };
  };

  return {
    title: cleanTitle(frontmatter.title),
    description: getDescription(frontmatter),
    publication: extractPublication(),
    professional: extractProfessional(),
    tags: extractTags(),
    images: extractImages()
  };
}

/**
 * Generate contextual descriptions for different content types
 */
export function generateContextualDescription(
  contentType: string,
  metadata: ExtractedMetadata,
  isWarnerContent: boolean
): string {
  if (metadata.description) return metadata.description;
  
  const authorName = isWarnerContent ? 'D. Warner North' : 'Cheryl North';
  const publicationInfo = metadata.publication?.outlet || metadata.publication?.publisher;
  
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
}

/**
 * Standardized content validation
 */
export interface ContentValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateContent(
  contentType: string,
  frontmatter: any,
  content: string
): ContentValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields validation
  if (!frontmatter.title) {
    errors.push('Title is required');
  }

  if (!frontmatter.type) {
    errors.push('Content type is required');
  } else if (frontmatter.type !== contentType) {
    errors.push(`Content type mismatch: expected ${contentType}, got ${frontmatter.type}`);
  }

  // Content-specific validations
  switch (contentType) {
    case 'professional':
      if (!frontmatter.organization && !frontmatter.position) {
        warnings.push('Professional content should include organization or position');
      }
      break;
    case 'publication':
      if (!frontmatter.publication?.journal && !frontmatter.publication?.publisher) {
        warnings.push('Publication content should include journal or publisher');
      }
      break;
    case 'interview':
    case 'article':
    case 'review':
      if (!frontmatter.publication?.outlet && !frontmatter.publication?.author) {
        warnings.push(`${contentType} content should include publication outlet or author`);
      }
      break;
  }

  // Content length validation
  if (content.length < 100) {
    warnings.push('Content appears to be very short');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Unified SEO optimization for content
 */
export interface SEOOptimization {
  title: string;
  description: string;
  keywords: string[];
  openGraph: {
    title: string;
    description: string;
    type: string;
  };
}

export function optimizeContentSEO(
  metadata: ExtractedMetadata,
  contentType: string,
  isWarnerContent: boolean
): SEOOptimization {
  const authorName = isWarnerContent ? 'D. Warner North' : 'Cheryl North';
  const title = metadata.title;
  const description = generateContextualDescription(contentType, metadata, isWarnerContent);

  return {
    title: `${title} | ${authorName} | NorthWorks`,
    description,
    keywords: metadata.tags,
    openGraph: {
      title,
      description,
      type: 'article'
    }
  };
}
