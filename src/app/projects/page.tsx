import { getContentBySlug } from '@/lib/content';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import PageTitle from '@/components/ui/PageTitle';
import { generateMetadataFromContent } from '@/lib/metadataUtils';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadataFromContent('w-projects', {
  collection: 'warner',
  type: 'website'
});

export default function ProjectsPage() {
  const content = getContentBySlug('w-projects', true);

  if (!content) {
    return (
      <UnifiedLayout>
        <div className="text-center">
          <PageTitle title="Projects Not Found" size="small" />
          <p className="mt-2 text-gray-600">The projects information could not be loaded.</p>
        </div>
      </UnifiedLayout>
    );
  }

  // SIMPLIFIED: Auto-generates breadcrumbs from slug prefix (w- = Warner)
  return (
    <UnifiedLayout 
      frontmatter={content.frontmatter}
      content={content.content}
      slug="w-projects"
      contentType="professional"
      collection="warner"
    />
  );
}
