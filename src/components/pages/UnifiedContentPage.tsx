/**
 * Unified Content Page Component - Standardized content display
 * Consolidates display patterns for all content types
 */

import React from 'react';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import PageTitle from '@/components/ui/PageTitle';
import SectionGrid from '@/components/ui/SectionGrid';
import ImageGallery from '@/components/ImageGallery';
import Tags from '@/components/ui/Tags';
import { formatDate } from '@/lib/dateUtils';
import { NormalizedContentData, CONTENT_TYPE_CONFIG } from '@/lib/page-templates';
import { CollectionType } from '@/types';

interface UnifiedContentPageProps {
  data: NormalizedContentData;
  backLinkOverride?: {
    label: string;
    href: string;
  };
}

/**
 * Unified content page component that handles all content types consistently
 */
export default function UnifiedContentPage({ 
  data, 
  backLinkOverride 
}: UnifiedContentPageProps) {
  const { 
    frontmatter, 
    htmlContent, 
    content, 
    breadcrumbs, 
    useSectionCards, 
    contentType,
    collection,
    slug
  } = data;

  const config = CONTENT_TYPE_CONFIG[contentType];

  // Default back link
  const defaultBackLink = {
    label: `← Back to ${config.routeLabel}`,
    href: config.routePath
  };

  const backLink = backLinkOverride || defaultBackLink;

  return (
    <UnifiedLayout breadcrumbs={breadcrumbs}>
      {useSectionCards ? (
        // Section-based layout for long list pages
        <SectionGrid 
          content={content}
          frontmatter={frontmatter}
        />
      ) : (
        // Standard content layout
        <>
          <PageTitle 
            title={frontmatter.title}
            size="medium"
            align="left"
          />
          
          {/* Content-specific metadata display */}
          <ContentMetadata 
            frontmatter={frontmatter} 
            contentType={contentType} 
          />

          {/* Tags display */}
          <ContentTags 
            frontmatter={frontmatter} 
            collection={collection}
          />

          {/* Main content */}
          <div className="prose prose-lg max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>

          {/* Images gallery */}
          <ContentImages frontmatter={frontmatter} />
        </>
      )}

      {/* Back navigation */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <a
          href={backLink.href}
          className="inline-flex items-center text-sky-600 hover:text-sky-800 transition-colors"
        >
          {backLink.label}
        </a>
      </div>
    </UnifiedLayout>
  );
}

/**
 * Content-specific metadata display component
 */
function ContentMetadata({ 
  frontmatter, 
  contentType 
}: { 
  frontmatter: any; 
  contentType: string; 
}) {
  // Professional content metadata
  if (contentType === 'professional' && 
      (frontmatter.organization || frontmatter.position || frontmatter.duration)) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Professional Details</h3>
        <div className="text-sm text-gray-600 space-y-1">
          {frontmatter.organization && (
            <p><strong>Organization:</strong> {frontmatter.organization}</p>
          )}
          {frontmatter.position && (
            <p><strong>Position:</strong> {frontmatter.position}</p>
          )}
          {frontmatter.duration && (
            <p><strong>Duration:</strong> {frontmatter.duration}</p>
          )}
        </div>
      </div>
    );
  }

  // Publication metadata
  if (contentType === 'publication' && frontmatter.publication) {
    const pub = frontmatter.publication;
    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Publication Details</h3>
        <div className="text-sm text-gray-600 space-y-1">
          {pub.journal && (
            <p><strong>Journal:</strong> {pub.journal}</p>
          )}
          {pub.publisher && (
            <p><strong>Publisher:</strong> {pub.publisher}</p>
          )}
          {pub.year && (
            <p><strong>Year:</strong> {pub.year}</p>
          )}
          {pub.pages && (
            <p><strong>Pages:</strong> {pub.pages}</p>
          )}
        </div>
      </div>
    );
  }

  // Interview/Article metadata
  if ((contentType === 'interview' || contentType === 'article') && 
      (frontmatter.publication || frontmatter.date)) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Publication Details</h3>
        <div className="text-sm text-gray-600 space-y-1">
          {frontmatter.publication?.outlet && (
            <p><strong>Published in:</strong> {frontmatter.publication.outlet}</p>
          )}
          {frontmatter.date && (
            <p><strong>Date:</strong> {formatDate(frontmatter.date)}</p>
          )}
          {frontmatter.publication?.author && (
            <p><strong>Author:</strong> {frontmatter.publication.author}</p>
          )}
        </div>
      </div>
    );
  }

  return null;
}

/**
 * Tags display component with consistent behavior
 */
function ContentTags({ 
  frontmatter, 
  collection 
}: { 
  frontmatter: any; 
  collection: CollectionType; 
}) {
  // Extract tags from various possible fields
  const getTags = () => {
    if (frontmatter.tags && Array.isArray(frontmatter.tags)) return frontmatter.tags;
    if (frontmatter.subjects && Array.isArray(frontmatter.subjects)) return frontmatter.subjects;
    if (frontmatter.keywords && Array.isArray(frontmatter.keywords)) return frontmatter.keywords;
    return [];
  };

  const tags = getTags();

  if (tags.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">
        {frontmatter.subjects ? 'Subjects' : 'Tags'}
      </h3>
      <Tags 
        tags={tags} 
        variant="compact"
        collection={collection}
      />
    </div>
  );
}

/**
 * Images gallery component with consistent behavior
 */
function ContentImages({ frontmatter }: { frontmatter: any }) {
  if (!frontmatter.images || !Array.isArray(frontmatter.images) || frontmatter.images.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Related Images</h3>
      <ImageGallery images={frontmatter.images} />
    </section>
  );
}
