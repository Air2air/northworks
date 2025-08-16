import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import PageLayout from './PageLayout';
import PageTitle from '@/components/ui/PageTitle';
import PublicationInfo from '@/components/ui/PublicationInfo';
import ImageGallery from '@/components/ImageGallery';
import Tags from '@/components/ui/Tags';
import { cleanTitle } from '@/lib/pathUtils';
import { formatDate } from '@/lib/dateUtils';

interface BreadcrumbItem {
  label: string;
  href: string;
  active: boolean;
}

interface ContentDetailLayoutProps {
  frontmatter: any; // Using any to handle different frontmatter types
  content: string;
  slug: string;
  contentType: string;
  breadcrumbConfig: {
    parentPath: string;
    parentLabel: string;
    grandParentPath?: string;
    grandParentLabel?: string;
  };
}

/**
 * Unified content detail layout component
 * Handles all content types with dynamic formatting based on frontmatter properties
 */
export default function ContentDetailLayout({
  frontmatter,
  content,
  slug,
  contentType,
  breadcrumbConfig
}: ContentDetailLayoutProps) {
  
  // Create breadcrumbs dynamically
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/', active: false }
  ];

  if (breadcrumbConfig.grandParentPath && breadcrumbConfig.grandParentLabel) {
    breadcrumbs.push({
      label: breadcrumbConfig.grandParentLabel,
      href: breadcrumbConfig.grandParentPath,
      active: false
    });
  }

  breadcrumbs.push({
    label: breadcrumbConfig.parentLabel,
    href: breadcrumbConfig.parentPath,
    active: false
  });

  breadcrumbs.push({
    label: cleanTitle(frontmatter.title),
    href: `${breadcrumbConfig.parentPath}/${slug}`,
    active: true
  });

  // Dynamic content type labels
  const getContentTypeLabel = (type: string) => {
    const labels = {
      'interview': 'Interview',
      'article': 'Article',
      'review': 'Review', 
      'background': 'Background',
      'professional': 'Professional Work',
      'publication': 'Publication'
    };
    return labels[type as keyof typeof labels] || 'Content';
  };

  // Dynamic publication section labels
  const getPublicationLabel = (type: string) => {
    return type === 'interview' ? 'Publication Info' : 'Publication Information';
  };

  // Get appropriate tags field based on content type
  const getTagsField = (frontmatter: any, type: string) => {
    // Check for specific fields first based on content type
    if ((type === 'interview' || type === 'article' || type === 'review') && frontmatter.subjects) {
      return frontmatter.subjects;
    }
    // Fallback to common fields
    if (frontmatter.tags) return frontmatter.tags;
    if (frontmatter.keywords) return frontmatter.keywords;
    return [];
  };

  // Get appropriate tags label based on content type
  const getTagsLabel = (type: string) => {
    if (type === 'interview') return 'People Interviewed';
    if (type === 'article') return 'Subjects';
    if (type === 'review') return 'Performance Details';
    if (type === 'professional') return 'Areas of Expertise';
    if (type === 'publication') return 'Keywords';
    return 'Tags';
  };

  const tags = getTagsField(frontmatter, contentType);

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <article>
        {/* Header */}
        <header className="mb-8">
          <PageTitle 
            title={frontmatter.title}
            size="medium"
            align="left"
          />
          
          {/* Publication Information */}
          {frontmatter.publication && (
            <PublicationInfo
              date={frontmatter.publication.date ? formatDate(frontmatter.publication.date) : null}
              publication={frontmatter.publication.outlet || frontmatter.publication.publisher}
              section={frontmatter.publication.section}
              author={frontmatter.publication.author}
              title={getPublicationLabel(contentType)}
            />
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">{getTagsLabel(contentType)}</h3>
              <Tags tags={tags} variant="medium" maxVisible={10} />
            </div>
          )}
        </header>

        {/* Images */}
        {frontmatter.images && frontmatter.images.length > 0 && (
          <div className="mb-8">
            <ImageGallery images={frontmatter.images} layout="grid" />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <MDXRemote source={content} />
        </div>

        {/* Back Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <a
            href={breadcrumbConfig.parentPath}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to {breadcrumbConfig.parentLabel}
          </a>
        </div>
      </article>
    </PageLayout>
  );
}
