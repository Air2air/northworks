import { loadNormalizedContent, generateNormalizedMetadata, generateContentTypeParams } from '@/lib/page-templates';
import UnifiedContentPage from '@/components/pages/UnifiedContentPage';
import { getAllContentSlugs } from '@/lib/content';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface PublicationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PublicationPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const normalizedData = await loadNormalizedContent(resolvedParams.slug, 'publication');
  
  if (!normalizedData) {
    return {
      title: 'Publication Not Found | NorthWorks',
      description: 'The requested publication could not be found.'
    };
  }

  return generateNormalizedMetadata(normalizedData);
}

export default async function PublicationPage({ params }: PublicationPageProps) {
  const resolvedParams = await params;
  const normalizedData = await loadNormalizedContent(resolvedParams.slug, 'publication');
  
  if (!normalizedData) {
    notFound();
  }

  return (
    <UnifiedContentPage 
      data={normalizedData}
      backLinkOverride={{
        label: "← Back to Publications",
        href: "/publications"
      }}
    />
  );
}

export async function generateStaticParams() {
  const allSlugs = getAllContentSlugs();
  return generateContentTypeParams('publication', allSlugs)
    .filter(({ slug }) => !slug.startsWith('w-'));
}
