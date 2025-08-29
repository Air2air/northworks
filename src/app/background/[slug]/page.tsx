import { loadNormalizedContent, generateNormalizedMetadata, generateContentTypeParams } from '@/lib/page-templates';
import UnifiedContentPage from '@/components/pages/UnifiedContentPage';
import { getAllContentSlugs } from '@/lib/content';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface BackgroundPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BackgroundPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const normalizedData = await loadNormalizedContent(resolvedParams.slug, 'background');
  
  if (!normalizedData) {
    return {
      title: 'Background Information Not Found | NorthWorks',
      description: 'The requested background information could not be found.'
    };
  }

  return generateNormalizedMetadata(normalizedData);
}

export default async function BackgroundPage({ params }: BackgroundPageProps) {
  const resolvedParams = await params;
  const normalizedData = await loadNormalizedContent(resolvedParams.slug, 'background');
  
  if (!normalizedData) {
    notFound();
  }

  return (
    <UnifiedContentPage 
      data={normalizedData}
      backLinkOverride={{
        label: "← Back to Background",
        href: "/background"
      }}
    />
  );
}

export async function generateStaticParams() {
  const allSlugs = getAllContentSlugs();
  return generateContentTypeParams('background', allSlugs)
    .filter(({ slug }) => !slug.startsWith('w-'));
}
