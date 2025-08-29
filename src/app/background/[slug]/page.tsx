import { getContentBySlug } from '@/lib/content';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import PageTitle from '@/components/ui/PageTitle';
import { generateBreadcrumbsFromFrontmatter } from '@/lib/breadcrumbUtils';
import { generateMetadataFromContent } from '@/lib/metadataUtils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface BackgroundSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BackgroundSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  return generateMetadataFromContent(slug, {
    collection: 'warner',
    type: 'website'
  });
}

export default async function BackgroundSlugPage({ params }: BackgroundSlugPageProps) {
  const { slug } = await params;
  const content = getContentBySlug(slug, false);
  
  if (!content) {
    notFound();
  }

  const breadcrumbs = generateBreadcrumbsFromFrontmatter(slug);

  return (
    <UnifiedLayout 
      breadcrumbs={breadcrumbs}
      frontmatter={content.frontmatter}
      content={content.content}
      slug={slug}
      contentType="background"
      breadcrumbConfig={{
        parentPath: '/warner',
        parentLabel: 'D. Warner North'
      }}
      collection="warner"
    />
  );
}