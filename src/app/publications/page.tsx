import { getContentBySlug } from '@/lib/content';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import { generateListingBreadcrumbs } from '@/lib/breadcrumbUtils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Publications | D. Warner North | NorthWorks',
  description: 'Complete publications list, papers, articles, and written works by D. Warner North on risk analysis and decision science.',
  keywords: ['D. Warner North publications', 'risk analysis papers', 'decision science articles', 'academic papers', 'research publications'],
  openGraph: {
    title: 'Publications | D. Warner North | NorthWorks',
    description: 'Complete publications and written works by D. Warner North on risk analysis and decision science.',
    type: 'website',
    siteName: 'NorthWorks'
  }
};

export default function PublicationsPage() {
  const breadcrumbs = generateListingBreadcrumbs('publication');
  const content = getContentBySlug('w-publications', false); // Get raw markdown for MDX

  if (!content) {
    return (
      <UnifiedLayout breadcrumbs={breadcrumbs}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Publications Not Found</h1>
          <p className="mt-2 text-gray-600">The publications list could not be loaded.</p>
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
