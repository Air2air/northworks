import { getContentBySlug } from '@/lib/content';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import PageTitle from '@/components/ui/PageTitle';
import { generateBreadcrumbsFromFrontmatter } from '@/lib/breadcrumbUtils';
import { generateMetadataFromContent } from '@/lib/metadataUtils';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadataFromContent('c-about', {
  collection: 'cheryl',
  type: 'website'
});

export default function AboutCherylPage() {
  const content = getContentBySlug('c-about', false); // Get raw markdown for MDX
  const breadcrumbs = generateBreadcrumbsFromFrontmatter('c-about');

  if (!content) {
    return (
      <UnifiedLayout breadcrumbs={breadcrumbs}>
        <div className="text-center">
          <PageTitle title="About Cheryl Not Found" size="small" />
          <p className="mt-2 text-gray-600">The about information could not be loaded.</p>
        </div>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout 
      breadcrumbs={breadcrumbs}
      frontmatter={content.frontmatter}
      content={content.content}
      slug="c-about"
      contentType="bio"
      collection="cheryl"
    />
  );
}
