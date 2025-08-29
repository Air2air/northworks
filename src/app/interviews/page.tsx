import { getInterviewContent } from '@/lib/unified-data';
import ContentListingPage, { generateContentListingMetadata } from '@/components/pages/ContentListingPage';
import type { Metadata } from 'next';

export const metadata: Metadata = generateContentListingMetadata('interviews');

export default function InterviewsPage() {
  const interviewContent = getInterviewContent();
  return <ContentListingPage contentType="interviews" items={interviewContent} />;
}