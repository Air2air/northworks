import { generateSpecialBreadcrumbs } from '@/lib/breadcrumbUtils';
import React, { Suspense } from 'react';
import { UnifiedContentItem } from '@/schemas/unified-content-schema';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import dynamic from 'next/dynamic';
import { getAllContent } from '@/lib/unified-data';
import { generateMetadataFromContent } from '@/lib/metadataUtils';
import { getContentBySlug } from '@/lib/content';
import type { Metadata } from 'next';
import { CollectionType, isValidCollection } from '@/types';

export const metadata: Metadata = generateMetadataFromContent('search', {
  type: 'website',
  defaultTitle: 'Search | NorthWorks',
  defaultDescription: 'Search across classical music content and professional portfolio'
});

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

export default async function UnifiedSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { allContent } = await getAllContentData();
  const resolvedSearchParams = await searchParams;
  
  // Extract collection parameter
  const collectionParam = resolvedSearchParams.collection as string | undefined;
  const collection: CollectionType = (collectionParam && isValidCollection(collectionParam)) 
    ? collectionParam 
    : "global";
  
  // Generate breadcrumbs using centralized utility
  const breadcrumbs = generateSpecialBreadcrumbs('search');
  
  // Get search page content from frontmatter
  const searchContent = getContentBySlug('search', false);
  const title = searchContent?.frontmatter?.title || "Search NorthWorks";
  const description = searchContent?.frontmatter?.description || "Discover content across classical music interviews, articles, reviews, and professional work. Simply enter your search terms below.";
  
  return (
    <UnifiedLayout breadcrumbs={breadcrumbs}>
      <PageTitle 
        title={title}
        description={description}
        align="left"
        size="medium"
      />
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
        <SearchInterface 
          allContent={allContent} 
          collection={collection}
        />
      </Suspense>
    </UnifiedLayout>
  );
}
