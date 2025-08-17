import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import SimpleNavigationCard from '@/components/ui/SimpleNavigationCard';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'D. Warner North - Risk Analysis Consultant | NorthWorks',
  description: 'Dr. D. Warner North is principal scientist of NorthWorks, a leading expert in risk analysis and nuclear waste issues with over 50 years of experience.',
  keywords: ['risk analysis', 'nuclear waste', 'consulting', 'Stanford University', 'EPA Science Advisory Board', 'decision analysis'],
  openGraph: {
    title: 'D. Warner North - Risk Analysis Consultant',
    description: 'Leading expert in risk analysis and nuclear waste issues with over 50 years of experience.',
    type: 'profile',
    siteName: 'NorthWorks'
  }
};

export default function WarnerPage() {
  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      {/* Hero Section */}
      <PageTitle
        title="D. Warner North"
        description="Principal Scientist of NorthWorks and leading expert in risk analysis and nuclear waste issues"
        align="left"
        size="medium"
      />

      {/* Content Cards */}
      <div className="grid md:grid-cols-3 gap-8 mt-12">
          {/* Professional Card */}
          <SimpleNavigationCard
            title="Professional Work"
            description="Consulting projects, government service, and academic positions"
            href="/professional"
            buttonText="View Professional Work"
            variant="primary"
            icon={
              <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.394c0 .966-.651 1.806-1.567 2.036l-8.661 2.172a2 2 0 01-2.505-1.936V8.5A2 2 0 0110 6.5V6" />
              </svg>
            }
          />

          {/* Publications Card */}
          <SimpleNavigationCard
            title="Publications"
            description="Books, research papers, reports, and articles"
            href="/publications"
            buttonText="View Publications"
            variant="secondary"
            icon={
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          />

          {/* Background Card */}
          <SimpleNavigationCard
            title="Background"
            description="Education, training, honors, and biographical information"
            href="/background"
            buttonText="View Background"
            variant="tertiary"
            icon={
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            }
          />
        </div>
    </PageLayout>
  );
}
