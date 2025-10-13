import { getContentBySlug } from '@/lib/content';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import PageTitle from '@/components/ui/PageTitle';
import { generateMetadataFromContent } from '@/lib/metadataUtils';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadataFromContent('w-stanford-experience', {
  collection: 'warner',
  type: 'website'
});

export default function StanfordExperiencePage() {
  const content = getContentBySlug('w-stanford-experience', true);

  if (!content) {
    return (
      <UnifiedLayout>
        <div className="text-center">
          <PageTitle title="Stanford University Projects Not Found" size="small" />
          <p className="mt-2 text-gray-600">The Stanford University projects information could not be loaded.</p>
        </div>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout 
      frontmatter={content.frontmatter}
      content={content.content}
      slug="w-stanford-experience"
      contentType="company"
      breadcrumbConfig={{
        parentLabel: "D. Warner North",
        parentPath: "/warner"
      }}
      collection="warner"
    />
  );
}
