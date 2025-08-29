/**
 * Generic Content Detail Page Component
 * Consolidates all content type detail pages (individual articles, reviews, interviews, etc.)
 */

import { loadNormalizedContent, generateNormalizedMetadata, generateContentTypeParams } from '@/lib/page-templates';
import UnifiedContentPage from '@/components/pages/UnifiedContentPage';
import { getAllContentSlugs } from '@/lib/content';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Content type configuration for back links
const BACK_LINK_CONFIG = {
  article: { label: "← Back to Articles", href: "/articles" },
  review: { label: "← Back to Reviews", href: "/reviews" },
  interview: { label: "← Back to Interviews", href: "/interviews" },
  publication: { label: "← Back to Publications", href: "/publications" },
  professional: { label: "← Back to Professional Experience", href: "/professional" },
  background: { label: "← Back to Background", href: "/background" }
} as const;

const NOT_FOUND_METADATA = {
  article: { title: 'Article Not Found | NorthWorks', description: 'The requested article could not be found.' },
  review: { title: 'Review Not Found | NorthWorks', description: 'The requested review could not be found.' },
  interview: { title: 'Interview Not Found | NorthWorks', description: 'The requested interview could not be found.' },
  publication: { title: 'Publication Not Found | NorthWorks', description: 'The requested publication could not be found.' },
  professional: { title: 'Professional Experience Not Found | NorthWorks', description: 'The requested professional experience could not be found.' },
  background: { title: 'Background Information Not Found | NorthWorks', description: 'The requested background information could not be found.' }
} as const;

export type ContentType = keyof typeof BACK_LINK_CONFIG;

interface ContentDetailPageProps {
  params: Promise<{ slug: string }>;
  contentType: ContentType;
}

/**
 * Generate metadata for content detail pages
 */
export async function generateContentDetailMetadata(
  params: Promise<{ slug: string }>, 
  contentType: ContentType
): Promise<Metadata> {
  const resolvedParams = await params;
  const normalizedData = await loadNormalizedContent(resolvedParams.slug, contentType);
  
  if (!normalizedData) {
    return NOT_FOUND_METADATA[contentType];
  }

  return generateNormalizedMetadata(normalizedData);
}

/**
 * Generate static params for content detail pages
 */
export function generateContentDetailStaticParams(contentType: ContentType) {
  const allSlugs = getAllContentSlugs();
  return generateContentTypeParams(contentType, allSlugs)
    .filter(({ slug }) => !slug.startsWith('w-')); // Exclude w- prefixed content (handled by catch-all route)
}

/**
 * Generic content detail page component
 */
export default async function ContentDetailPage({ params, contentType }: ContentDetailPageProps) {
  const resolvedParams = await params;
  const normalizedData = await loadNormalizedContent(resolvedParams.slug, contentType);
  
  if (!normalizedData) {
    notFound();
  }

  return (
    <UnifiedContentPage 
      data={normalizedData}
      backLinkOverride={BACK_LINK_CONFIG[contentType]}
    />
  );
}
