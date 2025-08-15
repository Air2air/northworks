/**
 * Unified Search Page - Search across all content types
 * Classical music interviews, articles, and professional portfolio
 */

import React, { Suspense } from 'react';
import { ContentItem } from '@/components/ui/ContentCard';
import dynamic from 'next/dynamic';
import { loadInterviews, loadArticles, loadProfile, loadWarnerProfessional, loadWarnerPublications, loadWarnerBackground } from '@/lib/jsonData';

// Dynamic import for SearchInterface to reduce initial bundle size
const SearchInterface = dynamic(() => import('@/components/SearchInterface'), {
  loading: () => (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-8 w-2/3"></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-20 rounded"></div>
          ))}
        </div>
        <div className="bg-gray-200 h-64 rounded"></div>
      </div>
    </div>
  )
});

// Data loaders for all content types
async function getAllContentData(): Promise<{
  interviews: ContentItem[];
  articles: ContentItem[];
  reviews: ContentItem[];
  warnerProfessional: ContentItem[];
  warnerPublications: ContentItem[];
  warnerBackground: ContentItem[];
}> {
  try {
    // Load data using helper functions
    const interviewsData = loadInterviews();
    const articlesData = loadArticles();
    const reviewsData = loadProfile();
    const warnerProfessionalData = loadWarnerProfessional();
    const warnerPublicationsData = loadWarnerPublications();
    const warnerBackgroundData = loadWarnerBackground();
    
    return {
      interviews: (interviewsData.interviews || []).map((interview: any) => ({
        ...interview,
        publication: {
          ...interview.publication,
          date: interview.publication?.date || undefined
        }
      })),
      articles: (articlesData.articles || []).map((article: any) => ({
        ...article,
        publication: {
          ...article.publication,
          date: article.publication?.date || undefined
        }
      })),
      reviews: [], // Reviews are in profile data structure, need to check format
      warnerProfessional: warnerProfessionalData.professional || [],
      warnerPublications: warnerPublicationsData.publications || [],
      warnerBackground: warnerBackgroundData.background || []
    };
  } catch (error) {
    console.error('Error loading content data:', error);
    return {
      interviews: [],
      articles: [],
      reviews: [],
      warnerProfessional: [],
      warnerPublications: [],
      warnerBackground: []
    };
  }
}

export default async function UnifiedSearchPage() {
  const { interviews, articles, reviews, warnerProfessional, warnerPublications, warnerBackground } = await getAllContentData();
  
  // Combine all content for unified search
  const allContent = [
    ...interviews.map(item => ({ ...item, domain: 'Classical Music Interviews' })),
    ...articles.map(item => ({ ...item, domain: 'Articles' })),
    ...reviews.map(item => ({ ...item, domain: 'Reviews' })),
    ...warnerProfessional.map((item: any) => ({ ...item, domain: 'Professional Experience' })),
    ...warnerPublications.map((item: any) => ({ ...item, domain: 'Publications' })),
    ...warnerBackground.map((item: any) => ({ ...item, domain: 'Professional Background' }))
  ];
  
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-8 w-2/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-20 rounded"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-64 rounded"></div>
        </div>
      </div>
    }>
      <SearchInterface allContent={allContent} warnerLists={{}} />
    </Suspense>
  );
}
