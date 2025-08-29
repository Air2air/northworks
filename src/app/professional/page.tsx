import { getContentBySlug } from '@/lib/content';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import { generateListingBreadcrumbs } from '@/lib/breadcrumbUtils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Professional Overview | D. Warner North | NorthWorks',
  description: 'Professional activities, consulting work, and career highlights of D. Warner North in risk analysis and decision science.',
  keywords: ['D. Warner North professional', 'risk analysis consulting', 'decision science career', 'professional activities', 'consulting work'],
  openGraph: {
    title: 'Professional Overview | D. Warner North | NorthWorks',
    description: 'Professional activities and career highlights of D. Warner North in risk analysis and decision science.',
    type: 'website',
    siteName: 'NorthWorks'
  }
};

export default function ProfessionalPage() {
  const breadcrumbs = generateListingBreadcrumbs('professional');
  const content = getContentBySlug('w-professional', false); // Get raw markdown for MDX

  if (!content) {
    return (
      <UnifiedLayout breadcrumbs={breadcrumbs}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Professional Information Not Found</h1>
          <p className="mt-2 text-gray-600">The professional information could not be loaded.</p>
        </div>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout 
      breadcrumbs={breadcrumbs}
      frontmatter={content.frontmatter}
      content={content.content}
      slug="w-professional"
      contentType="professional"
      breadcrumbConfig={{
        parentPath: '/warner',
        parentLabel: 'D. Warner North'
      }}
      collection="warner"
    />
  );
}
