import { notFound } from 'next/navigation';
import { getContentBySlug, getAllContentSlugs } from '@/lib/content';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import PageTitle from '@/components/ui/PageTitle';
import { getCollectionFromSlug, CollectionType } from '@/types';
import type { Metadata } from 'next';

// Map routes to content types
const routeToContentType: Record<string, string> = {
  interviews: "interview",
  articles: "article",
  reviews: "review",
  background: "background",
  professional: "professional",
  publications: "publication",
};

// Get breadcrumb configuration for each content type
const getBreadcrumbConfig = (contentType: string, slug: string) => {
  // Determine if this is Warner content (w-* prefix)
  const isWarnerContent = slug && slug.startsWith("w-");
  const grandParentPath = isWarnerContent ? "/warner" : "/cheryl";
  const grandParentLabel = isWarnerContent ? "D. Warner North" : "Cheryl North";

  const configs = {
    interview: {
      parentPath: "/interviews",
      parentLabel: "Interviews",
      grandParentPath,
      grandParentLabel,
    },
    article: {
      parentPath: "/articles",
      parentLabel: "Articles",
      grandParentPath,
      grandParentLabel,
    },
    review: {
      parentPath: "/reviews",
      parentLabel: "Reviews",
      grandParentPath,
      grandParentLabel,
    },
    background: {
      parentPath: "/background",
      parentLabel: "Background",
      grandParentPath,
      grandParentLabel,
    },
    professional: {
      parentPath: "/professional",
      parentLabel: "Professional Work",
      grandParentPath,
      grandParentLabel,
    },
    publication: {
      parentPath: "/publications",
      parentLabel: "Publications",
      grandParentPath,
      grandParentLabel,
    },
  };

  return configs[contentType as keyof typeof configs] || configs.article;
};

// Generate static params for all content
export async function generateStaticParams() {
  const params = [];
  const allSlugs = getAllContentSlugs();

  // Get all content and organize by type
  for (const slug of allSlugs) {
    const content = getContentBySlug(slug, false);
    if (content && content.frontmatter.type) {
      const contentType = content.frontmatter.type;

      // Handle w- prefixed content as direct detail pages ONLY
      if (slug.startsWith('w-')) {
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
  }

  return params;
}

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

// Generate dynamic metadata for each content page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Handle both single w- prefixed pages and categorized pages
  let contentType: string;
  let itemSlug: string;

  if (slug.length === 1 && slug[0].startsWith('w-')) {
    // Direct w- prefixed page
    itemSlug = slug[0];
    // Get content to determine actual type
    const content = getContentBySlug(itemSlug, false);
    contentType = content?.frontmatter.type || 'professional';
  } else if (slug.length === 2) {
    // Categorized page (e.g., /interviews/c-name)
    const [route, slugFromRoute] = slug;
    contentType = routeToContentType[route];
    itemSlug = slugFromRoute;
    
    if (!contentType) {
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

  // Get the content
  const contentData = getContentBySlug(itemSlug, false);

  if (!contentData || contentData.frontmatter.type !== contentType) {
    return {
      title: 'Content Not Found | NorthWorks',
      description: 'The requested content could not be found.'
    };
  }

  const frontmatter = contentData.frontmatter as any;
  const title = frontmatter.title;
  
  // Create contextual description
  const getDescription = (type: string, fm: any) => {
    if (fm.summary) return fm.summary;
    
    const authorName = fm.publication?.author || 'NorthWorks';
    const publicationName = fm.publication?.outlet || fm.publication?.publisher;
    
    switch (type) {
      case 'interview':
        return `Interview ${publicationName ? `published in ${publicationName}` : `by ${authorName}`}`;
      case 'article':
        return `Article ${publicationName ? `published in ${publicationName}` : `by ${authorName}`}`;
      case 'review':
        return `Review ${publicationName ? `published in ${publicationName}` : `by ${authorName}`}`;
      case 'professional':
        return `Professional work by ${authorName}`;
      case 'publication':
        return `Publication by ${authorName}`;
      case 'background':
        return `Background information about ${authorName}`;
      default:
        return `Content by ${authorName}`;
    }
  };

  // Get tags for keywords - using JSON tags exclusively
  const getTags = (fm: any, type: string) => {
    // Use tags field from JSON data (unified approach)
    if (fm.tags) return fm.tags;
    if (fm.keywords) return fm.keywords;
    return [];
  };

  const description = getDescription(contentType, frontmatter);
  const keywords = getTags(frontmatter, contentType);

  return {
    title: `${title} | NorthWorks`,
    description: description,
    keywords: Array.isArray(keywords) ? keywords : [],
    openGraph: {
      title: title,
      description: description,
      type: 'article',
      siteName: 'NorthWorks'
    }
  };
}

export default async function UniversalContentPage({ params }: PageProps) {
  const { slug } = await params;

  // Handle both single w- prefixed pages and categorized pages
  let contentType: string;
  let itemSlug: string;
  let route: string | undefined;

  if (slug.length === 1 && slug[0].startsWith('w-')) {
    // Direct w- prefixed page
    itemSlug = slug[0];
    // Get content to determine actual type
    const content = getContentBySlug(itemSlug, false);
    contentType = content?.frontmatter.type || 'professional';
    route = undefined; // No route for direct w- pages
  } else if (slug.length === 2) {
    // Categorized page (e.g., /interviews/c-name)
    const [routeFromSlug, slugFromRoute] = slug;
    route = routeFromSlug;
    contentType = routeToContentType[route];
    itemSlug = slugFromRoute;
    
    if (!contentType) {
      notFound();
    }
  } else {
    notFound();
  }

  const contentData = getContentBySlug(itemSlug, false);

  if (!contentData || contentData.frontmatter.type !== contentType) {
    notFound();
  }

  // Get HTML content for rendering
  const htmlContentData = getContentBySlug(itemSlug, true);

  if (!htmlContentData) {
    notFound();
  }

  // Generate breadcrumbs based on the routing pattern
  let breadcrumbs;
  if (route) {
    // Categorized page: use route-based breadcrumbs
    const breadcrumbConfig = getBreadcrumbConfig(contentType, itemSlug);
    // Convert old config to new breadcrumb format
    breadcrumbs = [
      { label: 'Home', href: '/', active: false },
      { label: breadcrumbConfig.grandParentLabel, href: breadcrumbConfig.grandParentPath, active: false },
      { label: breadcrumbConfig.parentLabel, href: breadcrumbConfig.parentPath, active: false },
      { label: contentData.frontmatter.title, href: `/${route}/${itemSlug}`, active: true }
    ];
  } else {
    // Direct w- page: use simplified breadcrumbs
    breadcrumbs = [
      { label: 'Home', href: '/', active: false },
      { label: 'D. Warner North', href: '/warner', active: false },
      { label: contentData.frontmatter.title, href: `/${itemSlug}`, active: true }
    ];
  }

  const collection: CollectionType = getCollectionFromSlug(itemSlug || '');

  return (
    <UnifiedLayout breadcrumbs={breadcrumbs}>
      <PageTitle 
        title={contentData.frontmatter.title}
        size="medium"
        align="left"
      />
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: htmlContentData.content }} />
      </div>
    </UnifiedLayout>
  );
}
