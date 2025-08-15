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
        align="center"
        size="medium"
      />

      {/* Search hint */}
      <div className="text-center mb-8">
        <Link 
          href="/search"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔍 Search All Content
        </Link>
      </div>

      {/* Reviews */}
      <ContentList 
        items={individualReviews}
        baseUrl="/reviews"
        emptyMessage="No reviews available at this time."
      />
    </PageLayout>
  );
}
