/**
 * UnifiedSlugPage - Reusable slug page component for content types (interviews, articles, reviews)
 * Consolidates the logic and layout for individual content pages
 */

import React from 'react';
import { getContentBySlug, getContentByType } from '@/lib/content';
import { InterviewFrontmatter, ArticleFrontmatter, ReviewFrontmatter, ContentData, ContentType } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import ImageGallery from '@/components/ImageGallery';
import PageTitle from '@/components/ui/PageTitle';
import { cleanTitle } from '@/lib/pathUtils';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import { notFound } from 'next/navigation';
import Tags from '@/components/ui/Tags';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

interface SlugConfig {
  type: ContentType;
  title: string;
  backRoute: string;
  indexRoute: string;
}

const slugConfigs: Record<ContentType, SlugConfig> = {
  interview: {
    type: 'interview',
    title: 'Interviews',
    backRoute: '/interviews',
    indexRoute: '/interviews-index'
  },
  article: {
    type: 'article', 
    title: 'Articles',
    backRoute: '/articles',
    indexRoute: '/articles-index'
  },
  review: {
    type: 'review',
    title: 'Reviews',
    backRoute: '/reviews',
    indexRoute: '/reviews-index'
  },
  biography: {
    type: 'biography',
    title: 'Biography',
    backRoute: '/',
    indexRoute: '/'
  },
  homepage: {
    type: 'homepage',
    title: 'Home',
    backRoute: '/',
    indexRoute: '/'
  },
  project: {
    type: 'project',
    title: 'Projects',
    backRoute: '/warner/projects',
    indexRoute: '/warner/projects-index'
  },
  professional: {
    type: 'professional',
    title: 'Professional',
    backRoute: '/warner/professional',
    indexRoute: '/warner/professional-index'
  }
};

interface UnifiedSlugPageProps {
  contentType: ContentType;
  slug: string;
}

export function generateUnifiedStaticParams(contentType: ContentType) {
  const content = getContentByType(contentType);
  
  return content.map((item: ContentData) => ({
    slug: item.slug,
  }));
}

export async function generateUnifiedMetadata(
  contentType: ContentType, 
  slug: string
): Promise<Metadata> {
  const content = getContentBySlug(slug);
  
  if (!content || content.frontmatter.type !== contentType) {
    return {
      title: `${slugConfigs[contentType].title.slice(0, -1)} Not Found`,
    };
  }

  const title = cleanTitle(content.frontmatter.title);
  const description = content.frontmatter.seo?.description || 
    `${slugConfigs[contentType].title.slice(0, -1)} - ${title}`;

  return {
    title: title,
    description: description,
    keywords: content.frontmatter.seo?.keywords,
  };
}

export default async function UnifiedSlugPage({ contentType, slug }: UnifiedSlugPageProps) {
  const config = slugConfigs[contentType];
  const contentData = getContentBySlug(slug);
  
  if (!contentData || contentData.frontmatter.type !== contentType) {
    notFound();
  }

  const frontmatter = contentData.frontmatter as InterviewFrontmatter | ArticleFrontmatter | ReviewFrontmatter;
  const mdxSource = await serialize(contentData.content);

  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: config.title, href: config.backRoute, active: false },
    { label: cleanTitle(frontmatter.title), href: `/${contentType}s/${slug}`, active: true }
  ];

  // Default navigation
  const defaultNavigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: false }
  ];

  const enhancedFrontmatter = {
    ...frontmatter,
    navigation: defaultNavigation,
    breadcrumbs: breadcrumbs
  };

  // Get related content
  const relatedContent = getContentByType(contentType)
    .filter(item => item.slug !== slug)
    .slice(0, 3);

  return (
    <ContentLayout frontmatter={enhancedFrontmatter}>
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <PageTitle
            title={cleanTitle(frontmatter.title)}
            align="center"
            size="large"
          />

          {/* Content type specific metadata */}
          {contentType === 'interview' && frontmatter.type === 'interview' && (
            <div className="mt-6 text-center space-y-2">
              {frontmatter.subject?.people && frontmatter.subject.people.length > 0 && (
                <p className="text-lg text-gray-700">
                  Interview with {frontmatter.subject.people.map(p => p.name).join(', ')}
                </p>
              )}
              {frontmatter.publication?.date && (
                <p className="text-sm text-gray-500">
                  Published: {new Date(frontmatter.publication.date).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {contentType === 'review' && frontmatter.type === 'review' && (
            <div className="mt-6 text-center space-y-2">
              {frontmatter.performance?.venue && (
                <p className="text-lg text-gray-700">
                  {frontmatter.performance.organization} at {frontmatter.performance.venue}
                </p>
              )}
              {frontmatter.performance?.date && (
                <p className="text-sm text-gray-500">
                  Performance: {new Date(frontmatter.performance.date).toLocaleDateString()}
                </p>
              )}
              {frontmatter.publication?.date && (
                <p className="text-sm text-gray-500">
                  Review Published: {new Date(frontmatter.publication.date).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {contentType === 'article' && frontmatter.type === 'article' && (
            <div className="mt-6 text-center space-y-2">
              {frontmatter.publication?.date && (
                <p className="text-sm text-gray-500">
                  Published: {new Date(frontmatter.publication.date).toLocaleDateString()}
                </p>
              )}
              {frontmatter.category && (
                <p className="text-sm text-gray-600">
                  Category: {frontmatter.category}
                </p>
              )}
            </div>
          )}

          {/* Tags */}
          {frontmatter.subjects && frontmatter.subjects.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Tags tags={frontmatter.subjects} />
            </div>
          )}
        </header>

        {/* Images */}
        {frontmatter.images && frontmatter.images.length > 0 && (
          <div className="mb-8">
            <ImageGallery images={frontmatter.images} />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <MDXRemote {...mdxSource} />
        </div>

        {/* Navigation */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <Link 
              href={config.backRoute}
              className="inline-flex items-center px-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              ← Back to {config.title}
            </Link>
            
            <Link 
              href={config.indexRoute}
              className="inline-flex items-center px-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              View Complete Index →
            </Link>
          </div>
        </footer>

        {/* Related Content */}
        {relatedContent.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Related {config.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedContent.map((item) => (
                <Link 
                  key={item.slug} 
                  href={`/${contentType}s/${item.slug}`}
                  className="block group"
                >
                  <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {cleanTitle(item.frontmatter.title)}
                    </h3>
                    {(item.frontmatter as any).description && (
                      <p className="text-gray-600 text-sm">
                        {((item.frontmatter as any).description as string).substring(0, 100)}...
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </ContentLayout>
  );
}
