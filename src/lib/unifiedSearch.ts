/**
 * Unified search service - provides keyword-based search across all content collections
 * Normalizes data from all JSON sources into a unified search index
 */

import fs from 'fs';
import path from 'path';
import {
  UnifiedContentItem,
  UnifiedCollection,
  SearchOptions,
  SearchResponse,
  SearchResult,
  ContentMetadata
} from '@/types/content';

// Data transformation functions to normalize different JSON structures
function transformToUnified(item: any, type: ContentMetadata['type']): UnifiedContentItem {
  return {
    metadata: {
      id: item.metadata?.id || `${type}-${Date.now()}`,
      type,
      category: item.metadata?.category || type,
      subcategory: item.metadata?.subcategory,
      status: item.metadata?.status || 'published',
      featured: item.metadata?.featured || false,
      source: item.metadata?.source || 'json',
      lastModified: item.metadata?.lastModified || new Date().toISOString()
    },
    content: {
      title: item.content?.title || item.title || 'Untitled',
      subtitle: item.content?.subtitle || item.subtitle,
      summary: item.content?.summary || item.summary,
      body: item.content?.body || item.body || item.content?.url || '',
      url: item.content?.url || item.url
    },
    publication: item.publication ? {
      name: item.publication.name || item.publication.publication,
      publisher: item.publication.publisher,
      date: item.publication.date,
      url: item.publication.url,
      volume: item.publication.volume,
      issue: item.publication.issue
    } : undefined,
    subject: item.subject ? {
      people: item.subject.people?.map((person: any) => ({
        name: person.name,
        role: person.role || '',
        nationality: person.nationality,
        description: person.description
      })),
      works: item.subject.works?.map((work: any) => ({
        title: work.title,
        composer: work.composer,
        genre: work.genre,
        year: work.year
      })),
      organizations: item.subject.organizations?.map((org: any) => ({
        name: typeof org === 'string' ? org : org.name,
        role: typeof org === 'object' ? org.role : undefined,
        location: typeof org === 'object' ? org.location : undefined
      })),
      venues: item.subject.venues?.map((venue: any) => ({
        name: typeof venue === 'string' ? venue : venue.name,
        location: typeof venue === 'object' ? venue.location : undefined,
        capacity: typeof venue === 'object' ? venue.capacity : undefined
      }))
    } : undefined,
    media: item.media ? {
      images: item.media.images?.map((img: any) => ({
        url: img.url || img.src,
        type: img.type || 'image',
        alt: img.alt || '',
        caption: img.caption
      })),
      videos: item.media.videos,
      audio: item.media.audio
    } : undefined,
    professional: item.professional ? {
      position: item.professional.currentPosition || item.professional.position ? {
        title: item.professional.currentPosition?.title || item.professional.position?.title || '',
        organization: item.professional.currentPosition?.organization || item.professional.position?.organization || '',
        location: item.professional.currentPosition?.location || item.professional.position?.location,
        startDate: item.professional.currentPosition?.startDate || item.professional.position?.startDate,
        endDate: item.professional.currentPosition?.endDate || item.professional.position?.endDate
      } : undefined,
      education: item.professional.education,
      specializations: item.professional.specializations,
      awards: item.awards || item.professional.awards
    } : undefined,
    tags: item.tags || [],
    legacy: item.legacy
  };
}

// Load and normalize data from JSON files
function loadJsonData<T>(filename: string): T {
  const dataPath = path.join(process.cwd(), 'src', 'data', filename);
  
  if (!fs.existsSync(dataPath)) {
    console.warn(`Data file not found: ${filename}`);
    return {} as T;
  }
  
  try {
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return {} as T;
  }
}

