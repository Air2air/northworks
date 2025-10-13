import { getContentBySlug } from '@/lib/content';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import PageTitle from '@/components/ui/PageTitle';
import { generateBreadcrumbsFromFrontmatter } from '@/lib/breadcrumbUtils';
import { generateMetadataFromContent } from '@/lib/metadataUtils';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadataFromContent('w-projects', {
  collection: 'warner',
  type: 'website'
});

export default function ProjectsPage() {
  const content = getContentBySlug('w-projects', true); // Get processed HTML for MDX
  const breadcrumbs = generateBreadcrumbsFromFrontmatter('w-projects');

  if (!content) {
    return (
      <UnifiedLayout breadcrumbs={breadcrumbs}>
        <div className="text-center">
          <PageTitle title="Projects Not Found" size="small" />
          <p className="mt-2 text-gray-600">The projects information could not be loaded.</p>
        </div>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout 
      breadcrumbs={breadcrumbs}
      frontmatter={content.frontmatter}
      content={content.content}
      slug="w-projects"
      contentType="company"
      breadcrumbConfig={{
        parentLabel: "D. Warner North",
        parentPath: "/warner"
      }}
      collection="warner"
    />
  );
}
