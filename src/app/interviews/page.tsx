import { getInterviewContent } from '@/lib/unified-data';
import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import UnifiedList from '@/components/ui/UnifiedList';
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

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Cheryl', href: '/cheryl', active: false },
    { label: 'Interviews', href: '/interviews', active: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <PageTitle
        title="Classical Music Interviews"
        description="Interviews with major figures on the international, national, and local San Francisco Bay Area classical music scene."
        align="left"
        size="medium"
      />

      <UnifiedList 
        items={interviewContent}
        options={{
          layout: 'list',
          searchable: true,
          filterable: true,
          sortBy: 'date',
          pagination: true,
          groupBy: 'category'
        }}
      />
    </PageLayout>
  );
}