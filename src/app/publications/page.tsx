import { getContentBySlug } from '@/lib/content';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import PageTitle from '@/components/ui/PageTitle';
import { generateBreadcrumbsFromFrontmatter } from '@/lib/breadcrumbUtils';
import { generateMetadataFromContent } from '@/lib/metadataUtils';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadataFromContent('w-publications', {
  collection: 'warner',
  type: 'website'
});

export default function PublicationsPage() {
  const content = getContentBySlug('w-publications', false); // Get raw markdown for MDX
  const breadcrumbs = generateBreadcrumbsFromFrontmatter('w-publications');

  if (!content) {
    return (
      <UnifiedLayout breadcrumbs={breadcrumbs}>
        <div className="text-center">
          <PageTitle title="Publications Not Found" size="small" />
          <p className="mt-2 text-gray-600">The publications information could not be loaded.</p>
        </div>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout 
      breadcrumbs={breadcrumbs}
      frontmatter={content.frontmatter}
      content={content.content}
      slug="w-publications"
      contentType="publications"
      breadcrumbConfig={{
        parentPath: '/warner',
        parentLabel: 'D. Warner North'
      }}
      collection="warner"
    />
  );
}