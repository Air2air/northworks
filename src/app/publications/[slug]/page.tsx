import { getContentBySlug, getAllContentSlugs } from '@/lib/content';
import { PublicationFrontmatter } from '@/types/content';
import ImageGallery from '@/components/ImageGallery';
import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import PublicationInfo from '@/components/ui/PublicationInfo';
import SectionGrid from '@/components/ui/SectionGrid';
import { cleanTitle } from '@/lib/pathUtils';
import { formatDate } from '@/lib/dateUtils';
import { shouldUseSectionCards } from '@/lib/sectionParser';
import { notFound } from 'next/navigation';
import Tags from '@/components/ui/Tags';
import type { Metadata } from 'next';

interface PublicationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PublicationPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const contentData = getContentBySlug(resolvedParams.slug, false);
  
  if (!contentData || contentData.frontmatter.type !== 'publication') {
    return {
      title: 'Publication Not Found | NorthWorks',
      description: 'The requested publication could not be found.'
    };
  }

  const frontmatter = contentData.frontmatter as PublicationFrontmatter;
  const title = cleanTitle(frontmatter.title);
  
  // Build description from available publication info
  let description = `Publication by D. Warner North`;
  if (frontmatter.publication?.publisher) {
    description += ` published by ${frontmatter.publication.publisher}`;
  }
  if (frontmatter.journal) {
    description += ` in ${frontmatter.journal}`;
  }
  if (frontmatter.publication?.date) {
    description += ` (${frontmatter.publication.date})`;
  }
  description += '.';

  return {
    title: `${title} | Publications | D. Warner North | NorthWorks`,
    description: description,
    keywords: (frontmatter as any).tags || frontmatter.subjects || [],
    openGraph: {
      title: title,
      description: description,
      type: 'article',
      siteName: 'NorthWorks'
    }
  };
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

  // Check if this content should use section cards instead of traditional layout
  const useSectionCards = shouldUseSectionCards(contentData.content);

  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Publications', href: '/publications', active: false },
    { label: cleanTitle(frontmatter.title), href: `/publications/${resolvedParams.slug}`, active: true }
  ];

  // If using section cards, render SectionGrid instead
  if (useSectionCards) {
    return (
      <PageLayout breadcrumbs={breadcrumbs}>
        <SectionGrid 
          content={contentData.content}
          frontmatter={frontmatter}
        />
        
        {/* Back to Publications */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <a
            href="/publications"
            className="inline-flex items-center text-sky-600 hover:text-sky-800 transition-colors"
          >
            ← Back to Publications
          </a>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <PageTitle 
        title={frontmatter.title}
        size="medium"
        align="left"
      />
      
      {frontmatter.publication && (
        <PublicationInfo 
          date={frontmatter.publication.date ? formatDate(frontmatter.publication.date) : undefined}
          publication={frontmatter.publication.publisher}
          author={frontmatter.publication.author}
          title="Publication Info"
        />
      )}

      {(frontmatter as any).tags && (frontmatter as any).tags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Subjects</h3>
          <Tags 
            tags={(frontmatter as any).tags} 
            variant="compact"
            collection="warner"
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

      {/* Back to Publications */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <a
          href="/publications"
          className="inline-flex items-center text-sky-600 hover:text-sky-800 transition-colors"
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
