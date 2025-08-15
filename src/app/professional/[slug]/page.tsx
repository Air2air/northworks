import { getContentBySlug, getAllContentSlugs } from '@/lib/content';
import { ProfessionalFrontmatter } from '@/types/content';
import ImageGallery from '@/components/ImageGallery';
import PageTitle from '@/components/ui/PageTitle';
import Breadcrumbs from '@/components/Breadcrumbs';
import { cleanTitle } from '@/lib/pathUtils';
import { notFound } from 'next/navigation';
import Tags from '@/components/ui/Tags';

interface ProfessionalPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProfessionalPage({ params }: ProfessionalPageProps) {
  const resolvedParams = await params;
  const contentData = getContentBySlug(resolvedParams.slug, false); // Get raw content for type checking
  
  if (!contentData || contentData.frontmatter.type !== 'professional') {
    notFound();
  }

  // Get HTML content for rendering
  const htmlContentData = getContentBySlug(resolvedParams.slug, true);
  
  if (!htmlContentData) {
    notFound();
  }

  const frontmatter = contentData.frontmatter as ProfessionalFrontmatter;

  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Professional', href: '/warner/professional', active: false },
    { label: cleanTitle(frontmatter.title), href: `/professional/${resolvedParams.slug}`, active: true }
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <Breadcrumbs items={breadcrumbs} />
        <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <PageTitle 
            title={frontmatter.title}
            size="large"
            align="left"
          />
          
          {(frontmatter.organization || frontmatter.position || frontmatter.duration) && (
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
        </header>

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

        {/* Back to Professional */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <a
            href="/warner/professional"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Professional Experience
          </a>
        </div>
        </article>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = getAllContentSlugs();
  
  // Filter for professional content only
  const professionalSlugs = slugs.filter(slug => {
    const content = getContentBySlug(slug, false); // Use raw content for type checking
    return content?.frontmatter.type === 'professional';
  });

  return professionalSlugs.map((slug) => ({
    slug,
  }));
}
