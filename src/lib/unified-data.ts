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
// SEARCH AND FILTERING
// ===============================================

export function searchContent(
  query: string, 
  type?: ContentType, 
  category?: ContentCategory
): UnifiedContentItem[] {
  let content = getAllContent();
  
  // Filter by type/category if specified
  if (type) {
    content = content.filter(item => item.type === type);
  }
  if (category) {
    content = content.filter(item => item.category === category);
  }
  
  // Search in title, summary, and tags
  if (query.trim()) {
    const searchTerms = query.toLowerCase().split(' ');
    content = content.filter(item => {
      const searchableText = [
        item.title,
        item.summary || '',
        ...(item.tags || [])
      ].join(' ').toLowerCase();
      
      return searchTerms.every(term => searchableText.includes(term));
    });
  }
  
  return content;
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
