import { getReviewContent } from '@/lib/unified-data';
import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
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

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Reviews', href: '/reviews', active: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <PageTitle
        title="Classical Music Reviews"
        description="Reviews of performances, recordings, and musical events"
        align="left"
        size="medium"
      />

      <UnifiedList 
        items={reviewContent}
        options={{
          layout: 'list',
          searchable: true,
          filterable: true,
          sortBy: 'date',
          pagination: true,
          groupBy: 'category'
        }}
      />
    </PageLayout>
  );
}
