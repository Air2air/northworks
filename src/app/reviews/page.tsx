import { getContentByType } from '@/lib/content';
import PageTitle from '@/components/ui/PageTitle';
import Link from 'next/link';

export default function ReviewsPage() {
  // Get individual reviews
  const individualReviews = getContentByType('review');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Simple list of reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {individualReviews.map((review) => (
            <article key={review.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <Link href={`/reviews/${review.slug}`}>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {review.frontmatter.title}
                  </h3>
                  <p className="text-sm text-blue-600">
                    Click to read review →
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {individualReviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No reviews available at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
