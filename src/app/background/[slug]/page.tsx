import { getContentBySlug, getAllContentSlugs } from '@/lib/content';
import { BackgroundFrontmatter } from '@/types/content';
import ImageGallery from '@/components/ImageGallery';
import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import { cleanTitle } from '@/lib/pathUtils';
import { formatDate } from '@/lib/dateUtils';
import { notFound } from 'next/navigation';
import Tags from '@/components/ui/Tags';
import type { Metadata } from 'next';

interface BackgroundPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BackgroundPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const contentData = getContentBySlug(resolvedParams.slug, false);
  
  if (!contentData || contentData.frontmatter.type !== 'background') {
    return {
      title: 'Background Information Not Found | NorthWorks',
      description: 'The requested background information could not be found.'
    };
  }

  const frontmatter = contentData.frontmatter as BackgroundFrontmatter;
  const title = cleanTitle(frontmatter.title);
  
  // Build description from available background info
  let description = `Background information about D. Warner North`;
  if (frontmatter.profession) {
    description += ` - ${frontmatter.profession}`;
  }
  description += '.';

  return {
    title: `${title} | Background | D. Warner North | NorthWorks`,
    description: description,
    keywords: (frontmatter as any).tags || frontmatter.subjects || [],
    openGraph: {
      title: title,
      description: description,
      type: 'profile',
      siteName: 'NorthWorks'
    }
  };
}

export default async function BackgroundPage({ params }: BackgroundPageProps) {
  const resolvedParams = await params;
  const contentData = getContentBySlug(resolvedParams.slug, false); // Get raw content for type checking
  
  if (!contentData || contentData.frontmatter.type !== 'background') {
    notFound();
  }

  // Get HTML content for rendering
  const htmlContentData = getContentBySlug(resolvedParams.slug, true);
  
  if (!htmlContentData) {
    notFound();
  }

  const frontmatter = contentData.frontmatter as BackgroundFrontmatter;

  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Background', href: '/background', active: false },
    { label: cleanTitle(frontmatter.title), href: `/background/${resolvedParams.slug}`, active: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <PageTitle 
        title={frontmatter.title}
        size="medium"
        align="left"
      />
      
      {(frontmatter.profession || frontmatter.education || frontmatter.affiliations) && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Background Details</h3>
          <div className="text-sm text-gray-600 space-y-1">
            {frontmatter.profession && (
              <p><strong>Profession:</strong> {frontmatter.profession}</p>
            )}
            {frontmatter.education && frontmatter.education.length > 0 && (
              <div>
                <strong>Education:</strong>
                <ul className="list-disc list-inside ml-2">
                  {frontmatter.education.map((edu, index) => (
                    <li key={index}>{edu}</li>
                  ))}
                </ul>
              </div>
            )}
            {frontmatter.affiliations && frontmatter.affiliations.length > 0 && (
              <div>
                <strong>Affiliations:</strong>
                <ul className="list-disc list-inside ml-2">
                  {frontmatter.affiliations.map((affiliation, index) => (
                    <li key={index}>{affiliation}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {(frontmatter as any).tags && (frontmatter as any).tags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Subjects</h3>
          <Tags 
            tags={(frontmatter as any).tags} 
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
          <ImageGallery images={frontmatter.images} />
        </section>
      )}

      {/* Back to Background */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <a
          href="/background"
          className="inline-flex items-center text-sky-600 hover:text-sky-800 transition-colors"
        >
          ← Back to Background
        </a>
      </div>
    </PageLayout>
  );
}

export async function generateStaticParams() {
  const slugs = getAllContentSlugs();
  
  // Filter for background content only
  const backgroundSlugs = slugs.filter(slug => {
    const content = getContentBySlug(slug, false); // Use raw content for type checking
    return content?.frontmatter.type === 'background';
  });

  return backgroundSlugs.map((slug) => ({
    slug,
  }));
}
