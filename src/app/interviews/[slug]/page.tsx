import { getContentBySlug, getAllContentSlugs } from '@/lib/content';
import { InterviewFrontmatter } from '@/types/content';
import ImageGallery from '@/components/ImageGallery';
import PageTitle from '@/components/ui/PageTitle';
import Breadcrumbs from '@/components/Breadcrumbs';
import { cleanTitle } from '@/lib/pathUtils';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Tags from '@/components/ui/Tags';

interface InterviewPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function InterviewPage({ params }: InterviewPageProps) {
  const resolvedParams = await params;
  const contentData = getContentBySlug(resolvedParams.slug, false); // Get raw markdown for MDX
  
  if (!contentData || contentData.frontmatter.type !== 'interview') {
    notFound();
  }

  const frontmatter = contentData.frontmatter as InterviewFrontmatter;

  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Interviews', href: '/interviews', active: false },
    { label: cleanTitle(frontmatter.title), href: `/interviews/${resolvedParams.slug}`, active: true }
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
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <MDXRemote source={contentData.content} />
        </div>

        {/* Images Gallery */}
        {frontmatter.images && frontmatter.images.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Related Images</h3>
            <ImageGallery images={frontmatter.images} layout="grid" />
          </section>
        )}

        {/* Back to Interviews */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <a
            href="/interviews"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to All Interviews
          </a>
        </div>
        </article>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = getAllContentSlugs();
  
  // Filter for interview content only
  const interviewSlugs = slugs.filter(slug => {
    const content = getContentBySlug(slug, false); // Use raw content for type checking
    return content?.frontmatter.type === 'interview';
  });

  return interviewSlugs.map((slug) => ({
    slug,
  }));
}
