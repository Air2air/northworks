import { getContentBySlug } from '@/lib/content';
import { ReviewFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import PageTitle from '@/components/ui/PageTitle';
import ContentListComponent, { parseReviewsFromMarkdown } from '@/components/ContentListComponent';
import Image from 'next/image';
import { generateAltText, generateSEOMetadata, getImageDimensions } from '@/lib/uiHelpers';

export default function ReviewsIndexPage() {
  try {
    // Get the reviews index content
    const reviewsData = getContentBySlug('c_reviews');
    
    if (!reviewsData) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <PageTitle 
              title="Reviews"
              description="Content not found"
              size="medium"
              align="center"
            />
          </div>
        </div>
      );
    }

    const frontmatter = reviewsData.frontmatter as ReviewFrontmatter;
    
    // Parse the reviews from the markdown content
    const reviews = parseReviewsFromMarkdown(
      reviewsData.content, 
      frontmatter.images || []
    );

    // Create breadcrumbs
    const breadcrumbs = [
      { label: 'Home', href: '/', active: false },
      { label: 'Cheryl North', href: '/cheryl', active: false },
      { label: 'Reviews', href: '/reviews-index', active: true }
    ];  // Enhanced frontmatter for layout
  const enhancedFrontmatter = {
    ...frontmatter,
    title: 'Performance Reviews',
    seo: {
      title: 'Classical Music Reviews - Cheryl North - NorthWorks',
      description: 'Performance reviews of opera, symphony, and classical music concerts in the San Francisco Bay Area by music journalist Cheryl North.',
      keywords: ['classical music reviews', 'opera reviews', 'symphony reviews', 'San Francisco Opera', 'San Francisco Symphony', 'Berkeley Opera', 'Cheryl North']
    },
    breadcrumbs
  };

  return (
    <ContentLayout frontmatter={enhancedFrontmatter}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          {frontmatter.images?.[0] && (
            <div className="mb-6">
              <Image
                src={frontmatter.images[0].src}
                alt="Reviews"
                className="mx-auto"
                width={frontmatter.images[0].width || 200}
                height={frontmatter.images[0].height || 100}
              />
            </div>
          )}
          
          <div className="max-w-3xl mx-auto">
            <PageTitle
              title="Performance Reviews"
              description="Comprehensive reviews of opera productions, symphony concerts, and classical music performances throughout the San Francisco Bay Area and beyond"
              align="center"
              size="large"
            />
            
            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-green-900 mb-2">About the Reviews</h3>
              <p className="text-green-800">
                These reviews cover performances by major Bay Area organizations including the 
                San Francisco Opera, San Francisco Symphony, Berkeley Opera, Oakland East Bay Symphony, 
                and California Symphony, originally published in the Oakland Tribune and Bay Area News Group publications.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{reviews.length}</div>
            <div className="text-gray-600">Total Reviews</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">Opera</div>
            <div className="text-gray-600">& Symphony</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">15+</div>
            <div className="text-gray-600">Years Covered</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">Bay Area</div>
            <div className="text-gray-600">Focus</div>
          </div>
        </div>

        {/* Reviews List */}
        <ContentListComponent 
          items={reviews}
          title=""
          showThumbnails={false}
          layout="list"
          contentType="reviews"
        />

        {/* Organizations Covered */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Organizations Covered</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div className="text-gray-700">San Francisco Opera</div>
            <div className="text-gray-700">San Francisco Symphony</div>
            <div className="text-gray-700">Berkeley Opera</div>
            <div className="text-gray-700">Oakland East Bay Symphony</div>
            <div className="text-gray-700">California Symphony</div>
            <div className="text-gray-700">Berkeley West Edge Opera</div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Reviews originally published in the Oakland Tribune, Bay Area News Group papers, and Inside Bay Area.
          </p>
        </div>
      </div>
    </ContentLayout>
  );
  } catch (error) {
    console.error('Error loading reviews index:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <PageTitle 
            title="Error"
            description="Failed to load reviews. Please try again later."
            size="medium"
            align="center"
          />
        </div>
      </div>
    );
  }
}
