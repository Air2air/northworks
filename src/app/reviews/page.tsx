import { getAllContentItems } from '@/lib/unifiedSearch';
import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import { ContentCard } from '@/components/ui/ContentCard';

export default function ReviewsPage() {
  // Get reviews from unified content system (includes images)
  const allContent = getAllContentItems();
  const reviews = allContent.filter(item => item.metadata.type === 'review');

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
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sky-600">No reviews available at this time.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <ContentCard
              key={review.metadata.id}
              item={review}
              showImage={true}
              showTags={true}
              showPublication={true}
              className="mb-4"
            />
          ))
        )}
      </div>
    </PageLayout>
  );
}
