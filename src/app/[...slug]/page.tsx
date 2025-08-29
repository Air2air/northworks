import { notFound } from 'next/navigation';
import { getAllContentSlugs } from '@/lib/content';
import { 
  loadNormalizedContent, 
  generateNormalizedMetadata, 
  shouldUseDirectRouting,
  CONTENT_TYPE_CONFIG,
  ContentTypeKey
} from '@/lib/page-templates';
import UnifiedContentPage from '@/components/pages/UnifiedContentPage';
import type { Metadata } from 'next';

// Map routes to content types - simplified and centralized
const routeToContentType: Record<string, ContentTypeKey> = {
  interviews: "interview",
  articles: "article", 
  reviews: "review",
  background: "background",
  professional: "professional",
  publications: "publication",
};

// Generate static params using normalized approach
export async function generateStaticParams() {
  const params = [];
  const allSlugs = getAllContentSlugs();

  for (const slug of allSlugs) {
    const normalizedData = await loadNormalizedContent(slug);
    if (!normalizedData) continue;

    const { contentType } = normalizedData;

    // Handle w- prefixed content as direct detail pages ONLY
    if (shouldUseDirectRouting(slug)) {
      params.push({
        slug: [slug], // Single segment for w- content
      });
    } else {
      // Handle c- prefixed and other content through categorized routes
      const route = Object.keys(routeToContentType).find(
        (key) => routeToContentType[key] === contentType
      );

      if (route) {
        params.push({
          slug: [route, slug], // Two segments for categorized content
        });
      }
    }
  }

  return params;
}

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

// Generate dynamic metadata using normalized approach
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Determine content slug and expected type
  let contentSlug: string;
  let expectedType: ContentTypeKey | undefined;

  if (slug.length === 1 && shouldUseDirectRouting(slug[0])) {
    // Direct w- prefixed page
    contentSlug = slug[0];
    expectedType = undefined; // Let loadNormalizedContent determine type
  } else if (slug.length === 2) {
    // Categorized page (e.g., /interviews/c-name)
    const [route, slugFromRoute] = slug;
    expectedType = routeToContentType[route];
    contentSlug = slugFromRoute;
    
    if (!expectedType) {
      return {
        title: 'Content Not Found | NorthWorks',
        description: 'The requested content type is not available.'
      };
    }
  } else {
    return {
      title: 'Content Not Found | NorthWorks',
      description: 'The requested content could not be found.'
    };
  }

  // Load normalized content data
  const normalizedData = await loadNormalizedContent(contentSlug, expectedType);

  if (!normalizedData) {
    return {
      title: 'Content Not Found | NorthWorks',
      description: 'The requested content could not be found.'
    };
  }

  return generateNormalizedMetadata(normalizedData);
}

export default async function UniversalContentPage({ params }: PageProps) {
  const { slug } = await params;

  // Determine content slug and expected type using same logic as generateMetadata
  let contentSlug: string;
  let expectedType: ContentTypeKey | undefined;
  let route: string | undefined;

  if (slug.length === 1 && shouldUseDirectRouting(slug[0])) {
    // Direct w- prefixed page
    contentSlug = slug[0];
    expectedType = undefined;
    route = undefined;
  } else if (slug.length === 2) {
    // Categorized page (e.g., /interviews/c-name)
    const [routeFromSlug, slugFromRoute] = slug;
    route = routeFromSlug;
    expectedType = routeToContentType[route];
    contentSlug = slugFromRoute;
    
    if (!expectedType) {
      notFound();
    }
  } else {
    notFound();
  }

  // Load normalized content data
  const normalizedData = await loadNormalizedContent(contentSlug, expectedType);

  if (!normalizedData) {
    notFound();
  }

  // Generate custom back link for categorized content
  let backLinkOverride;
  if (route && expectedType) {
    const config = CONTENT_TYPE_CONFIG[expectedType];
    backLinkOverride = {
      label: `← Back to ${config.routeLabel}`,
      href: config.routePath
    };
  }

  return (
    <UnifiedContentPage 
      data={normalizedData}
      backLinkOverride={backLinkOverride}
    />
  );
}
