/**
 * Unified Search Page - Keyword-based search across all content collections
 * Classical music interviews, articles, reviews, and professional portfolio
 */

import React, { Suspense } from 'react';
import { UnifiedContentItem } from '@/schemas/unified-content-schema';
import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import dynamic from 'next/dynamic';
import { getAllContent } from '@/lib/unified-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search | NorthWorks',
  description: 'Search across classical music interviews, articles, reviews, and professional portfolio content from Cheryl North and D. Warner North.',
  keywords: ['search', 'classical music', 'interviews', 'articles', 'reviews', 'music journalism', 'risk analysis'],
  openGraph: {
    title: 'Search | NorthWorks',
    description: 'Search across classical music interviews, articles, reviews, and professional portfolio content.',
    type: 'website',
    siteName: 'NorthWorks'
  }
};

// Dynamic import for SearchInterface to reduce initial bundle size
const SearchInterface = dynamic(() => import('@/components/SearchInterface'), {
  loading: () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 bg-gray-200 rounded mb-8 w-2/3"></div>
      <div className="space-y-4 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-200 h-20 rounded"></div>
        ))}
      </div>
      <div className="bg-gray-200 h-64 rounded"></div>
    </div>
  )
});

// Load all content using unified data system
async function getAllContentData(): Promise<{
  allContent: UnifiedContentItem[];
}> {
  try {
    const allContent = await getAllContent();
    
    return {
      allContent
    };
  } catch (error) {
    console.error('Error loading content data:', error);
    return {
      allContent: []
    };
  }
}

export default async function UnifiedSearchPage() {
  const { allContent } = await getAllContentData();
  
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Search', href: '/search', active: true }
  ];
  
  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      {/* <PageTitle 
        title="Search NorthWorks"
        description="Discover content across classical music interviews, articles, reviews, and professional work. Simply enter your search terms below."
        align="left"
        size="medium"
      /> */}
      <Suspense fallback={
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-8 w-2/3"></div>
          <div className="space-y-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-20 rounded"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-64 rounded"></div>
        </div>
      }>
        <SearchInterface allContent={allContent} />
      </Suspense>
    </PageLayout>
  );
}
