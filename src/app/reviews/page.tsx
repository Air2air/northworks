import { getReviewContent } from '@/lib/unified-data';
import ContentListingPage, { generateContentListingMetadata } from '@/components/pages/ContentListingPage';
import type { Metadata } from 'next';

export const metadata: Metadata = generateContentListingMetadata('reviews');

export default function ReviewsPage() {
  const reviewContent = getReviewContent();
  return <ContentListingPage contentType="reviews" items={reviewContent} />;
}
