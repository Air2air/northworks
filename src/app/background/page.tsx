import { getContentBySlug } from '@/lib/content';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import PageTitle from '@/components/ui/PageTitle';
import { generateBreadcrumbsFromFrontmatter } from '@/lib/breadcrumbUtils';
import { generateMetadataFromContent } from '@/lib/metadataUtils';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadataFromContent('w-background', {
  collection: 'warner',
  type: 'website'
});

export default function BackgroundPage() {
  const content = getContentBySlug('w-background', false); // Get raw markdown for MDX
  const breadcrumbs = generateBreadcrumbsFromFrontmatter('w-background');

  if (!content) {
    return (
      <UnifiedLayout breadcrumbs={breadcrumbs}>
        <div className="text-center">
          <PageTitle title="Background Not Found" size="small" />
          <p className="mt-2 text-gray-600">The background information could not be loaded.</p>
        </div>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout 
      breadcrumbs={breadcrumbs}
      frontmatter={content.frontmatter}
      content={content.content}
      slug="w-background"
      contentType="background"
      collection="warner"
    />
  );
}
