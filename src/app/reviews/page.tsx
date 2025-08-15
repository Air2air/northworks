import { getContentByType } from '@/lib/content';
import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import ContentList from '@/components/ui/ContentList';
import Link from 'next/link';

export default function ReviewsPage() {
  // Get individual reviews
  const individualReviews = getContentByType('review');

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Reviews', href: '/reviews', active: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <PageTitle
        title="Performance Reviews"
        description="Reviews of opera, symphony, and classical music performances in the San Francisco Bay Area."
        align="left"
        size="medium"
      />

      {/* Reviews */}
      <ContentList 
        items={individualReviews}
        baseUrl="/reviews"
        emptyMessage="No reviews available at this time."
      />
    </PageLayout>
  );
}
