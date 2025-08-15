/**
 * UltimateUnifiedPage - The most consolidated page component possible
 * Handles content pages, index pages, slug pages, and portfolio pages
 * Uses enhanced frontmatter for maximum configurability
 */

import React from 'react';
import { getContentBySlug, getContentByType } from '@/lib/content';
import { ContentFrontmatter } from '@/types/content';
import { UnifiedPageConfig, createUnifiedPageConfig } from '@/types/enhancedContent';
import ContentLayout from '@/components/layouts/ContentLayout';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedListComponent, { parseInterviewsFromMarkdown, parseArticlesFromMarkdown, parseReviewsFromMarkdown, parseProjectsFromMarkdown } from '@/components/ui/UnifiedListComponent';
import UnifiedSlugPage from '@/components/pages/UnifiedSlugPage';
import UnifiedPortfolioPage from '@/components/pages/UnifiedPortfolioPage';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type PageType = 'content-list' | 'content-index' | 'content-slug' | 'portfolio' | 'custom';
type ContentType = 'interview' | 'article' | 'review' | 'project' | 'professional';
type PortfolioType = 'comprehensive' | 'specialized';

interface UltimateUnifiedPageProps {
  pageType: PageType;
  contentType?: ContentType;
  portfolioType?: PortfolioType;
  slug?: string;
  config?: Partial<UnifiedPageConfig>;
  customRenderer?: React.ComponentType<any>;
}

// Page type configurations
const pageTypeConfigs = {
  'content-list': {
    showIndex: true,
    showIndividual: true,
    maxIndexItems: 12,
    maxIndividualItems: 6
  },
  'content-index': {
    showIndex: true,
    showIndividual: false,
    maxIndexItems: undefined,
    maxIndividualItems: 0
  },
  'content-slug': {
    showIndex: false,
    showIndividual: false,
    maxIndexItems: 0,
    maxIndividualItems: 0
  },
  'portfolio': {
    showIndex: false,
    showIndividual: false,
    maxIndexItems: 0,
    maxIndividualItems: 0
  },
  'custom': {
    showIndex: false,
    showIndividual: false,
    maxIndexItems: 0,
    maxIndividualItems: 0
  }
};

export async function generateUltimateStaticParams(contentType: ContentType) {
  const content = getContentByType(contentType);
  return content.map((item) => ({ slug: item.slug }));
}

export async function generateUltimateMetadata(
  pageType: PageType,
  contentType?: ContentType,
  slug?: string
): Promise<Metadata> {
  if (pageType === 'content-slug' && contentType && slug) {
    const content = getContentBySlug(slug);
    if (!content || content.frontmatter.type !== contentType) {
      return { title: `${contentType} Not Found` };
    }
    return {
      title: content.frontmatter.title,
      description: content.frontmatter.seo?.description || content.frontmatter.title,
      keywords: content.frontmatter.seo?.keywords
    };
  }

  const config = createUnifiedPageConfig(contentType || 'content');
  return {
    title: config.metadata.title,
    description: config.metadata.description,
    keywords: config.metadata.keywords
  };
}

export default function UltimateUnifiedPage({
  pageType,
  contentType = 'article',
  portfolioType = 'comprehensive',
  slug,
  config: configOverrides = {},
  customRenderer: CustomRenderer
}: UltimateUnifiedPageProps) {
  // Handle slug pages by delegating to existing unified components
  if (pageType === 'content-slug' && slug) {
    return <UnifiedSlugPage contentType={contentType} slug={slug} />;
  }

  // Handle portfolio pages
  if (pageType === 'portfolio') {
    return <UnifiedPortfolioPage portfolioType={portfolioType} />;
  }

  // Handle custom pages
  if (pageType === 'custom' && CustomRenderer) {
    return <CustomRenderer />;
  }

  // Create unified page configuration
  const config = createUnifiedPageConfig(contentType, configOverrides);
  const pageConfig = pageTypeConfigs[pageType];

  // Get content data
  const indexData = config.dataSource.slug ? getContentBySlug(config.dataSource.slug) : null;
  const individualItems = getContentByType(contentType);

  // Create navigation
  const defaultNavigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: false }
  ];

  // Create frontmatter
  const frontmatter = indexData?.frontmatter || {
    id: `${contentType}-${pageType}`,
    title: config.display.title,
    type: 'article' as const,
    seo: {
      title: config.metadata.title,
      description: config.metadata.description,
      keywords: config.metadata.keywords
    },
    navigation: defaultNavigation,
    breadcrumbs: config.navigation.breadcrumbs
  };

  const enhancedFrontmatter = {
    ...frontmatter,
    navigation: defaultNavigation,
    breadcrumbs: config.navigation.breadcrumbs
  };

  // Parse content if available
  let indexItems: any[] = [];
  if (indexData && pageConfig.showIndex) {
    // Dynamically import and use appropriate parser
    const parserMap = {
      interview: parseInterviewsFromMarkdown,
      article: parseArticlesFromMarkdown,
      review: parseReviewsFromMarkdown,
      project: parseProjectsFromMarkdown,
      professional: parseProjectsFromMarkdown
    };

    if (parserMap[contentType]) {
      try {
        const parser = parserMap[contentType];
        const images = (indexData.frontmatter as any).images || [];
        indexItems = parser(indexData.content, images);
      } catch (error) {
        console.error(`Error parsing ${contentType} content:`, error);
      }
    }
  }

  return (
    <ContentLayout frontmatter={enhancedFrontmatter as any}>
      <div className="space-y-8">
        <PageTitle
          title={config.display.title}
          description={config.display.description}
          align="center"
          size="large"
        />

        {/* Back/Navigation Links */}
        {config.navigation.backLink && (
          <div className="text-center">
            <Link 
              href={config.navigation.backLink.href}
              className="inline-flex items-center px-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              ← {config.navigation.backLink.label}
            </Link>
          </div>
        )}

        {/* Index Link (for content-list pages) */}
        {pageType === 'content-list' && config.navigation.indexLink && (
          <div className="text-center">
            <Link 
              href={config.navigation.indexLink.href}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {config.navigation.indexLink.label} →
            </Link>
          </div>
        )}

        {/* Index Content */}
        {pageConfig.showIndex && indexItems.length > 0 && (
          <div className="space-y-6">
            <UnifiedListComponent 
              items={indexItems.slice(0, pageConfig.maxIndexItems)}
              contentType={contentType}
              title=""
              showThumbnails={config.display.showThumbnails}
              layout={config.display.layout === 'cards' ? 'grid' : config.display.layout as 'grid' | 'list'}
            />
          </div>
        )}

        {/* Individual Content Items */}
        {pageConfig.showIndividual && individualItems.length > 0 && (
          <div className="space-y-6">
            {indexItems.length > 0 && (
              <div className="border-t pt-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                  Featured {config.display.title}
                </h2>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {individualItems.slice(0, pageConfig.maxIndividualItems).map((item, index) => (
                <Link 
                  key={item.slug} 
                  href={`/${contentType}s/${item.slug}`}
                  className="block group"
                >
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {item.frontmatter.title}
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
        {!indexItems.length && !individualItems.length && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {config.display.title} Found
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
