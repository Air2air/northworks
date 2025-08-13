import { getContentBySlug, getAllContentSlugs } from '@/lib/content';
import { InterviewFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import ImageGallery from '@/components/ImageGallery';
import { cleanTitle } from '@/lib/pathUtils';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import { notFound } from 'next/navigation';

interface InterviewPageProps {
  params: {
    slug: string;
  };
}

export default async function InterviewPage({ params }: InterviewPageProps) {
  const resolvedParams = await params;
  const contentData = getContentBySlug(resolvedParams.slug);
  
  if (!contentData || contentData.frontmatter.type !== 'interview') {
    notFound();
  }

  const frontmatter = contentData.frontmatter as InterviewFrontmatter;
  const mdxSource = await serialize(contentData.content);

  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Interviews', href: '/interviews', active: false },
    { label: cleanTitle(frontmatter.title), href: `/interviews/${resolvedParams.slug}`, active: true }
  ];

  // Add breadcrumbs to frontmatter
  const enhancedFrontmatter = {
    ...frontmatter,
    breadcrumbs
  };

  return (
    <ContentLayout frontmatter={enhancedFrontmatter}>
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{cleanTitle(frontmatter.title)}</h1>
          
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
              <div className="flex flex-wrap gap-2">
                {frontmatter.subjects.map((subject, index) => (
                  <span 
                    key={index}
                    className="inline-block px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <MDXRemote {...mdxSource} />
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
    </ContentLayout>
  );
}

export async function generateStaticParams() {
  const slugs = getAllContentSlugs();
  
  // Filter for interview content only
  const interviewSlugs = slugs.filter(slug => {
    const content = getContentBySlug(slug);
    return content?.frontmatter.type === 'interview';
  });

  return interviewSlugs.map((slug) => ({
    slug,
  }));
}
