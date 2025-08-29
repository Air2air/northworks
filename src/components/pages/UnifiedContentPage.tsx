/**
 * Unified Content Page Component - Standardized content display
 * 
 * This component provides a higher-level interface for content pages,
 * handling section-based layouts and providing unified back navigation.
 * For simple content pages, consider using UnifiedLayout directly.
 */

import React from 'react';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import SectionGrid from '@/components/ui/SectionGrid';
import { NormalizedContentData, CONTENT_TYPE_CONFIG } from '@/lib/page-templates';

interface UnifiedContentPageProps {
  data: NormalizedContentData;
  backLinkOverride?: {
    label: string;
    href: string;
  };
}

/**
 * Unified content page component that handles all content types consistently
 * 
 * This component wraps UnifiedLayout and adds:
 * - Section-based rendering for complex content
 * - Back navigation links
 * - Content type-specific configuration
 */
export default function UnifiedContentPage({ 
  data, 
  backLinkOverride 
}: UnifiedContentPageProps) {
  const { 
    frontmatter, 
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
    <UnifiedLayout 
      breadcrumbs={breadcrumbs}
      frontmatter={useSectionCards ? undefined : frontmatter}
      content={useSectionCards ? undefined : content}
      slug={useSectionCards ? undefined : slug}
      contentType={useSectionCards ? undefined : contentType}
      breadcrumbConfig={useSectionCards ? undefined : {
        parentPath: config.routePath,
        parentLabel: config.routeLabel
      }}
      collection={collection}
    >
      {useSectionCards ? (
        // Section-based layout for long list pages
        <SectionGrid 
          content={content}
          frontmatter={frontmatter}
        />
      ) : null}

      {/* Back navigation - always show for content pages */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <a
          href={backLink.href}
          className="inline-flex items-center text-sky-600 hover:text-sky-800 transition-colors no-underline"
        >
          {backLink.label}
        </a>
      </div>
    </UnifiedLayout>
  );
}
