import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import SimpleNavigationCard from '@/components/ui/SimpleNavigationCard';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cheryl North - Classical Music Journalist | NorthWorks',
  description: 'Cheryl North is a noted music columnist and critic, writing performance reviews and feature articles for major publications including Opera Now.',
  keywords: ['classical music', 'music criticism', 'opera reviews', 'music journalism', 'Oakland Tribune', 'Opera Now']
};

export default function CherylPage() {
  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Cheryl North', href: '/cheryl', active: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      {/* Hero Section */}
      <PageTitle
        title="Cheryl North"
        description="Classical Music Journalist and Critic specializing in opera and symphony performances"
        align="left"
        size="medium"
      />

      {/* Content Cards */}
      <div className="grid md:grid-cols-3 gap-8 mt-12">
          {/* Interviews Card */}
          <SimpleNavigationCard
            title="Interviews"
            description="In-depth conversations with classical music artists, conductors, and performers"
            href="/interviews"
            buttonText="View Interviews"
            variant="primary"
            icon={
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            }
          />

          {/* Articles Card */}
          <SimpleNavigationCard
            title="Articles"
            description="Feature articles and in-depth analysis of classical music and opera"
            href="/articles"
            buttonText="View Articles"
            variant="secondary"
            icon={
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />

          {/* Reviews Card */}
          <SimpleNavigationCard
            title="Reviews"
            description="Professional reviews of opera, symphony, and classical music performances"
            href="/reviews"
            buttonText="View Reviews"
            variant="tertiary"
            icon={
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            }
          />
        </div>
    </PageLayout>
  );
}
