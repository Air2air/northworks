import { notFound } from 'next/navigation';
import { getContentBySlug, getAllContentSlugs } from '@/lib/content';
import ContentDetailLayout from '@/components/layouts/ContentDetailLayout';
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

      // Find matching route for this content type
      const route = Object.keys(routeToContentType).find(
        (key) => routeToContentType[key] === contentType
      );

      if (route) {
        params.push({
          slug: [route, slug],
        });
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
  
  // Validate slug structure
  if (!slug || slug.length !== 2) {
    return {
      title: 'Content Not Found | NorthWorks',
      description: 'The requested content could not be found.'
    };
  }

  const [route, itemSlug] = slug;
  const contentType = routeToContentType[route];

  if (!contentType) {
    return {
      title: 'Content Not Found | NorthWorks',
      description: 'The requested content type is not available.'
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

  // Validate slug structure (should be [contentType, itemSlug])
  if (!slug || slug.length !== 2) {
    notFound();
  }

  const [route, itemSlug] = slug;
  const contentType = routeToContentType[route];

  if (!contentType) {
    notFound();
  }

  // Get the content
  const contentData = getContentBySlug(itemSlug, false);

  if (!contentData || contentData.frontmatter.type !== contentType) {
    notFound();
  }

  const breadcrumbConfig = getBreadcrumbConfig(contentType, itemSlug);
  const collection = itemSlug && itemSlug.startsWith("w-") ? "warner" : "cheryl";

  return (
    <ContentDetailLayout
      frontmatter={contentData.frontmatter}
      content={contentData.content}
      slug={itemSlug}
      contentType={contentType}
      breadcrumbConfig={breadcrumbConfig}
      collection={collection}
    />
  );
}
