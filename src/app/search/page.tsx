/**
 * Unified Search Page - Search across all content types
 * Classical music interviews, articles, and professional portfolio
 */

import React, { Suspense } from 'react';
import { ContentItem } from '@/components/ui/ContentCard';
import dynamic from 'next/dynamic';
import { loadInterviews, loadArticles, loadWarnerPortfolio, loadWarnerLists } from '@/lib/jsonData';

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
  warnerPortfolio: ContentItem[];
  warnerLists: any;
}> {
  try {
    // Load data using helper functions
    const interviewsData = loadInterviews();
    const articlesData = loadArticles();
    const warnerData = loadWarnerPortfolio();
    const warnerListsData = loadWarnerLists();
    
    // Convert warner portfolio section to content item
    const convertWarnerToContentItem = (item: any, category: string) => ({
      metadata: {
        id: item.id || Math.random().toString(),
        type: 'professional_document',
        category: 'professional',
        subcategory: category,
        status: 'published'
      },
      content: {
        title: item.content?.title || 'Professional Section',
        summary: item.content?.summary || item.content?.excerpt || '',
        excerpt: item.content?.excerpt || '',
        full_content: item.content?.full_content || ''
      },
      subject: {
        people: [{
          name: "D. Warner North",
          role: category,
          description: item.content?.summary || item.content?.excerpt || ''
        }]
      },
      publication: {
        date: undefined,
        publisher: "NorthWorks"
      },
      media: {},
      tags: item.professional_data?.organizations || []
    });
    
    // Helper function to extract title from description

    
    const warnerPortfolio = warnerData.portfolio_sections ? 
      warnerData.portfolio_sections.map((item: any) => convertWarnerToContentItem(item, 'portfolio_section')) : 
      [];
    
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
      warnerPortfolio,
      warnerLists: warnerListsData.lists || {}
    };
  } catch (error) {
    console.error('Error loading content data:', error);
    return {
      interviews: [],
      articles: [],
      warnerPortfolio: [],
      warnerLists: {}
    };
  }
}

export default async function UnifiedSearchPage() {
  const { interviews, articles, warnerPortfolio, warnerLists } = await getAllContentData();
  
  // Combine all content for unified search
  const allContent = [
    ...interviews.map(item => ({ ...item, domain: 'Classical Music' })),
    ...articles.map(item => ({ ...item, domain: 'Articles & Reviews' })),
    ...warnerPortfolio.map(item => ({ ...item, domain: 'Professional Portfolio' }))
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
      <SearchInterface allContent={allContent} warnerLists={warnerLists} />
    </Suspense>
  );
}
