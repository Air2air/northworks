import { getContentBySlug } from '@/lib/content';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import { generateListingBreadcrumbs } from '@/lib/breadcrumbUtils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Background | D. Warner North | NorthWorks',
  description: 'Background information, education, and biographical details about D. Warner North, renowned expert in risk analysis and decision science.',
  keywords: ['D. Warner North biography', 'risk analysis expert', 'decision science', 'education', 'professional background', 'career history'],
  openGraph: {
    title: 'Background | D. Warner North | NorthWorks',
    description: 'Background information and biographical details about D. Warner North, expert in risk analysis and decision science.',
    type: 'website',
    siteName: 'NorthWorks'
  }
};

export default function BackgroundPage() {
  const breadcrumbs = generateListingBreadcrumbs('background');
  const content = getContentBySlug('w-background', false); // Get raw markdown for MDX

  if (!content) {
    return (
      <UnifiedLayout breadcrumbs={breadcrumbs}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Background Not Found</h1>
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
      breadcrumbConfig={{
        parentPath: '/warner',
        parentLabel: 'D. Warner North'
      }}
      collection="warner"
    />
  );
}
