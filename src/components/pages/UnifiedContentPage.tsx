/**
 * UnifiedContentPage - Reusable page component for content types (interviews, articles, reviews)
 * Consolidates the logic and layout for content listing pages with both index and individual content
 */

import React from 'react';
import { getContentBySlug, getContentByType } from '@/lib/content';
import { InterviewFrontmatter, ArticleFrontmatter, ReviewFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedListComponent, { 
  parseInterviewsFromMarkdown, 
  parseArticlesFromMarkdown, 
  parseReviewsFromMarkdown 
} from '@/components/ui/UnifiedListComponent';
import { cleanTitle } from '@/lib/pathUtils';
import Link from 'next/link';
import Image from 'next/image';

type ContentType = 'interview' | 'article' | 'review';

interface ContentConfig {
  type: ContentType;
  slug: string;
  title: string;
  description: string;
  indexRoute: string;
  parser: typeof parseInterviewsFromMarkdown | typeof parseArticlesFromMarkdown | typeof parseReviewsFromMarkdown;
}

const contentConfigs: Record<ContentType, ContentConfig> = {
  interview: {
    type: 'interview',
    slug: 'c_interviews',
    title: 'Classical Music Interviews',
    description: 'Profile interviews with major figures on the international, national, and local San Francisco Bay Area classical music scene',
    indexRoute: '/interviews-index',
    parser: parseInterviewsFromMarkdown
  },
  article: {
    type: 'article', 
    slug: 'c_articles',
    title: 'Articles & Features',
    description: 'In-depth articles and features covering classical music topics, analysis, and cultural commentary',
    indexRoute: '/articles-index',
    parser: parseArticlesFromMarkdown
  },
  review: {
    type: 'review',
    slug: 'c_reviews', 
    title: 'Performance Reviews',
    description: 'Reviews and critiques of classical music performances, recordings, and events',
    indexRoute: '/reviews-index',
    parser: parseReviewsFromMarkdown
  }
};

interface UnifiedContentPageProps {
  contentType: ContentType;
}

export default function UnifiedContentPage({ contentType }: UnifiedContentPageProps) {
  const config = contentConfigs[contentType];
  
  // Get both the content index and individual content items
  const indexData = getContentBySlug(config.slug);
  const individualItems = getContentByType(config.type);

  const defaultNavigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: false }
  ];

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: config.title, href: `/${contentType}s`, active: true }
  ];

  const mockFrontmatter = {
    id: `${contentType}s`,
    title: config.title,
    type: 'article' as const,
    seo: {
      title: config.title,
      description: config.description,
      keywords: [`${contentType}s`, 'classical music', 'music']
    },
    navigation: defaultNavigation,
    breadcrumbs: breadcrumbs
  };

  // If we have index data, parse it and show those items
  if (indexData) {
    const frontmatter = indexData.frontmatter as InterviewFrontmatter | ArticleFrontmatter | ReviewFrontmatter;
    const enhancedFrontmatter = {
      ...frontmatter,
      navigation: defaultNavigation,
      breadcrumbs: breadcrumbs
    };

    // Parse content items from the index markdown
    const indexItems = config.parser(indexData.content, frontmatter.images || []);

    return (
      <ContentLayout frontmatter={enhancedFrontmatter}>
        <div className="space-y-8">
          <PageTitle
            title={config.title}
            description={config.description}
            align="center"
            size="large"
          />

          {indexItems && indexItems.length > 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <Link 
                  href={config.indexRoute}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Complete {config.title} Index →
                </Link>
              </div>
              <UnifiedListComponent 
                items={indexItems.slice(0, 12)} // Show first 12
                contentType={config.type}
                title=""
                showThumbnails={contentType === 'interview'}
                layout="grid"
              />
            </div>
          )}

          {/* Individual items from file system */}
          {individualItems && individualItems.length > 0 && (
            <div className="space-y-6">
              <div className="border-t pt-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                  Featured {config.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {individualItems.slice(0, 6).map((item, index) => (
                    <Link 
                      key={item.slug} 
                      href={`/${contentType}s/${item.slug}`}
                      className="block group"
                    >
                      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                          {cleanTitle(item.frontmatter.title)}
                        </h3>
                        {(item.frontmatter as any).description && (
                          <p className="text-gray-600 text-sm">
                            {((item.frontmatter as any).description as string).substring(0, 120)}...
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No content fallback */}
          {(!indexItems || indexItems.length === 0) && (!individualItems || individualItems.length === 0) && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {config.title} Found
              </h3>
              <p className="text-gray-600">
                Check back later for new content.
              </p>
            </div>
          )}
        </div>
      </ContentLayout>
    );
  }

  // Fallback to mock frontmatter if no index data
  return (
    <ContentLayout frontmatter={mockFrontmatter}>
      <div className="space-y-8">
        <PageTitle
          title={config.title}
          description={config.description}
          align="center"
          size="large"
        />

        {/* Individual items from file system */}
        {individualItems && individualItems.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Available {config.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {individualItems.slice(0, 9).map((item, index) => (
                <Link 
                  key={item.slug} 
                  href={`/${contentType}s/${item.slug}`}
                  className="block group"
                >
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {cleanTitle(item.frontmatter.title)}
                    </h3>
                    {(item.frontmatter as any).description && (
                      <p className="text-gray-600 text-sm">
                        {((item.frontmatter as any).description as string).substring(0, 120)}...
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No content fallback */}
        {(!individualItems || individualItems.length === 0) && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {config.title} Found
            </h3>
            <p className="text-gray-600">
              Check back later for new content.
            </p>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
