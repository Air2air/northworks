import { getContentBySlug, getAllContentSlugs } from '@/lib/content';
import { loadNormalizedContent, generateNormalizedMetadata, generateContentTypeParams } from '@/lib/page-templates';
import { ProfessionalFrontmatter } from '@/types';
import UnifiedContentPage from '@/components/pages/UnifiedContentPage';
import { cleanTitle } from '@/lib/pathUtils';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface ProfessionalPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProfessionalPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const normalizedData = await loadNormalizedContent(resolvedParams.slug, 'professional');
  
  if (!normalizedData) {
    return {
      title: 'Professional Experience Not Found | NorthWorks',
      description: 'The requested professional experience could not be found.'
    };
  }

  return generateNormalizedMetadata(normalizedData);
}

export default async function ProfessionalPage({ params }: ProfessionalPageProps) {
  const resolvedParams = await params;
  const normalizedData = await loadNormalizedContent(resolvedParams.slug, 'professional');
  
  if (!normalizedData) {
    notFound();
  }

  return (
    <UnifiedContentPage 
      data={normalizedData}
      backLinkOverride={{
        label: "← Back to Professional Experience",
        href: "/professional"
      }}
    />
  );
}

export async function generateStaticParams() {
  const allSlugs = getAllContentSlugs();
  
  // Filter for professional content only, excluding w- prefixed content (handled by direct routes)
  return generateContentTypeParams('professional', allSlugs)
    .filter(({ slug }) => !slug.startsWith('w-'));
}
