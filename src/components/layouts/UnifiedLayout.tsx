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
import { UnifiedLayoutProps, BreadcrumbItem } from '@/types';

/**
 * Unified layout component that handles both simple pages and detailed content pages
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
  const contentBreadcrumbs: BreadcrumbItem[] = [];
  if (isContentDetail) {
    contentBreadcrumbs.push({ label: 'Home', href: '/', active: false });
    
    if (breadcrumbConfig!.grandParentPath && breadcrumbConfig!.grandParentLabel) {
      contentBreadcrumbs.push({
        label: breadcrumbConfig!.grandParentLabel,
        href: breadcrumbConfig!.grandParentPath,
        active: false,
      });
    }
    
    contentBreadcrumbs.push({
      label: breadcrumbConfig!.parentLabel,
      href: breadcrumbConfig!.parentPath,
      active: false,
    });
    
    contentBreadcrumbs.push({
      label: cleanTitle(frontmatter.title),
      href: `${breadcrumbConfig!.parentPath}/${slug}`,
      active: true,
    });
  }
  
  // Use provided breadcrumbs or generated ones
  const finalBreadcrumbs = providedBreadcrumbs || (isContentDetail ? contentBreadcrumbs : undefined);
  
  // Helper functions for content detail rendering
  const getTagsField = (frontmatter: any, contentType: string) => {
    // Try different possible tag field names based on content type
    const tagFields = ['tags', 'subjects', 'keywords', 'categories'];
    
    for (const field of tagFields) {
      if (frontmatter[field] && Array.isArray(frontmatter[field]) && frontmatter[field].length > 0) {
        return frontmatter[field];
      }
    }
    
    return null;
  };

  const getSubtitle = (frontmatter: any, contentType: string) => {
    if (contentType === 'publication' && frontmatter.journal) {
      return `Published in ${frontmatter.journal}`;
    }
    if (contentType === 'professional' && frontmatter.organization) {
      return frontmatter.organization;
    }
    if (contentType === 'interview' && frontmatter.interviewee) {
      return `Interview with ${frontmatter.interviewee}`;
    }
    if (frontmatter.subtitle) {
      return frontmatter.subtitle;
    }
    return undefined;
  };

  const shouldShowPublicationInfo = (frontmatter: any, contentType: string) => {
    return contentType === 'publication' && (frontmatter.journal || frontmatter.publication?.date);
  };

  // Render content detail page
  if (isContentDetail) {
    const tags = getTagsField(frontmatter, contentType!);
    const subtitle = getSubtitle(frontmatter, contentType!);
    const showPubInfo = shouldShowPublicationInfo(frontmatter, contentType!);

    return (
      <div className={className}>
        <div className="px-4 py-6 sm:px-0">
          {finalBreadcrumbs && <Breadcrumbs items={finalBreadcrumbs} />}
          <div className="max-w-4xl mx-auto">
            
            <header className="mb-8">
              <PageTitle 
                title={frontmatter.title}
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
                      if (frontmatter.journal) {
                        fields.push({
                          label: 'Publication',
                          value: frontmatter.journal
                        });
                      }
                      if (frontmatter.publication?.date) {
                        fields.push({
                          label: 'Date',
                          value: frontmatter.publication.date
                        });
                      }
                      return fields;
                    })()}
                    variant="detail"
                  />
                </div>
              )}

              {/* Tags */}
              {tags && tags.length > 0 && (
                <div className="mb-6">
                  <Tags tags={tags} variant="medium" collection={collection} />
                </div>
              )}
            </header>

            {/* Content with inline images */}
            <div className="prose prose-lg max-w-none">
              {/* Frontmatter images - floated inline at top of content */}
              {frontmatter.images && frontmatter.images.length > 0 && (
                <ImageGallery images={frontmatter.images} inline={true} />
              )}
              
              {/* Main content */}
              <MDXRemote 
                source={content} 
                options={mdxOptions} 
                components={mdxComponents} 
              />
            </div>

            {/* Standalone Images Gallery - only if not already shown inline */}
            {frontmatter.images && frontmatter.images.length > 0 && (
              <section className="mt-8">
                <ImageGallery images={frontmatter.images} />
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render simple page layout
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
