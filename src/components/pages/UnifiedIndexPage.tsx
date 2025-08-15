/**
 * UnifiedIndexPage - Reusable index page component for content types (interviews, articles, reviews)
 * Consolidates the logic and layout for content index pages
 */

import React from 'react';
import { getContentBySlug } from '@/lib/content';
import { InterviewFrontmatter, ArticleFrontmatter, ReviewFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedListComponent, { 
  parseInterviewsFromMarkdown, 
  parseArticlesFromMarkdown, 
  parseReviewsFromMarkdown 
} from '@/components/ui/UnifiedListComponent';
import Link from 'next/link';

type ContentType = 'interview' | 'article' | 'review';

interface IndexConfig {
  type: ContentType;
  slug: string;
  title: string;
  description: string;
  backRoute: string;
  parser: typeof parseInterviewsFromMarkdown | typeof parseArticlesFromMarkdown | typeof parseReviewsFromMarkdown;
}

const indexConfigs: Record<ContentType, IndexConfig> = {
  interview: {
    type: 'interview',
    slug: 'c_interviews',
    title: 'Complete Interviews Index',
    description: 'Complete archive of profile interviews with major figures on the international, national, and local San Francisco Bay Area classical music scene',
    backRoute: '/interviews',
    parser: parseInterviewsFromMarkdown
  },
  article: {
    type: 'article', 
    slug: 'c_articles',
    title: 'Complete Articles Index',
    description: 'Complete archive of in-depth articles and features covering classical music topics, analysis, and cultural commentary',
    backRoute: '/articles',
    parser: parseArticlesFromMarkdown
  },
  review: {
    type: 'review',
    slug: 'c_reviews', 
    title: 'Complete Reviews Index',
    description: 'Complete archive of reviews and critiques of classical music performances, recordings, and events',
    backRoute: '/reviews',
    parser: parseReviewsFromMarkdown
  }
};

interface UnifiedIndexPageProps {
  contentType: ContentType;
}

export default function UnifiedIndexPage({ contentType }: UnifiedIndexPageProps) {
  const config = indexConfigs[contentType];
  const data = getContentBySlug(config.slug);

  const defaultNavigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: false }
  ];

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: config.title.replace('Complete ', '').replace(' Index', ''), href: config.backRoute, active: false },
    { label: 'Complete Index', href: `/${contentType}s-index`, active: true }
  ];

  if (!data) {
    const mockFrontmatter = {
      id: `${contentType}s-index`,
      title: config.title,
      type: 'article' as const,
      seo: {
        title: config.title,
        description: config.description,
        keywords: [`${contentType}s`, 'classical music', 'music', 'index']
      },
      navigation: defaultNavigation,
      breadcrumbs: breadcrumbs
    };

    return (
      <ContentLayout frontmatter={mockFrontmatter}>
        <div className="space-y-8">
          <PageTitle
            title={config.title}
            description={config.description}
            align="center"
            size="large"
          />

          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Index Not Available
            </h3>
            <p className="text-gray-600 mb-6">
              The complete index for {config.title.toLowerCase()} is not currently available.
            </p>
            <Link 
              href={config.backRoute}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to {config.title.replace('Complete ', '').replace(' Index', '')}
            </Link>
          </div>
        </div>
      </ContentLayout>
    );
  }

  const frontmatter = data.frontmatter as InterviewFrontmatter | ArticleFrontmatter | ReviewFrontmatter;
  const enhancedFrontmatter = {
    ...frontmatter,
    navigation: defaultNavigation,
    breadcrumbs: breadcrumbs
  };

  // Parse all items from the index markdown
  const items = config.parser(data.content, frontmatter.images || []);

  return (
    <ContentLayout frontmatter={enhancedFrontmatter}>
      <div className="space-y-8">
        <PageTitle
          title={config.title}
          description={config.description}
          align="center"
          size="large"
        />

        <div className="text-center">
          <Link 
            href={config.backRoute}
            className="inline-flex items-center px-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            ← Back to {config.title.replace('Complete ', '').replace(' Index', '')}
          </Link>
        </div>

        {items && items.length > 0 ? (
          <UnifiedListComponent 
            items={items}
            contentType={config.type}
            title=""
            showThumbnails={contentType === 'interview'}
            layout="list"
          />
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {config.title.replace('Complete ', '').replace(' Index', '')} Found
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
