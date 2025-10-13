import { getContentBySlug } from '@/lib/content';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import PageTitle from '@/components/ui/PageTitle';
import { generateMetadataFromContent } from '@/lib/metadataUtils';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadataFromContent('w-management', {
  collection: 'warner',
  type: 'website'
});

export default function ManagementPage() {
  const content = getContentBySlug('w-management', true);

  if (!content) {
    return (
      <UnifiedLayout>
        <div className="text-center">
          <PageTitle title="Management Page Not Found" size="small" />
          <p className="mt-2 text-gray-600">The management information could not be loaded.</p>
        </div>
      </UnifiedLayout>
    );
  }

  // SIMPLIFIED: No breadcrumbs or breadcrumbConfig needed!
  // UnifiedLayout auto-generates breadcrumbs from slug prefix (w- = Warner)
  return (
    <UnifiedLayout 
      frontmatter={content.frontmatter}
      content={content.content}
      slug="w-management"
      contentType="background"
      collection="warner"
    />
  );
}
