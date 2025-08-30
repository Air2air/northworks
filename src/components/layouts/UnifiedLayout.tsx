import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxOptions, mdxComponents } from '@/lib/mdxConfig';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedMetadata from '@/components/ui/UnifiedMetadata';
import ImageGallery from '@/components/ImageGallery';
import Tags from '@/components/ui/Tags';
import { cleanTitle } from '@/lib/pathUtils';
import { formatDate } from '@/lib/dateUtils';
import { 
  getPageTitle, 
  getPageSubtitle,
  getPublicationInfo,
  shouldShowPublicationInfo 
} from '@/lib/fieldNormalization';
import { UnifiedLayoutProps, BreadcrumbItem } from '@/types';

/**
 * Unified layout component that handles both simple pages and detailed content pages
 * 
 * Usage patterns:
 * 1. Simple pages: <UnifiedLayout>{children}</UnifiedLayout>
 * 2. Content pages: <UnifiedLayout frontmatter={...} content={...} slug={...} etc />
 * 
 * When frontmatter/content are provided, renders as a content detail page
 * Otherwise, renders as a simple page layout with children
 */
export default function UnifiedLayout({ 
  children,
  breadcrumbs: providedBreadcrumbs,
  className = "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8",
  frontmatter,
  content,
  slug,
  contentType,
  breadcrumbConfig,
  collection = "global"
}: UnifiedLayoutProps) {
  
  // Determine if this is a content detail page
  const isContentDetail = !!(frontmatter && content && slug && contentType && breadcrumbConfig);
  
  // Generate breadcrumbs for content detail pages
  const generateContentBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/', active: false }
    ];
    
    if (breadcrumbConfig!.grandParentPath && breadcrumbConfig!.grandParentLabel) {
      breadcrumbs.push({
        label: breadcrumbConfig!.grandParentLabel,
        href: breadcrumbConfig!.grandParentPath,
        active: false,
      });
    }
    
    breadcrumbs.push({
      label: breadcrumbConfig!.parentLabel,
      href: breadcrumbConfig!.parentPath,
      active: false,
    });
    
    breadcrumbs.push({
      label: cleanTitle(frontmatter.title),
      href: `${breadcrumbConfig!.parentPath}/${slug}`,
      active: true,
    });
    
    return breadcrumbs;
  };
  
  // Use provided breadcrumbs or generated ones
  const finalBreadcrumbs = providedBreadcrumbs || (isContentDetail ? generateContentBreadcrumbs() : undefined);
  
  // Content detail page rendering
  if (isContentDetail) {
    return (
      <div className={className}>
        <div className="px-4 py-6 sm:px-0">
          {finalBreadcrumbs && <Breadcrumbs items={finalBreadcrumbs} />}
          <div className="max-w-4xl mx-auto">
            <ContentDetailRenderer 
              frontmatter={frontmatter}
              content={content}
              contentType={contentType}
              collection={collection}
            />
          </div>
        </div>
      </div>
    );
  }

  // Simple page layout rendering
  return (
    <div className={className}>
      <div className="px-4 py-6 sm:px-0">
        {finalBreadcrumbs && <Breadcrumbs items={finalBreadcrumbs} />}
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Content detail renderer - extracted for cleaner code organization
 */
function ContentDetailRenderer({ 
  frontmatter, 
  content, 
  contentType, 
  collection 
}: {
  frontmatter: any;
  content: string;
  contentType: string;
  collection: "cheryl" | "warner" | "global";
}) {
  // Helper functions using normalized field access
  const getTagsField = (frontmatter: any) => {
    return frontmatter?.keywords || frontmatter?.tags || null;
  };

  const tags = getTagsField(frontmatter);
  const title = getPageTitle(frontmatter);
  const subtitle = getPageSubtitle(frontmatter, contentType);
  const pubInfo = getPublicationInfo(frontmatter);
  const showPubInfo = shouldShowPublicationInfo(frontmatter);

  return (
    <>
      <header className="mb-8">
        <PageTitle 
          title={title}
          description={subtitle}
          size="medium"
          align="left"
        />

        {/* Publication Info */}
        {showPubInfo && (
          <div className="mb-6">
            <UnifiedMetadata
              fields={(() => {
                const fields = [];
                if (pubInfo.journal) {
                  fields.push({
                    label: 'Publication',
                    value: pubInfo.journal
                  });
                }
                if (pubInfo.date) {
                  fields.push({
                    label: 'Date',
                    value: formatDate(pubInfo.date) || pubInfo.date
                  });
                }
                return fields;
              })()}
              variant="detail"
            />
          </div>
        )}

        {/* Tags - only show for Cheryl content, not Warner content */}
        {tags && tags.length > 0 && collection !== 'warner' && (
          <div className="mb-6">
            <Tags tags={tags} variant="medium" collection={collection} />
          </div>
        )}
      </header>

      {/* Content with inline images */}
      <div className="prose prose-lg max-w-none">
        {/* Frontmatter images - floated inline at top of content */}
        {frontmatter.images && Array.isArray(frontmatter.images) && frontmatter.images.length > 0 && (
          <ImageGallery images={frontmatter.images} inline={true} />
        )}
        
        {content && content.length > 0 ? (
          <MDXRemote 
            source={content} 
            options={mdxOptions}
            components={mdxComponents}
          />
        ) : (
          <div className="bg-yellow-100 border border-yellow-300 p-4">
            <p>No content to render</p>
          </div>
        )}
      </div>
    </>
  );
}
