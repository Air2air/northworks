/**
 * Unified Search Service
 * Single search implementation across all content collections
 * Provides keyword-based search with relevance scoring
 */

import { UnifiedContentItem } from '@/schemas/unified-content-schema';
import { CollectionType, getCollectionFromSlug, getCollectionFromCategory } from '@/types';

export interface SearchOptions {
  query: string;
  collection?: CollectionType;
  type?: string;
  category?: string;
  limit?: number;
}

export interface SearchResult extends UnifiedContentItem {
  relevanceScore: number;
  matchedFields: string[];
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  query: string;
  executionTime: number;
}

/**
 * Main search function with relevance scoring
 */
export function searchContent(
  allContent: UnifiedContentItem[], 
  options: SearchOptions
): SearchResponse {
  const startTime = performance.now();
  const { query, collection, type, category, limit } = options;
  
  let filtered = [...allContent];

  // Apply collection filter
  if (collection && collection !== 'global') {
    filtered = filtered.filter((item) => {
      if (collection === 'cheryl') {
        return getCollectionFromSlug(item.id || item.slug || '') === 'cheryl' ||
               getCollectionFromCategory(item.category || '') === 'cheryl';
      } else if (collection === 'warner') {
        return getCollectionFromSlug(item.id || item.slug || '') === 'warner' ||
               getCollectionFromCategory(item.category || '') === 'warner';
      }
      return true;
    });
  }

  // Apply type filter
  if (type) {
    filtered = filtered.filter(item => item.type === type);
  }

  // Apply category filter
  if (category) {
    filtered = filtered.filter(item => item.category === category);
  }

  // If no search query, return all filtered results
  if (!query || !query.trim()) {
    const results: SearchResult[] = filtered.map(item => ({
      ...item,
      relevanceScore: 1,
      matchedFields: []
    }));
    
    return {
      results: limit ? results.slice(0, limit) : results,
      totalResults: results.length,
      query: query || '',
      executionTime: performance.now() - startTime
    };
  }

  // Perform search with relevance scoring
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
  const searchResults: SearchResult[] = [];

  for (const item of filtered) {
    let relevanceScore = 0;
    const matchedFields: string[] = [];

    // Search in title (highest weight: 10)
    const titleMatches = searchTerms.filter(term => 
      item.title.toLowerCase().includes(term)
    );
    if (titleMatches.length > 0) {
      relevanceScore += titleMatches.length * 10;
      matchedFields.push('title');
    }

    // Search in summary/excerpt (high weight: 5)
    const summaryText = (item.summary || item.excerpt || '').toLowerCase();
    const summaryMatches = searchTerms.filter(term => summaryText.includes(term));
    if (summaryMatches.length > 0) {
      relevanceScore += summaryMatches.length * 5;
      matchedFields.push('summary');
    }

    // Search in body content (medium weight: 3)
    const bodyText = (item.body || '').toLowerCase();
    const bodyMatches = searchTerms.filter(term => bodyText.includes(term));
    if (bodyMatches.length > 0) {
      relevanceScore += bodyMatches.length * 3;
      matchedFields.push('body');
    }

    // Search in tags (medium weight: 4)
    const tagsText = (item.tags || []).join(' ').toLowerCase();
    const tagMatches = searchTerms.filter(term => tagsText.includes(term));
    if (tagMatches.length > 0) {
      relevanceScore += tagMatches.length * 4;
      matchedFields.push('tags');
    }

    // Search in type/category (low weight: 2)
    const typeText = `${item.type} ${item.category || ''}`.toLowerCase();
    const typeMatches = searchTerms.filter(term => typeText.includes(term));
    if (typeMatches.length > 0) {
      relevanceScore += typeMatches.length * 2;
      matchedFields.push('type');
    }

    // Search in slug (low weight: 1)
    const slugText = (item.slug || '').toLowerCase();
    const slugMatches = searchTerms.filter(term => slugText.includes(term));
    if (slugMatches.length > 0) {
      relevanceScore += slugMatches.length * 1;
      matchedFields.push('slug');
    }

    // If any matches found, add to results
    if (relevanceScore > 0) {
      searchResults.push({
        ...item,
        relevanceScore,
        matchedFields
      });
    }
  }

  // Sort by relevance score (highest first)
  searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Apply limit if specified
  const finalResults = limit ? searchResults.slice(0, limit) : searchResults;

  return {
    results: finalResults,
    totalResults: searchResults.length,
    query,
    executionTime: performance.now() - startTime
  };
}

/**
 * Simple search function for basic use cases
 */
export function simpleSearch(
  allContent: UnifiedContentItem[], 
  query: string
): UnifiedContentItem[] {
  const response = searchContent(allContent, { query });
  return response.results;
}
