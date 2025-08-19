import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxOptions, mdxComponents } from '@/lib/mdxConfig';
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

  // Get appropriate tags field based on content type - using JSON tags exclusively
  const getTagsField = (frontmatter: any, type: string) => {
    // Use tags field from JSON data (unified approach)
    if ((frontmatter as any).tags) {
      return (frontmatter as any).tags;
    }
    // Fallback to common fields
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
              <Tags tags={tags} variant="medium" />
            </div>
          )}
        </header>

        {/* Content with inline images */}
        <div className="prose prose-lg max-w-none">
          {/* Frontmatter images - floated inline at top of content */}
          {frontmatter.images && frontmatter.images.length > 0 && (
            <ImageGallery images={frontmatter.images} inline={true} />
          )}
          
          <MDXRemote 
            source={content}
            options={mdxOptions}
            components={mdxComponents}
          />
        </div>

        {/* Back Navigation */}
        <div className="mt-12 pt-8 border-t border-sky-200">
          <a
            href={breadcrumbConfig.parentPath}
            className="inline-flex items-center text-sky-600 hover:text-sky-800 transition-colors no-underline"
          >
            ← Back to {breadcrumbConfig.parentLabel}
          </a>
        </div>
      </article>
    </PageLayout>
  );
}
