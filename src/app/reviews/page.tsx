import { getContentBySlug, getContentByType } from '@/lib/content';
import { ReviewFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import ContentListComponent, { parseReviewsFromMarkdown } from '@/components/ContentListComponent';
import Link from 'next/link';
import Image from 'next/image';

export default function ReviewsPage() {
  // Get both the reviews index and individual reviews
  const reviewsIndexData = getContentBySlug('c_reviews');
  const individualReviews = getContentByType('review');

  const defaultNavigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: false }
  ];

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Reviews', href: '/reviews', active: true }
  ];

  const mockFrontmatter = {
    id: 'reviews',
    title: 'Performance Reviews',
    type: 'article' as const,
    seo: {
      title: 'Classical Music Reviews - NorthWorks',
      description: 'Performance reviews of opera, symphony, and classical music concerts in the San Francisco Bay Area.',
      keywords: ['classical music reviews', 'opera reviews', 'symphony reviews', 'performance reviews']
    },
    navigation: defaultNavigation,
    breadcrumbs
  };

  // Parse reviews from the index if available
  let indexReviews: any[] = [];
  if (reviewsIndexData) {
    const frontmatter = reviewsIndexData.frontmatter as ReviewFrontmatter;
    indexReviews = parseReviewsFromMarkdown(
      reviewsIndexData.content, 
      frontmatter.images || []
    );
  }

  return (
    <ContentLayout frontmatter={mockFrontmatter}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Performance Reviews</h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
          Reviews of opera productions, symphony concerts, and classical music performances 
          throughout the San Francisco Bay Area and beyond.
        </p>

        {/* Show index-based reviews if available */}
        {indexReviews.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Published Reviews Collection</h2>
              <Link 
                href="/reviews-index" 
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                View Full Collection →
              </Link>
            </div>
            <ContentListComponent 
              items={indexReviews.slice(0, 10)} // Show first 10
              title=""
              showThumbnails={false}
              layout="list"
              contentType="reviews"
            />
          </div>
        )}

        {/* Show individual review files */}
        {individualReviews.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {indexReviews.length > 0 ? 'Additional Reviews' : 'All Reviews'}
            </h2>
            <div className="grid gap-6">
              {individualReviews.map((review) => {
                const frontmatter = review.frontmatter as ReviewFrontmatter;
                const heroImage = frontmatter.images?.[0];
                
                return (
                  <article key={review.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex">
                      {heroImage && (
                        <div className="flex-shrink-0 w-48 h-32 relative">
                          <Image
                            src={`/${heroImage.src}`}
                            alt={heroImage.alt || frontmatter.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          <Link 
                            href={`/reviews/${review.slug}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {frontmatter.title}
                          </Link>
                        </h3>
                        
                        {frontmatter.publication && (
                          <div className="text-sm text-gray-500 mb-3">
                            {frontmatter.publication.date && (
                              <span>{frontmatter.publication.date}</span>
                            )}
                            {frontmatter.publication.publisher && (
                              <span> • {frontmatter.publication.publisher}</span>
                            )}
                            {frontmatter.publication.author && (
                              <span> • By {frontmatter.publication.author}</span>
                            )}
                          </div>
                        )}

                        {frontmatter.subjects && frontmatter.subjects.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {frontmatter.subjects.slice(0, 5).map((subject, index) => (
                              <span 
                                key={index}
                                className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-gray-600 text-sm">
                          {review.content.substring(0, 200).replace(/[#*_]/g, '')}...
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {indexReviews.length === 0 && individualReviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No reviews found.</p>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
