import { getContentBySlug } from '@/lib/content';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import PageTitle from '@/components/ui/PageTitle';
import { generateMetadataFromContent } from '@/lib/metadataUtils';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadataFromContent('w-projects-government', {
  collection: 'warner',
  type: 'website'
});

export default function ProjectsGovernmentPage() {
  const content = getContentBySlug('w-projects-government', true);

  if (!content) {
    return (
      <UnifiedLayout>
        <div className="text-center">
          <PageTitle title="Government Service Not Found" size="small" />
          <p className="mt-2 text-gray-600">The government service information could not be loaded.</p>
        </div>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout 
      frontmatter={content.frontmatter}
      content={content.content}
      slug="w-projects-government"
      contentType="company"
      breadcrumbConfig={{
        parentLabel: "D. Warner North",
        parentPath: "/warner"
      }}
      collection="warner"
    />
  );
}
