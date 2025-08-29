import { getInterviewContent } from '@/lib/unified-data';
import { generateListingBreadcrumbs } from '@/lib/breadcrumbUtils';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import UnifiedContentDisplay from '@/components/ui/UnifiedContentDisplay';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interviews | Cheryl North | NorthWorks',
  description: 'Classical music interviews with major figures in the music world by Cheryl North, featuring artists, conductors, and composers.',
  keywords: ['classical music interviews', 'opera interviews', 'conductor interviews', 'Cheryl North', 'music journalism'],
  openGraph: {
    title: 'Interviews | Cheryl North | NorthWorks',
    description: 'Classical music interviews with major figures in the music world by Cheryl North.',
    type: 'website',
    siteName: 'NorthWorks'
  }
};

export default function InterviewsPage() {
  // Load normalized interview content data
  const interviewContent = getInterviewContent();

  // Generate breadcrumbs using centralized utility
  const breadcrumbs = generateListingBreadcrumbs('interview');

  return (
    <UnifiedLayout breadcrumbs={breadcrumbs}>
      <PageTitle
        title="Classical Music Interviews"
        description="Interviews with major figures on the international, national, and local San Francisco Bay Area classical music scene."
        align="left"
        size="medium"
      />

      <UnifiedContentDisplay
        items={interviewContent}
        preset="cherylContent"
      />
    </UnifiedLayout>
  );
}