// Load all content collections
export function loadAllCollections(): UnifiedCollection[] {
  const collections: UnifiedCollection[] = [];
  
  // Load interviews
  try {
    const interviewsData = loadJsonData<any>('cheryl-interviews.json');
    if (interviewsData.interviews) {
      collections.push({
        metadata: {
          type: 'interview',
          category: 'interviews',
          classification: interviewsData.metadata?.classification || 'cheryl-interviews',
          description: interviewsData.metadata?.description || 'Classical music interviews',
          count: interviewsData.interviews.length,
          generated: interviewsData.metadata?.generated || new Date().toISOString(),
          version: interviewsData.metadata?.version || '1.0.0'
        },
        items: interviewsData.interviews.map((item: any) => transformToUnified(item, 'interview'))
      });
    }
  } catch (error) {
    console.warn('Error loading interviews:', error);
  }
  
  // Load articles
  try {
    const articlesData = loadJsonData<any>('cheryl-articles.json');
    if (articlesData.articles) {
      collections.push({
        metadata: {
          type: 'article',
          category: 'articles',
          classification: articlesData.metadata?.classification || 'cheryl-articles',
          description: articlesData.metadata?.description || 'Classical music articles',
          count: articlesData.articles.length,
          generated: articlesData.metadata?.generated || new Date().toISOString(),
          version: articlesData.metadata?.version || '1.0.0'
        },
        items: articlesData.articles.map((item: any) => transformToUnified(item, 'article'))
      });
    }
  } catch (error) {
    console.warn('Error loading articles:', error);
  }
  
  // Load reviews
  try {
    const reviewsData = loadJsonData<any>('cheryl-reviews.json');
    if (reviewsData.reviews) {
      collections.push({
        metadata: {
          type: 'review',
          category: 'reviews',
          classification: reviewsData.metadata?.classification || 'cheryl-reviews',
          description: reviewsData.metadata?.description || 'Performance reviews',
          count: reviewsData.reviews.length,
          generated: reviewsData.metadata?.generated || new Date().toISOString(),
          version: reviewsData.metadata?.version || '1.0.0'
        },
        items: reviewsData.reviews.map((item: any) => transformToUnified(item, 'review'))
      });
    }
  } catch (error) {
    console.warn('Error loading reviews:', error);
  }
  
  // Load professional content
  try {
    const professionalData = loadJsonData<any>('warner-professional.json');
    if (professionalData.professional) {
      collections.push({
        metadata: {
          type: 'professional',
          category: 'professional',
          classification: professionalData.metadata?.classification || 'warner-professional',
          description: professionalData.metadata?.description || 'Professional portfolio',
          count: professionalData.professional.length,
          generated: professionalData.metadata?.generated || new Date().toISOString(),
          version: professionalData.metadata?.version || '1.0.0'
        },
        items: professionalData.professional.map((item: any) => transformToUnified(item, 'professional'))
      });
    }
  } catch (error) {
    console.warn('Error loading professional:', error);
  }
  
  // Load publications
  try {
    const publicationsData = loadJsonData<any>('warner-publications.json');
    if (publicationsData.publications) {
      collections.push({
        metadata: {
          type: 'publication',
          category: 'publications',
          classification: publicationsData.metadata?.classification || 'warner-publications',
          description: publicationsData.metadata?.description || 'Academic publications',
          count: publicationsData.publications.length,
          generated: publicationsData.metadata?.generated || new Date().toISOString(),
          version: publicationsData.metadata?.version || '1.0.0'
        },
        items: publicationsData.publications.map((item: any) => transformToUnified(item, 'publication'))
      });
    }
  } catch (error) {
    console.warn('Error loading publications:', error);
  }
  
  // Load background
  try {
    const backgroundData = loadJsonData<any>('warner-background.json');
    if (backgroundData.background) {
      collections.push({
        metadata: {
          type: 'background',
          category: 'background',
          classification: backgroundData.metadata?.classification || 'warner-background',
          description: backgroundData.metadata?.description || 'Professional background',
          count: backgroundData.background.length,
          generated: backgroundData.metadata?.generated || new Date().toISOString(),
          version: backgroundData.metadata?.version || '1.0.0'
        },
        items: backgroundData.background.map((item: any) => transformToUnified(item, 'background'))
      });
    }
  } catch (error) {
    console.warn('Error loading background:', error);
  }
  
  return collections;
}

// Get all content items flattened from collections
export function getAllContentItems(): UnifiedContentItem[] {
  const collections = loadAllCollections();
  return collections.flatMap(collection => collection.items);
}

