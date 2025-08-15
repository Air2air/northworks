import { notFound } from 'next/navigation';
import { getContentBySlug, getAllContentSlugs } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';
import PageLayout from '@/components/layouts/PageLayout';
import PageTitle from '@/components/ui/PageTitle';
import ImageGallery from '@/components/ImageGallery';
import Tags from '@/components/ui/Tags';
import { cleanTitle } from '@/lib/pathUtils';

// Map routes to content types
const routeToContentType: Record<string, string> = {
  'interviews': 'interview',
  'articles': 'article', 
  'reviews': 'review',
  'background': 'background',
  'professional': 'professional',
  'publications': 'publication'
};

// Get breadcrumb configuration for each content type
const getBreadcrumbConfig = (contentType: string, slug: string) => {
  // Determine if this is Warner content (w-* prefix)
  const isWarnerContent = slug && slug.startsWith('w-');
  const grandParentPath = isWarnerContent ? '/warner' : '/cheryl';
  const grandParentLabel = isWarnerContent ? 'Warner North' : 'Cheryl North';
  
  const configs = {
    interview: {
      parentPath: '/interviews',
      parentLabel: 'Interviews',
      grandParentPath,
      grandParentLabel
    },
    article: {
      parentPath: '/articles',
      parentLabel: 'Articles',
      grandParentPath,
      grandParentLabel
    },
    review: {
      parentPath: '/reviews',
      parentLabel: 'Reviews',
      grandParentPath,
      grandParentLabel
    },
    background: {
      parentPath: '/background',
      parentLabel: 'Background',
      grandParentPath,
      grandParentLabel
    },
    professional: {
      parentPath: '/professional',
      parentLabel: 'Professional Work',
      grandParentPath,
      grandParentLabel
    },
    publication: {
      parentPath: '/publications',
      parentLabel: 'Publications',
      grandParentPath,
      grandParentLabel
    }
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
        key => routeToContentType[key] === contentType
      );
      
      if (route) {
        params.push({
          slug: [route, slug]
        });
      }
    }
  }
  
  return params;
}

interface PageProps {
  params: Promise<{ slug: string[] }>;
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
  const frontmatter = contentData.frontmatter as any; // Use any to handle different frontmatter types
  
  // Create breadcrumbs dynamically
  const breadcrumbs = [
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
    href: `${breadcrumbConfig.parentPath}/${itemSlug}`,
    active: true
  });

  // Dynamic publication section labels
  const getPublicationLabel = (type: string) => {
    return type === 'interview' ? 'Publication Info' : 'Publication Information';
  };

  // Get appropriate tags field based on content type
  const getTagsField = (frontmatter: any, type: string) => {
    if ((type === 'interview' || type === 'article' || type === 'review') && frontmatter.subjects) {
      return frontmatter.subjects;
    }
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
            size="large"
            align="left"
          />
          
          {/* Publication Information */}
          {frontmatter.publication && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                {getPublicationLabel(contentType)}
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                {frontmatter.publication.date && (
                  <div>
                    <span className="font-medium">Date:</span> {frontmatter.publication.date}
                  </div>
                )}
                {(frontmatter.publication.outlet || frontmatter.publication.publisher) && (
                  <div>
                    <span className="font-medium">Publication:</span> {frontmatter.publication.outlet || frontmatter.publication.publisher}
                  </div>
                )}
                {frontmatter.publication.section && (
                  <div>
                    <span className="font-medium">Section:</span> {frontmatter.publication.section}
                  </div>
                )}
                {frontmatter.publication.author && (
                  <div>
                    <span className="font-medium">Author:</span> {frontmatter.publication.author}
                  </div>
                )}
              </div>
            </div>
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
          <MDXRemote source={contentData.content} />
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
