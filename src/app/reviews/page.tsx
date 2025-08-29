import { getReviewContent } from '@/lib/unified-data';
import ContentListingPage from '@/components/pages/ContentListingPage';
import { generateListingMetadata } from '@/lib/metadataUtils';
import type { Metadata } from 'next';

export const metadata: Metadata = generateListingMetadata('reviews', 'cheryl');

export default function ReviewsPage() {
  const reviewContent = getReviewContent();
  return <ContentListingPage contentType="reviews" items={reviewContent} />;
}
