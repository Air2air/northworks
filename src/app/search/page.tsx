/**
 * Unified Search Page - Keyword-based search across all content collections
 * Classical music interviews, articles, reviews, and professional portfolio
 */

import React, { Suspense } from 'react';
import { ContentItem } from '@/components/ui/ContentCard';
import PageTitle from '@/components/ui/PageTitle';
import dynamic from 'next/dynamic';
import { getAllContentItems, getCollectionStats } from '@/lib/unifiedSearch';

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

// Load all content using unified search system
async function getAllContentData(): Promise<{
  allContent: ContentItem[];
  stats: any;
}> {
  try {
    const allContent = getAllContentItems();
    const stats = getCollectionStats();
    
    console.log(`Loaded ${allContent.length} total content items from ${stats.totalCollections} collections`);
    
    return {
      allContent,
      stats
    };
  } catch (error) {
    console.error('Error loading content data:', error);
    return {
      allContent: [],
      stats: { totalCollections: 0, totalItems: 0, collectionBreakdown: [] }
    };
  }
}

export default async function UnifiedSearchPage() {
  const { allContent, stats } = await getAllContentData();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle 
        title="Search NorthWorks"
        description="Discover content across classical music interviews, articles, reviews, and professional work. Simply enter your search terms below."
      />
      <Suspense fallback={
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
      }>
        <SearchInterface allContent={allContent} stats={stats} />
      </Suspense>
    </div>
  );
}