// Search function with keyword-based matching
export function searchContent(options: SearchOptions): SearchResponse {
  const allItems = getAllContentItems();
  const query = options.query.toLowerCase().trim();
  
  if (!query) {
    // Return all items if no query
    return {
      results: allItems.map(item => ({
        item,
        score: 1,
        matchedFields: []
      })),
      total: allItems.length,
      facets: generateFacets(allItems),
      query: options
    };
  }
  
  const results: SearchResult[] = [];
  
  for (const item of allItems) {
    let score = 0;
    const matchedFields: string[] = [];
    
    // Search in title (highest weight)
    if (item.content.title?.toLowerCase().includes(query)) {
      score += 10;
      matchedFields.push('title');
    }
    
    // Search in summary (high weight)
    if (item.content.summary?.toLowerCase().includes(query)) {
      score += 8;
      matchedFields.push('summary');
    }
    
    // Search in body content (medium weight)
    if (item.content.body?.toLowerCase().includes(query)) {
      score += 5;
      matchedFields.push('body');
    }
    
    // Search in tags (medium weight)
    if (item.tags?.some(tag => tag.toLowerCase().includes(query))) {
      score += 6;
      matchedFields.push('tags');
    }
    
    // Search in people names (medium weight)
    if (item.subject?.people?.some(person => person.name.toLowerCase().includes(query))) {
      score += 6;
      matchedFields.push('people');
    }
    
    // Search in organizations (medium weight)
    if (item.subject?.organizations?.some(org => org.name.toLowerCase().includes(query))) {
      score += 5;
      matchedFields.push('organizations');
    }
    
    // Search in publication info (low weight)
    if (item.publication?.name?.toLowerCase().includes(query) || 
        item.publication?.publisher?.toLowerCase().includes(query)) {
      score += 3;
      matchedFields.push('publication');
    }
    
    // Search in category/type (low weight)
    if (item.metadata.category.toLowerCase().includes(query) ||
        item.metadata.type.toLowerCase().includes(query)) {
      score += 2;
      matchedFields.push('metadata');
    }
    
    // Apply filters
    if (options.types && !options.types.includes(item.metadata.type)) {
      score = 0;
    }
    
    if (options.categories && !options.categories.includes(item.metadata.category)) {
      score = 0;
    }
    
    if (score > 0) {
      results.push({
        item,
        score,
        matchedFields
      });
    }
  }
  
  // Sort by score (relevance)
  results.sort((a, b) => b.score - a.score);
  
  // Apply pagination
  const offset = options.offset || 0;
  const limit = options.limit || 50;
  const paginatedResults = results.slice(offset, offset + limit);
  
  return {
    results: paginatedResults,
    total: results.length,
    facets: generateFacets(results.map(r => r.item)),
    query: options
  };
}

// Generate search facets for filtering
function generateFacets(items: UnifiedContentItem[]) {
  const types: Record<string, number> = {};
  const categories: Record<string, number> = {};
  const tags: Record<string, number> = {};
  const years: Record<string, number> = {};
  
  for (const item of items) {
    // Count types
    types[item.metadata.type] = (types[item.metadata.type] || 0) + 1;
    
    // Count categories
    categories[item.metadata.category] = (categories[item.metadata.category] || 0) + 1;
    
    // Count tags
    item.tags?.forEach(tag => {
      tags[tag] = (tags[tag] || 0) + 1;
    });
    
    // Count years from publication date
    if (item.publication?.date) {
      const year = new Date(item.publication.date).getFullYear().toString();
      if (!isNaN(parseInt(year))) {
        years[year] = (years[year] || 0) + 1;
      }
    }
  }
  
  return { types, categories, tags, years };
}

// Get collection statistics
export function getCollectionStats() {
  const collections = loadAllCollections();
  return {
    totalCollections: collections.length,
    totalItems: collections.reduce((sum, col) => sum + col.metadata.count, 0),
    collectionBreakdown: collections.map(col => ({
      type: col.metadata.type,
      category: col.metadata.category,
      count: col.metadata.count,
      description: col.metadata.description
    }))
  };
}
