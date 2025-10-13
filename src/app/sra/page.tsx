import { getContentBySlug } from '@/lib/content';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import PageTitle from '@/components/ui/PageTitle';
import { generateBreadcrumbsFromFrontmatter } from '@/lib/breadcrumbUtils';
import { generateMetadataFromContent } from '@/lib/metadataUtils';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadataFromContent('w-sra', {
  collection: 'warner',
  type: 'website'
});

export default function SRAPage() {
  const content = getContentBySlug('w-sra', true); // Get processed HTML for MDX
  const breadcrumbs = generateBreadcrumbsFromFrontmatter('w-sra');

  if (!content) {
    return (
      <UnifiedLayout breadcrumbs={breadcrumbs}>
        <div className="text-center">
          <PageTitle title="SRA Page Not Found" size="small" />
          <p className="mt-2 text-gray-600">The SRA information could not be loaded.</p>
        </div>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout 
      breadcrumbs={breadcrumbs}
      frontmatter={content.frontmatter}
      content={content.content}
      slug="w-sra"
      contentType="background"
      breadcrumbConfig={{
        parentLabel: "D. Warner North",
        parentPath: "/warner"
      }}
      collection="warner"
    />
  );
}
