/**
 * Utility functions for generating consistent alt text and SEO metadata
 */

import { ContentImage } from '@/types/content';

/**
 * Generates consistent alt text for images based on context
 */
export function generateAltText(
  image: ContentImage, 
  context: {
    title?: string;
    type?: 'interview' | 'article' | 'review' | 'thumbnail' | 'hero' | 'gallery';
    personName?: string;
    fallback?: string;
  }
): string {
  // Use explicit alt text if provided
  if (image.alt && image.alt.trim()) {
    return image.alt.trim();
  }

  // Generate based on image type and context
  switch (image.type || context.type) {
    case 'portrait':
      return context.personName 
        ? `Portrait of ${context.personName}` 
        : 'Portrait photograph';
        
    case 'thumbnail':
      return context.title 
        ? `Thumbnail image for ${context.title}` 
        : 'Thumbnail image';
        
    case 'hero':
      return context.title 
        ? `Featured image for ${context.title}` 
        : 'Featured image';
        
    case 'gallery':
      return context.title 
        ? `Gallery image from ${context.title}` 
        : 'Gallery image';
        
    default:
      // Use filename as fallback, cleaned up
      if (image.src) {
        const filename = image.src.split('/').pop()?.replace(/\.[^/.]+$/, '') || '';
        const cleanName = filename
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        return cleanName || context.fallback || 'Image';
      }
      
      return context.fallback || 'Image';
  }
}

/**
 * Generates consistent SEO metadata
 */
export function generateSEOMetadata(
  title: string,
  description?: string,
  keywords?: string[],
  type: 'interview' | 'article' | 'review' | 'index' | 'page' = 'page'
) {
  const baseKeywords = ['NorthWorks', 'classical music'];
  
  const typeKeywords = {
    interview: ['interview', 'classical music interview', 'musician interview'],
    article: ['article', 'classical music article', 'music journalism'],
    review: ['review', 'performance review', 'classical music review'],
    index: ['collection', 'archive', 'classical music content'],
    page: ['classical music', 'content']
  };

  const allKeywords = [
    ...baseKeywords,
    ...typeKeywords[type],
    ...(keywords || [])
  ];

  return {
    title: `${title} - NorthWorks`,
    description: description || `${title} - Classical music content on NorthWorks`,
    keywords: allKeywords
  };
}

/**
 * Validates that required image properties exist
 */
export function validateImageData(image: ContentImage): boolean {
  return !!(image.src && image.src.trim());
}

/**
 * Provides fallback dimensions for images
 */
export function getImageDimensions(
  image: ContentImage,
  type: 'thumbnail' | 'hero' | 'gallery' | 'portrait' = 'thumbnail'
): { width: number; height: number } {
  // Use provided dimensions if available
  if (image.width && image.height) {
    return { width: image.width, height: image.height };
  }

  // Fallback dimensions by type
  const fallbacks = {
    thumbnail: { width: 150, height: 100 },
    hero: { width: 800, height: 400 },
    gallery: { width: 600, height: 400 },
    portrait: { width: 200, height: 250 }
  };

  return fallbacks[type];
}
