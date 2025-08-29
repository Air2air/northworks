import { getReviewContent } from '@/lib/unified-data';
import { generateListingBreadcrumbs } from '@/lib/breadcrumbUtils';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import UnifiedList from '@/components/ui/UnifiedList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reviews | Cheryl North | NorthWorks',
  description: 'Classical music reviews and performance critiques by Cheryl North, covering opera, symphony, and chamber music.',
  keywords: ['classical music reviews', 'opera reviews', 'symphony reviews', 'Cheryl North', 'performance critiques'],
  openGraph: {
    title: 'Reviews | Cheryl North | NorthWorks',
    description: 'Classical music reviews and performance critiques by Cheryl North.',
    type: 'website',
    siteName: 'NorthWorks'
  }
};

export default function ReviewsPage() {
  // Load normalized review content data
  const reviewContent = getReviewContent();

  // Generate breadcrumbs using centralized utility
  const breadcrumbs = generateListingBreadcrumbs('review');

  return (
        <UnifiedLayout breadcrumbs={breadcrumbs}>
      <PageTitle
        title="Reviews"
        description="Classical music performance reviews by Cheryl North"
        align="left"
        size="medium"
      />

      {reviewContent && reviewContent.length > 0 ? (
        <UnifiedList
          items={reviewContent}
          options={{
            layout: 'list',
            itemsPerPage: 20,
            pagination: true,
            sortBy: 'date',
            sortOrder: 'desc'
          }}
          collection="cheryl"
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No reviews found.</p>
        </div>
      )}
    </UnifiedLayout>
  );
}
