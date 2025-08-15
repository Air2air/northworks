import { getContentBySlug, getAllContentSlugs } from '@/lib/content';
import { PublicationFrontmatter } from '@/types/content';
import ImageGallery from '@/components/ImageGallery';
import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import { cleanTitle } from '@/lib/pathUtils';
import { notFound } from 'next/navigation';
import Tags from '@/components/ui/Tags';

interface PublicationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PublicationPage({ params }: PublicationPageProps) {
  const resolvedParams = await params;
  const contentData = getContentBySlug(resolvedParams.slug, false); // Get raw content for type checking
  
  if (!contentData || contentData.frontmatter.type !== 'publication') {
    notFound();
  }

  // Get HTML content for rendering
  const htmlContentData = getContentBySlug(resolvedParams.slug, true);
  
  if (!htmlContentData) {
    notFound();
  }

  const frontmatter = contentData.frontmatter as PublicationFrontmatter;

  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Publications', href: '/publications', active: false },
    { label: cleanTitle(frontmatter.title), href: `/publications/${resolvedParams.slug}`, active: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <PageTitle 
        title={frontmatter.title}
        size="medium"
        align="left"
      />
      
      {frontmatter.publication && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Publication Info</h3>
          <div className="text-sm text-gray-600 space-y-1">
            {frontmatter.publication.date && (
              <p><strong>Date:</strong> {frontmatter.publication.date}</p>
            )}
            {frontmatter.publication.publisher && (
              <p><strong>Publisher:</strong> {frontmatter.publication.publisher}</p>
            )}
            {frontmatter.publication.author && (
              <p><strong>Author:</strong> {frontmatter.publication.author}</p>
            )}
          </div>
        </div>
      )}

      {frontmatter.subjects && frontmatter.subjects.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Subjects</h3>
          <Tags 
            tags={frontmatter.subjects} 
            maxVisible={10} 
            variant="compact"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: htmlContentData.content }} />
      </div>

      {/* Images Gallery */}
      {frontmatter.images && frontmatter.images.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Related Images</h3>
          <ImageGallery images={frontmatter.images} layout="grid" />
        </section>
      )}

      {/* Back to Publications */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <a
          href="/publications"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Publications
        </a>
      </div>
    </PageLayout>
  );
}

export async function generateStaticParams() {
  const slugs = getAllContentSlugs();
  
  // Filter for publication content only
  const publicationSlugs = slugs.filter(slug => {
    const content = getContentBySlug(slug, false); // Use raw content for type checking
    return content?.frontmatter.type === 'publication';
  });

  return publicationSlugs.map((slug) => ({
    slug,
  }));
}
