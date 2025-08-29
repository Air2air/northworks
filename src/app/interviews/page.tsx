import { getInterviewContent } from '@/lib/unified-data';
import ContentListingPage from '@/components/pages/ContentListingPage';
import { generateListingMetadata } from '@/lib/metadataUtils';
import type { Metadata } from 'next';

export const metadata: Metadata = generateListingMetadata('interviews', 'cheryl');

export default function InterviewsPage() {
  const interviewContent = getInterviewContent();
  return <ContentListingPage contentType="interviews" items={interviewContent} />;
}